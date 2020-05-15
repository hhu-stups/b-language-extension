/* --------------------------------------------------------------------------------------------
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 * ------------------------------------------------------------------------------------------ */

import {
	createConnection,
	TextDocuments,
	Diagnostic,
	DiagnosticSeverity,
	ProposedFeatures,
	InitializeParams,
	DidChangeConfigurationNotification,
	CompletionItem,
	CompletionItemKind,
	TextDocumentPositionParams,
	TextDocumentSyncKind,
	InitializeResult

} from 'vscode-languageserver';

import {
	TextDocument
} from 'vscode-languageserver-textdocument';

import { URI } from 'vscode-uri';
import * as fs from 'fs';
import {ErrorMatcher} from './ErrorMatcher'
import * as path from 'path'

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

// The example settings
interface ExampleSettings {
	maxNumberOfProblems: number;
}

// The global settings, used when the `workspace/configuration` request is not supported by the client.
// Please note that this is not the case when using this server with the client provided in this example
// but could happen with other clients.
const defaultSettings: ExampleSettings = { maxNumberOfProblems: 1000 };
let globalSettings: ExampleSettings = defaultSettings;

// Cache the settings of all open documents
let documentSettings: Map<string, Thenable<ExampleSettings>> = new Map();

connection.onDidChangeConfiguration(change => {
	if (hasConfigurationCapability) {
		// Reset all cached document settings
		documentSettings.clear();
	} else {
		globalSettings = <ExampleSettings>(
			(change.settings.languageServerExample || defaultSettings)
		);
	}

	// Revalidate all open text documents
	documents.all().forEach(validateTextDocument);
});

function getDocumentSettings(resource: string): Thenable<ExampleSettings> {
	if (!hasConfigurationCapability) {
		return Promise.resolve(globalSettings);
	}
	let result = documentSettings.get(resource);
	if (!result) {
		result = connection.workspace.getConfiguration({
			scopeUri: resource,
			section: 'languageServerExample'
		});
		documentSettings.set(resource, result);
	}
	return result;
}

// Only keep settings for open documents
documents.onDidClose(e => {
	documentSettings.delete(e.document.uri);
});

documents.onDidSave(change => {

	validateTextDocument(change.document)
})

// The content of a text document has changed. This event is emitted
// when the text document first opened or when its content has changed.
documents.onDidChangeContent(change => {
//	validateTextDocument(change.document);
});

async function validateTextDocument(textDocument: TextDocument): Promise<void> {
	// In this simple example we get the settings for every validate run.
	let settings = await getDocumentSettings(textDocument.uri);

	let pathy:path.ParsedPath = path.parse(URI.parse(textDocument.uri).path);

	let dic:string = pathy.dir
	
	let probCliHome:string = '/home/sebastian/prob_prolog/probcli.sh'

	let ndjson:string = 'NDJSON_ERROR_LOG_FILE '
	let errorPath:string = dic+'/_error.json'
	const {exec} = require('child_process');
	let command:string = probCliHome + ' -p MAX_INITIALISATIONS 0 -version -p STRICT_CLASH_CHECKING TRUE -p TYPE_CHECK_DEFINITIONS TRUE '
	
	fs.writeFile(errorPath, "", () =>{}) //Insure a clean error dictonary
	let command2:string = command +  URI.parse(textDocument.uri).path + " -p " + ndjson + errorPath;
	
	
	let diagnostics : Array<Diagnostic> = new Array()
	let diagnosticsPromise : Promise<Set<Diagnostic>>


	exec(command2, (err:string, stdout:string, stderr:string) => {
		let bla = new ErrorMatcher()
	    diagnosticsPromise =  bla.matchError(textDocument, errorPath)

		diagnosticsPromise.then(function(result:Set<Diagnostic>){
			console.log("success")
			diagnostics = Array.from(result)
			connection.sendDiagnostics({ uri: textDocument.uri, diagnostics});

		}, function(err){
			connection.sendDiagnostics({ uri: textDocument.uri, diagnostics})
		})
	  });


}


connection.onDidChangeWatchedFiles(_change => {
	// Monitored files have change in VSCode
	connection.console.log('We received an file change event');
});



// This handler provides the initial list of the completion items.
connection.onCompletion(
	(textDocumentPosition: TextDocumentPositionParams): CompletionItem[] => {
		// The pass parameter contains the position of the text document in
		// which code complete got requested. For the example we ignore this
		// info and always provide the same completion items.
	//	console.log("textpos"  + textDocumentPosition);
		return [
			{
				label: 'MACHINE',
				kind: CompletionItemKind.Text,
				data: 1
			},
			{
				label: 'VARIABLES',
				kind: CompletionItemKind.Text,
				data: 2
			},
			{
				label: 'CONSTANTS',
				kind: CompletionItemKind.Text,
				data: 3
			},
			{
				label: 'OPERATIONS',
				kind: CompletionItemKind.Text,
				data: 4
			}
		];
	}
);

// This handler resolves additional information for the item selected in
// the completion list.
connection.onCompletionResolve(
	(item: CompletionItem): CompletionItem => {
		if (item.data === 1) {
			item.detail = 'TypeScript details';
			item.documentation = 'TypeScript documentation';
		} else if (item.data === 2) {
			item.detail = 'JavaScript details';
			item.documentation = 'JavaScript documentation';
		}
		return item;
	}
);

/*
connection.onDidOpenTextDocument((params) => {
	// A text document got opened in VSCode.
	// params.textDocument.uri uniquely identifies the document. For documents store on disk this is a file URI.
	// params.textDocument.text the initial full content of the document.
	connection.console.log(`${params.textDocument.uri} opened.`);
});
connection.onDidChangeTextDocument((params) => {
	// The content of a text document did change in VSCode.
	// params.textDocument.uri uniquely identifies the document.
	// params.contentChanges describe the content changes to the document.
	connection.console.log(`${params.textDocument.uri} changed: ${JSON.stringify(params.contentChanges)}`);
});
connection.onDidCloseTextDocument((params) => {
	// A text document got closed in VSCode.
	// params.textDocument.uri uniquely identifies the document.
	connection.console.log(`${params.textDocument.uri} closed.`);
});
*/

// Make the text document manager listen on the connection
// for open, change and close text document events
documents.listen(connection);

// Listen on the connection
connection.listen();
