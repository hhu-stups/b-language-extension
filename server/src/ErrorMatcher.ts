import { Diagnostic, DiagnosticSeverity } from 'vscode-languageserver'
import { TextDocument, Position } from 'vscode-languageserver-textdocument'
import * as fs from 'fs';
import * as readline from 'readline'
import { Uri } from 'vscode';

export class ErrorMatcher {


    /**
	 * Reads the error file, casts the errors to a readable form, sorts them by origin
	 * @param errorPath the path to the file where the ndjson errors are stored
	 */
	async readErrors(errorPath : string) : Promise<Map<Uri, Set<Error | Warning | Information>>> {
		let result : Map<Uri, Set<Error | Warning | Information>> = new Map()

		var stream = fs.createReadStream(errorPath)

		const rl = readline.createInterface({
			input: stream,
			crlfDelay: Infinity
		});

		type ErrorInfromationWarning = Error | Information | Warning
		for await (const line of rl) {

				let obj: ErrorInfromationWarning = JSON.parse(line)

				let serveity: DiagnosticSeverity
				let content: JBody
				let path : Uri

			

				if (isError(obj)) {
					path = Uri.parse(obj.error.file)
				}
				else {
					if (isWarning(obj)) {
						path = Uri.parse(obj.warning.file)

					} else {
						path = Uri.parse(obj.information.file)

					}
				}

				if(!result.has(path)){
					result.set(path, new Set())
				}

				result.get(path)!.add(obj)
		}

		return result
	}


	matchErrors(infos : Set<Error | Information | Warning>) : Set<Diagnostic>{
		let result : Set<Diagnostic>
		type ErrorInfromationWarning = Error | Information | Warning

		for (let info : ErrorInfromationWarning in infos){

			let serveity : DiagnosticSeverity

			if(isError(info)){
				serveity = DiagnosticSeverity.Error
		
			}else{			
				if(isWarning(info)){
					serveity = DiagnosticSeverity.Warning
				}else{
				serveity = DiagnosticSeverity.Warning
			}}
					

			let diagnostic = {
				severity: serveity,
				range: {
					start:
					{
						character: in.start.col,
						line: content.start.line - 1
					},
					end: {
						character: content.end.col,
						line: content.end.line - 1
					}
				},
				message: content.message,
				source: 'prob_prolog',
				
			};
			diagnostics.add(diagnostic)
		}
			)

	}

	async matchError(target: TextDocument, errorPath: string): Promise<Set<Diagnostic>> {
		var diagnostics: Set<Diagnostic> = new Set()

		var stream = fs.createReadStream(errorPath)

		const rl = readline.createInterface({
			input: stream,
			crlfDelay: Infinity
		});


		for await (const line of rl) {

			try {
				let obj: XOR3<Error, Warning, Information> = JSON.parse(line)

				let diagnostic: Diagnostic
				let serveity: DiagnosticSeverity
				let content: JBody

				if (obj.error) {
					content = obj.error
					serveity = DiagnosticSeverity.Error
				}
				else {
					if (obj.warning) {
						content = obj.warning
						serveity = DiagnosticSeverity.Warning
					} else {
						content = obj.information
						serveity = DiagnosticSeverity.Information
					}
				}

				

				if(content.start.line == -1 && content.start.col == -1 && content.end.line == -1 && content.end.col == -1){
					console.log("Error without position")
					let targetLine = getFirstOccurence(target).line
					console.log("new pos is: " + targetLine)
					content.start = {line : targetLine , col: 0 }
					content.end = {line : targetLine , col: Number.MAX_VALUE }
				}
				
				
				
				diagnostic = {
					severity: serveity,
					range: {
						start:
						{
							character: content.start.col,
							line: content.start.line - 1
						},
						end: {
							character: content.end.col,
							line: content.end.line - 1
						}
					},
					message: content.message,
					source: 'prob_prolog',
					
				};
				diagnostics.add(diagnostic)
			}
			catch (e) {
				throw new Error("unexpected syntax  while parsing _error.json")
			}
		}
		return diagnostics

	}


}


export declare type XOR3<T, U, V> = (T | U | V) extends object ? ((Without<T, U> & U) & (Without<V, U> & U)) |
	((Without<V, T> & T) & (Without<U, T> & T)) |
	((Without<T, V> & V) & (Without<U, V> & V)) : T | U | V;


export declare type Without<T, U> = {
	[P in Exclude<keyof T, keyof U>]?: never;
};


export interface CommonInfo{}

export interface Information extends CommonInfo {
	information : JBody
}


export interface Error extends CommonInfo {
	error: JBody;

}

export interface Warning extends CommonInfo{
	warning: JBody
}

export interface JBody {
	message: string;
	type: string;
	file: string;
	start: StartOrEnd;
	end: StartOrEnd;
}

export interface StartOrEnd {
	line: number;
	col: number;
}

function getFirstOccurence(textdocument : TextDocument) : Position {
	let counter : number = textdocument.getText().search(/\S|$/)
	let pos : Position = textdocument.positionAt(counter)
	pos.line = pos.line + 1
	return pos
}


function isError (potential : CommonInfo) : potential is Error{
	if((potential as Error).error){
		return true
	}else{
		return false
	}
}

function isWarning (potential : CommonInfo) : potential is Warning{
	if((potential as Warning).warning){
		return true
	}else{
		return false
	}
}

function isInformation (potential : CommonInfo) : potential is Information{
	if((potential as Information).information){
		return true
	}else{
		return false
	}
}