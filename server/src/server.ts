import {
	createConnection,
	TextDocuments,
	Diagnostic,
	ProposedFeatures,
	InitializeParams,
	DidChangeConfigurationNotification,
	CompletionItem,
	TextDocumentPositionParams,
	TextDocumentSyncKind,
	InitializeResult,

} from 'vscode-languageserver';

import {
	TextDocument
} from 'vscode-languageserver-textdocument';


import { URI } from 'vscode-uri';
import * as fs from 'fs';
import { NDJSON, readErrors, matchErrors } from './errorHandler';
import * as wordComplition from './wordCompletion'
import * as path from 'path';
import * as URL from 'url'
//import * as uri2path from 'file-uri-to-path'



// Create a connection for the server. The connection uses Node's IPC as a transport.
// Also include all preview / proposed LSP features.
let connection = createConnection(ProposedFeatures.all);

// Create a simple text document manager. The text document manager
// supports full document sync only
let documents: TextDocuments<TextDocument> = new TextDocuments(TextDocument);

let hasConfigurationCapability: boolean = false;
let hasWorkspaceFolderCapability: boolean = false;
let hasDiagnosticRelatedInformationCapability: boolean = false;




connection.onInitialize((params: InitializeParams) => {
	let capabilities = params.capabilities;

	// Does the client support the `workspace/configuration` request?
	// If not, we will fall back using global settings
	hasConfigurationCapability = !!(
		capabilities.workspace && !!capabilities.workspace.configuration
	);
	hasWorkspaceFolderCapability = !!(
		capabilities.workspace && !!capabilities.workspace.workspaceFolders
	);
	hasDiagnosticRelatedInformationCapability = !!(
		capabilities.textDocument &&
		capabilities.textDocument.publishDiagnostics &&
		capabilities.textDocument.publishDiagnostics.relatedInformation
	);




	const result: InitializeResult = {
		capabilities: {
			textDocumentSync: TextDocumentSyncKind.Full,
			// Tell the client that the server supports code completion
			completionProvider: {
				resolveProvider: true
			}
		}
	};
	if (hasWorkspaceFolderCapability) {
		result.capabilities.workspace = {
			workspaceFolders: {
				supported: true
			}
		};
	}
	return result;
});

connection.onInitialized(() => {
	if (hasConfigurationCapability) {
		// Register for all configuration changes.
		connection.client.register(DidChangeConfigurationNotification.type, undefined);
	}
	if (hasWorkspaceFolderCapability) {
		connection.workspace.onDidChangeWorkspaceFolders(_event => {
			connection.console.log('Workspace folder change event received.');
		});
	}
});

// The settings
interface Settings {
	maxNumberOfProblems: number
	strictChecks: boolean
	wdChecks: boolean
	performanceHints: boolean
	//PYTHONSETTING
	probHome: string
}


const defaultSettings: Settings = {
	maxNumberOfProblems: 1000,
	probHome: "~/prob_prolog/probcli.sh",
	strictChecks: false,
	wdChecks: false,
	//PYTHONDEFAULT
	performanceHints: false
};

let globalSettings: Settings = defaultSettings;

// Cache the settings of all open documents
let documentSettings: Map<string, Thenable<Settings>> = new Map();

connection.onDidChangeConfiguration(change => {
	if (hasConfigurationCapability) {
		// Reset all cached document settings
		documentSettings.clear();
	} else {
		globalSettings = <Settings>(
			(change.settings.languageServer || defaultSettings)
		);
	}

	// Revalidate all open text documents
	documents.all().forEach(validateTextDocument);
});

function getDocumentSettings(resource: string): Thenable<Settings> {
	if (!hasConfigurationCapability) {
		return Promise.resolve(globalSettings);
	}
	let result = documentSettings.get(resource);
	if (!result) {
		result = connection.workspace.getConfiguration({
			scopeUri: resource,
			section: 'languageServer'
		});
		documentSettings.set(resource, result);
	}
	return result;
}

// Only keep settings for open documents
documents.onDidClose(e => {
	documentSettings.delete(e.document.uri);
});



documents.onDidOpen(change => {
	validateTextDocument(change.document)
})

documents.onDidSave(change => {
	validateTextDocument(change.document)
})

documents.onDidChangeContent(change => {
//	validateTextDocument(change.document);
});





async function validateTextDocument(textDocument: TextDocument): Promise<void> {
	let settings = await getDocumentSettings(textDocument.uri) // Waiting for correct setting; otherwise allways default

	let documentPath: path.ParsedPath = path.parse(URI.parse(textDocument.uri).path);

	let errorDic : string = documentPath.dir + '/tmp'
	let errorPath: string = errorDic + '/_error.json'


	const { exec } = require('child_process');

	if (!fs.existsSync(errorDic)){
		fs.mkdirSync(errorDic);
	}


	fs.writeFile(errorPath, "", () => { }) //Insure a clean error file
	//fs.writeFileSync(errorPath,"",{encoding:'utf8',flag:'w'})
	let command: string = getCommand(URI.parse(textDocument.uri).path, errorPath, settings)
//	console.log(command)
	if (correctPath(settings.probHome)) {
		exec(command, (err: string, stdout: string, stderr: string) => {
			let errorMap: Promise<Map<string, Set<NDJSON>>> = readErrors(errorPath)
			errorMap.then(function (result: Map<string, Set<NDJSON>>) {

				let diagnostics: Array<Diagnostic> = new Array()
				if(result.size != 0)
				{
					let mainFileWritten : boolean = false;
					for (let entry of result) {
						if (entry[0] == textDocument.uri) {
							diagnostics = matchErrors(entry[1], textDocument)
						} else {
							diagnostics = matchErrors(entry[1])
						}
						
						connection.sendDiagnostics({ uri: entry[0], diagnostics });
						
						/**
						 * TL;DR we need to cast here to clean the main file 
						 * 
						 * This is a little bit of a mess here: Problem the paths in the _error.json a system relevant
						 * and system centered e.g. /home/sebastian...
						 * 
						 * The URI from the textdocument is domain centered e.g. file///home/sebastian in order to deal
						 * with remote files like serverXYZ///home/michael
						 * 
						 * However the extension.ts can deal with system centric paths and uris, but we need a comparision
						 * so we have to cast here...
						 */
						if(URI.parse(entry[0]).toString() == textDocument.uri){
							mainFileWritten = true
						}
					}

					if(mainFileWritten == false){
						// The main file has no errors, we need to reset it...
						diagnostics = new Array()
						connection.sendDiagnostics({ uri: textDocument.uri, diagnostics });

					}
				}
				else{
					connection.sendDiagnostics({ uri: textDocument.uri, diagnostics });
				}
			}, function (err) {
				connection.sendNotification("parse_error_prob", "there are things wrong with the parse results " + err)
			});
		

		if(!stdout.includes('ProB Command Line Interface'))
		{
			connection.sendNotification("path_error_prob", "could not call/reach probcli "+ command)	
		}
			
		})
	}

	fs.writeFile(errorPath, "", () => { }) //Insure a clean error file

}




function getCommand(documentPath: string, errorPath: string, settings: Settings): string {
	let wdCmd = ""
	let strict = ""
	let perf = ""
//	console.log(documentPath)
	//PYTHONVAR

	if (settings.wdChecks == true) {
		wdCmd = " -wd-check -release_java_parser "
	}

	if (settings.strictChecks == true) {
		strict = " -p STRICT_CLASH_CHECKING TRUE -p TYPE_CHECK_DEFINITIONS TRUE -lint "
	}

	if (settings.performanceHints == true) {
		perf = " -p PERFORMANCE_INFO TRUE "
	}

	//PYTHONIF

	return settings.probHome + ' -p MAX_INITIALISATIONS 0 -version '
		+ perf
		+ strict
		+ wdCmd
		/*PYTHONCMD*/
		+ documentPath
		+ " -p "
		+ "NDJSON_ERROR_LOG_FILE "
		+ errorPath
}


function correctPath(path: string): boolean {
	try {
		fs.accessSync(path)
	} catch (e) {
		connection.sendNotification("path_error_prob", path + " seems to be the wrong path to ProB")
		return false
	}
	return true
}


// This handler provides the initial list of the completion items.
connection.onCompletion(

	(textDocumentPosition: TextDocumentPositionParams): CompletionItem[] => {
		return wordComplition.selectCompletion(textDocumentPosition)
	}
);






//Can be used to enrich completion with more infos
connection.onCompletionResolve(
	(item: CompletionItem) => { return item })


// for open, change and close text document events
documents.listen(connection);

// Listen on the connection
connection.listen();
