import {
	workspace,
	ExtensionContext,
	window,
	TextEditor,
	StatusBarAlignment,
	OutputChannel,
} from 'vscode';


import {
	LanguageClient,
	LanguageClientOptions,
	ServerOptions,
	StreamInfo
} from 'vscode-languageclient/node';

import * as net from 'net';

import * as path from 'path'
import {  spawn } from 'child_process';


let client: LanguageClient;
let debugChannle: OutputChannel = null;

export function activate(context: ExtensionContext) {

	const serverHome = context.asAbsolutePath(path.join('node_modules', 'b-language-server', 'build', 'libs', 'b-language-server-all.jar'))
	const javaHome: string = workspace.getConfiguration("common").get("javaHome")


	let prc  = spawn(javaHome, ['-jar', serverHome])

	prc.stdout.on('data', function (data : Buffer) {

		let portAsStringWithBrackets : String = data.toString()
		let closingBracketPos : number = portAsStringWithBrackets.indexOf(">")
		let portNumber : number = parseInt(portAsStringWithBrackets.substring(1, closingBracketPos))

		let connectionInfo = {
			port: portNumber,
		}
	

		let serverOptions: ServerOptions = () => {
			let socket = net.connect(connectionInfo);
			let result: StreamInfo = {
				writer: socket,
				reader: socket
			};
			return Promise.resolve(result);
		}


		if (debugChannle == null) {
			debugChannle = window.createOutputChannel("ProB language server")
		}


		// Options to control the language client
		let clientOptions: LanguageClientOptions = {
			// Register the server for B files
			documentSelector: [{ scheme: 'file', language: 'classicalb' }, { scheme: 'file', language: 'rmchAddOn' }],
			synchronize: {
				// Notify the server about file changes to '.clientrc files contained in the workspace
				fileEvents: workspace.createFileSystemWatcher('**/.clientrc')
			},
			outputChannel: debugChannle,

		}

		// Create the language client and start the client.
		client = new LanguageClient('languageServer', 'languageServer', serverOptions, clientOptions)

		let item = window.createStatusBarItem(StatusBarAlignment.Right, Number.MIN_VALUE);

		item.text = 'Starting ProB LSP...';
		toggleItem(window.activeTextEditor, item);
	
		client.start();

		const debugMode: Boolean = workspace.getConfiguration("languageServer").get("debugMode")
		if (!debugMode) {
			debugChannle.hide()
		} else {
			debugChannle.show()
		}



		window.onDidOpenTerminal(() => {
			showDebugMessages(debugChannle)
		})

	})
}

function showDebugMessages(debugChannle: OutputChannel) {
	const debugMode: Boolean = workspace.getConfiguration("languageServer").get("debugMode")
	if (debugMode) {
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
	if (editor && editor.document &&
		(editor.document.languageId === 'B')) {
		item.show();
	} else {
		item.hide();
	}
}




