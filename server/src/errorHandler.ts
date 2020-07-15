import { Diagnostic, DiagnosticSeverity } from 'vscode-languageserver'
import { TextDocument, Position } from 'vscode-languageserver-textdocument'
import * as fs from 'fs';
import * as readline from 'readline'



export async function readErrors(errorPath: string) : Promise<Array<string>>{

	let lines : Array<string> = new Array()

	var stream = fs.createReadStream(errorPath)

	const rl = readline.createInterface({
		input: stream,
		crlfDelay: Infinity
	});

	for await(const line of rl){
		lines.push(line)
	}

	return lines
}


/**
 * Reads the error file, casts the errors to a readable form, sorts them by origin
 * @param errorLines an array containing all errors
 */
export function buildErrors(errorLines : Array<string> ): Map<string, Set<NDJSON>> {
	let result: Map<string, Set<NDJSON>> = new Map()

	let i : number = 2
	for (const line of errorLines) {

		let obj: NDJSON 

		try{
		    obj = JSON.parse(line)
		}catch(e){
			throw Error(e.message + " at line " + line)
		}
		i++
		let path = obj.file


		
		if(!result.has(path)){
			result.set(path, new Set())
		}
		
		result.get(path)!.add(obj)
	}

	return result
}

/**
 * Builds diagnostics for a given Set of infos
 * @param infos the set of infos to build diagnostics with
 */
export function matchErrors(infos: Set<NDJSON>, file?: TextDocument | undefined): Array<Diagnostic> {
	let result: Array<Diagnostic> = new Array()
	for (var info of infos) {

		let serveity: DiagnosticSeverity = DiagnosticSeverity.Error

		if (info.type == "error") {
			serveity = DiagnosticSeverity.Error
		}

		if (info.type == "warning") {
			serveity = DiagnosticSeverity.Warning
		}

		if (info.type == "information") {
			serveity = DiagnosticSeverity.Information
		}


		// Managing case we get conent with no error massage
		if (info.start.line == -1 && info.start.col == -1 && info.end.line == -1 && info.end.col == -1) {
			if (file != undefined) {
				//Due to server architecture we only have the most actual document
				let targetLine = getFirstOccurence(file).line
				info.start = { line: targetLine, col: 0 }
				info.end = { line: targetLine, col: Number.MAX_VALUE }
			} else {
				//Fallback if an error occurs on  differnt document
				info.start = { line: 1, col: 0 }
				info.end = { line: 1, col: Number.MAX_VALUE }
			}
		}

		let diagnostic : Diagnostic = {
			severity: serveity,
			range: {
				start:
				{
					character: info.start.col,
					line: info.start.line - 1
				},
				end: {
					character: info.end.col,
					line: info.end.line - 1
				}
			},
			message: info.message,
			source: info.file,
			code : "probcli v." + info.prob_version

		};

		result.push(diagnostic)
	}

	return result

}


////////////// Representation of the NDJSON File
export interface NDJSON {
	type: string
	message: string
	reason: string
	file: string
	start: StartOrEnd
	end: StartOrEnd
	prob_version : string
}




export interface StartOrEnd {
	line: number;
	col: number;
}




///////////////////


/**
 * Returns the exakt positiion of the first occurence of an non whitespace token
 * @param textdocument the Textdocument to analzie
 */
function getFirstOccurence(textdocument: TextDocument): Position {
	let counter: number = textdocument.getText().search(/\S|$/)
	let pos: Position = textdocument.positionAt(counter)
	pos.line = pos.line + 1
	return pos
}

