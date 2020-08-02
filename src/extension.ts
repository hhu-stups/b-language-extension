import { 
	workspace, 
	ExtensionContext, 
	window,
	WorkspaceConfiguration,
	TextEditor,
	StatusBarAlignment } from 'vscode';


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

	// Options to control the language client
	let clientOptions: LanguageClientOptions = {
		// Register the server for B files
		documentSelector: [{ scheme: 'file', language: 'classicalb' }],
		synchronize: {
			// Notify the server about file changes to '.clientrc files contained in the workspace
			fileEvents: workspace.createFileSystemWatcher('**/.clientrc')
		}
	};

	// Create the language client and start the client.
	client = new LanguageClient('languageServer', 'Language Server', serverOptions, clientOptions)




	client.onReady().then(() => {
		let bla = window.createOutputChannel("internal_error")
		client.onDidChangeState(event => {			bla.appendLine("Error")
	})
		client.onNotification("path_error_prob", (message:string) => {
			window.showErrorMessage('a problem occured: ' + message)
			bla.appendLine("Error")
		});
		client.onNotification("parse_error_prob", (message:string) => {
			window.showErrorMessage('a error occured :' + message)
			bla.appendLine("Error")

		});
		client.onNotification("lsp-test", (message:string) => {
			window.showErrorMessage('test message recived: ' + message)
			bla.appendLine("Error")

		});
	});

	let item = window.createStatusBarItem(StatusBarAlignment.Right, Number.MIN_VALUE);

	

	item.text = 'Starting ProB LSP...';
	toggleItem(window.activeTextEditor, item);

	// Start the client. This will also launch the server
	let disposable = client.start();
	context.subscriptions.push(disposable);
	
}


export function deactivate(): Thenable<void> | undefined {
	if (!client) {
		return undefined;
	}
	return client.stop();
}


function toggleItem(editor: TextEditor, item) {
	if(editor && editor.document &&
		(editor.document.languageId === 'ski')){
		item.show();
	} else{
		item.hide();
	}
}

 

