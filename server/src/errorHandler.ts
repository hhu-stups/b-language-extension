import { Diagnostic, DiagnosticSeverity } from 'vscode-languageserver'
import { TextDocument, Position } from 'vscode-languageserver-textdocument'
import * as fs from 'fs';
import * as readline from 'readline'



/**
 * Reads the error file, casts the errors to a readable form, sorts them by origin
 * @param errorPath the path to the file where the ndjson errors are stored
 */
export async function readErrors(errorPath: string): Promise<Map<string, Set<NDJSON>>> {
	let result: Map<string, Set<NDJSON>> = new Map()

	var stream = fs.createReadStream(errorPath)

	const rl = readline.createInterface({
		input: stream,
		crlfDelay: Infinity
	});


	let i : number = 1
	for await (const line of rl) {

		let obj: NDJSON 
		
		try{
			console.log(line)
			 obj = JSON.parse(line)
		}catch(e){
			throw Error(e.message + " at line " + line)
		}
		i++
		let path: string = obj.details.file


		if (!result.has(path)) {
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

		let content: JBody = info.details

		// Managing case we get conent with no error massage
		if (content.start.line == -1 && content.start.col == -1 && content.end.line == -1 && content.end.col == -1) {
			if (file != undefined) {
				//Due to server architecture we only have the most actual document
				let targetLine = getFirstOccurence(file).line
				content.start = { line: targetLine, col: 0 }
				content.end = { line: targetLine, col: Number.MAX_VALUE }
			} else {
				//Fallback if an error occurs on  differnt document
				content.start = { line: 1, col: 0 }
				content.end = { line: 1, col: Number.MAX_VALUE }
			}
		}

		let diagnostic = {
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

		result.push(diagnostic)
	}

	return result

}


////////////// Representation of the NDJSON File
export interface NDJSON {
	type: string
	details: JBody
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

