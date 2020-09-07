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
	StreamInfo
} from 'vscode-languageclient';

import * as net from 'net';

import * as path from 'path'
import { spawn } from 'child_process';


let client: LanguageClient;

export function activate(context: ExtensionContext) {

	const serverHome = context.asAbsolutePath(path.join('node_modules', 'b-language-server', 'build', 'libs', 'b-language-server-all.jar'))
	const javaHome : string = workspace.getConfiguration("common").get("javaHome")



	//Start the server
	let prc = spawn(javaHome, ['-jar', serverHome])
	

	prc.stdout.on('data', function(data){
	


	let connectionInfo = {
		port : 55556
	}


	let serverOptions : ServerOptions = () => {
		let socket = net.connect(connectionInfo);
        let result: StreamInfo = {
            writer: socket,
            reader: socket
        };
        return Promise.resolve(result);
	}


	let debugChannle = window.createOutputChannel("ProB language server")
	debugChannle.appendLine("starting server " )

	//debugChannle.appendLine("fs exits " + fs.existsSync(serverHome))
	// Options to control the language client
	let clientOptions: LanguageClientOptions = {
		// Register the server for B files
		documentSelector: [{ scheme: 'file', language: 'classicalb' }, { scheme: 'file', language: 'rmchAddOn' }],
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

	const debugMode : Boolean = workspace.getConfiguration("languageServer").get("debugMode")
	if(!debugMode){
		debugChannle.hide()
	}else{
		debugChannle.show()
	}

	console.log(workspace.getConfiguration("languageServer").get("debugMode"))
	
	window.onDidOpenTerminal(() => 
	{
		showDebugMessages(debugChannle)
	})	
	})
	
}

function showDebugMessages(debugChannle : OutputChannel){
	const debugMode : Boolean = workspace.getConfiguration("languageServer").get("debugMode")
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


 

