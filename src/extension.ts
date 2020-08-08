import { 
	workspace, 
	ExtensionContext, 
	window,
	TextEditor,
	StatusBarAlignment, 
	OutputChannel} from 'vscode';


import {
	LanguageClient,
	LanguageClientOptions,
	ServerOptions,
} from 'vscode-languageclient';



let client: LanguageClient;

export function activate(context: ExtensionContext) {

	let serverOptions: ServerOptions = {
		command: '/usr/bin/java',
		args: [ "-jar", "/home/sebastian/IdeaProjects/b-language-server/build/libs/b-language-server-all.jar"]
	};


	let debugChannle = window.createOutputChannel("ProB language server")
	
	// Options to control the language client
	let clientOptions: LanguageClientOptions = {
		// Register the server for B files
		documentSelector: [{ scheme: 'file', language: 'classicalb' }],
		synchronize: {
			// Notify the server about file changes to '.clientrc files contained in the workspace
			fileEvents: workspace.createFileSystemWatcher('**/.clientrc')
		},
		outputChannel : debugChannle,
		
	}

	// Create the language client and start the client.
	client = new LanguageClient('languageServer', 'Language Server', serverOptions, clientOptions)

	let item = window.createStatusBarItem(StatusBarAlignment.Right, Number.MIN_VALUE);

	item.text = 'Starting ProB LSP...';
	toggleItem(window.activeTextEditor, item);

	// Start the client. This will also launch the server
	let disposable = client.start();
	context.subscriptions.push(disposable);

	

	

	workspace.onDidChangeConfiguration(() => {
		
		showDebugMessages(debugChannle)
	})

	client.onDidChangeState(() => {
		showDebugMessages(debugChannle)
		
	})


}

function showDebugMessages(debugChannle : OutputChannel){
	const debugMode : Boolean = workspace.getConfiguration("languageServer").get("debugMode")
	console.log(debugMode)
	if(debugMode)
	{
		debugChannle.show()
	}
}


export function deactivate(): Thenable<void> | undefined {
	if (!client) {
		return undefined;
	}
	return client.stop();
}


function toggleItem(editor: TextEditor, item) {
	if(editor && editor.document &&
		(editor.document.languageId === 'B')){
		item.show();
	} else{
		item.hide();
	}
}

 

