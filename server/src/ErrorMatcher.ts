import { Diagnostic, DiagnosticSeverity } from 'vscode-languageserver'
import { TextDocument } from 'vscode-languageserver-textdocument'
import * as fs from 'fs';
import * as readline from 'readline'

export class ErrorMatcher {


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
					source: 'prob_prolog'
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

export interface Information {
	information: JBody
}


export interface Error {
	error: JBody;

}

export interface Warning {
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

