
import {

	CompletionItem,
	CompletionItemKind,
	TextDocumentPositionParams,

} from 'vscode-languageserver';

export function selectCompletion(textDocumentPosition : TextDocumentPositionParams) : CompletionItem[]{


	if(textDocumentPosition.textDocument.uri.endsWith(".mch")){
		return completionCommon().concat(completionAbstractMachine()).concat(completionCommonAbstract())
	}

	if(textDocumentPosition.textDocument.uri.endsWith(".ref")){
		return completionCommon().concat(completionRefinement()).concat(completionCommonAbstract())
	}

	if(textDocumentPosition.textDocument.uri.endsWith(".imp")){
		return completionCommon().concat(completionImplementation())
	}

	if(textDocumentPosition.textDocument.uri.endsWith(".sys")){
		return completionEventB()
	}

	return []

}


function completionAbstractMachine() : CompletionItem[] {
		
	return [
		{
			label: 'MACHINE',
			kind: CompletionItemKind.Text,
			data: 1
		}
	]
}

function completionImplementation() : CompletionItem[] {
		
	return [
		{
			label: 'IMPLEMENTIATION',
			kind: CompletionItemKind.Text,
		},
		{
			label: 'IMPORTS',
			kind: CompletionItemKind.Text,
		}
	]
}


function completionRefinement() : CompletionItem[] {
		
	return [
		{
			label: 'REFINEMENT',
			kind: CompletionItemKind.Text,
		},
		{
			label: 'REFINES',
			kind: CompletionItemKind.Text,
		},
		
	]
}

function completionCommon() : CompletionItem[] {
		
	return [
		{
			label: 'SEES',
			kind: CompletionItemKind.Text,
		},
		{
			label: 'INCLUDES',
			kind: CompletionItemKind.Text,
		},
		{
			label: 'PROMOTES',
			kind: CompletionItemKind.Text,
		},
		{
			label: 'EXTENDS',
			kind: CompletionItemKind.Text,
		},
		{
			label: 'SETS',
			kind: CompletionItemKind.Text,
		},
		{
			label: 'CONCRETE_CONSTANTS',
			kind: CompletionItemKind.Text,
		},
		{
			label: 'PROPERTIES',
			kind: CompletionItemKind.Text,
		},
		{
			label: 'CONCRETE_VARIALBES',
			kind: CompletionItemKind.Text,
		},
		{
			label: 'INVARIANT',
			kind: CompletionItemKind.Text,
		},
		{
			label: 'ASSERTIONS',
			kind: CompletionItemKind.Text,
		},
		{
			label: 'INITIALIZATION',
			kind: CompletionItemKind.Text,
		},
		{
			label: 'OPERATIONS',
			kind: CompletionItemKind.Text,
		}
	]
}

function completionCommonAbstract() : CompletionItem[] {
	return [
		{
			label: 'VARIABLES',
			kind: CompletionItemKind.Text,
		},
		{
			label: 'CONSTANTS',
			kind: CompletionItemKind.Text,
		}
	]
}



function completionEventB() : CompletionItem[] {
		
	return [
		{
			label: 'CONTEXT',
			kind: CompletionItemKind.Text,
		},
		{
			label: 'EXTENDS',
			kind: CompletionItemKind.Text,
		},
		{
			label: 'SETS',
			kind: CompletionItemKind.Text,
		},
		{
			label: 'CONSTANTS',
			kind: CompletionItemKind.Text,
		},
		{
			label: 'AXIOMS',
			kind: CompletionItemKind.Text,
		},
		{
			label: 'END',
			kind: CompletionItemKind.Text,
		},
		{
			label: 'MACHINE',
			kind: CompletionItemKind.Text,
		},
		{
			label: 'REFINES',
			kind: CompletionItemKind.Text,
		},
		{
			label: 'SEES',
			kind: CompletionItemKind.Text,
		},
		{
			label: 'VARIABLES',
			kind: CompletionItemKind.Text,
		}
		,
		{
			label: 'INVARIANT',
			kind: CompletionItemKind.Text,
		},
		{
			label: 'EVENTS',
			kind: CompletionItemKind.Text,
		},
		{
			label: 'EVENT',
			kind: CompletionItemKind.Text,
		},
		{
			label: 'WHERE',
			kind: CompletionItemKind.Text,
		},
		{
			label: 'ANY',
			kind: CompletionItemKind.Text,
		},
		{
			label: 'WITH',
			kind: CompletionItemKind.Text,
		},
		{
			label: 'THEN',
			kind: CompletionItemKind.Text,
		},
		{
			label: 'END',
			kind: CompletionItemKind.Text,
		}
	]
}