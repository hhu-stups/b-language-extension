import { Diagnostic, DiagnosticSeverity } from 'vscode-languageserver'
import { TextDocument } from 'vscode-languageserver-textdocument'
import * as fs from 'fs';
import * as readline from 'readline'
import {XOR} from 'ts-xor'

export class ErrorMatcher{


	async matchError(target:TextDocument, errorPath:string):Promise<Set<Diagnostic>>{
		var diagnostics: Set<Diagnostic> = new Set()

		var stream = fs.createReadStream( errorPath)
		
		const rl = readline.createInterface({
			input: stream,
			crlfDelay: Infinity
		  });
		


		  for await (const line of rl) {
			let obj : XOR<Error, Warning> = JSON.parse(line)
			let diagnostic : Diagnostic
			console.log(obj)

			let serveity : DiagnosticSeverity 
			let content : ErrorOrWarning
			if(obj.error ){
				content = obj.error
				serveity = DiagnosticSeverity.Error
			}
			else{
				if(obj.warning){
					content = obj.warning
					serveity = DiagnosticSeverity.Warning
				}else{
					throw new Error("Parsed Object is neither Warning nor Error - this is wrong")
				}
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
							character:content.end.col,
							line :content.end.line -1 
						}
					},
					message: content.message,
					source: 'prob_prolog'
				};						
			diagnostics.add(diagnostic)	  
		}
		return diagnostics
	}


}



export interface Error{
	error : ErrorOrWarning;
	
}

export interface Warning{
	warning : ErrorOrWarning
}

export interface ErrorOrWarning {
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
  
  