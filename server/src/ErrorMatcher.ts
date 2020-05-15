import { Diagnostic, DiagnosticSeverity } from 'vscode-languageserver'
import { TextDocument } from 'vscode-languageserver-textdocument'
import * as fs from 'fs';
import * as readline from 'readline'


export class ErrorMatcher{


	async matchError(target:TextDocument, errorPath:string):Promise<Set<Diagnostic>>{
		var diagnostics: Set<Diagnostic> = new Set()

		var stream = fs.createReadStream( errorPath)
		
		const rl = readline.createInterface({
			input: stream,
			crlfDelay: Infinity
		  });
		
		  for await (const line of rl) {
			let obj:Error = JSON.parse(line)
			
			var diagnostic:Diagnostic = {
				severity: DiagnosticSeverity.Error,
				range: {
					start: 
					{
						character: obj.error.start.col,
						line:obj.error.start.line - 1
					},
					end: {
						character:obj.error.end.col,
						line :obj.error.end.line -1 
					}

				},
				message: obj.error.message,
				source: 'prob_prolog'
			};
			diagnostics.add(diagnostic)	  
		}
		return diagnostics
	}
}

interface Error{
	error : { 
		message : string
		type : string	
		file : string
		start : {
			line :  number
			col : number
		}
		end : {
			line :  number
			col : number
		}
	};	
}