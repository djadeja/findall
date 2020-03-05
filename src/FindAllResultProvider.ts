'use strict';

import * as vscode from 'vscode';

export default class FindAllResultProvider implements
	vscode.TextDocumentContentProvider, vscode.DocumentLinkProvider {

	private links: vscode.DocumentLink[];
	private docContent : string;

	constructor() {
		this.links = [];
		this.docContent = 'content';
	}

	dispose() {

	}
	static scheme = "findall";


	provideTextDocumentContent(uri: vscode.Uri, token: vscode.CancellationToken): vscode.ProviderResult<string> {

		var os = require('os');			
		const fs = require('fs');
		const readline = require('readline');

		this.docContent = '';
		this.links = []

		const [ searchSymbol, currentlyOpenUri] = <[string, vscode.Uri]>JSON.parse(uri.query);
		const filePath = currentlyOpenUri.fsPath;

		var contents = fs.readFileSync(filePath, 'utf8');

		let targetLineNum = 1;
		let resultCount = 0;

		const lines = contents.split('\n');
		lines.forEach((line: string | string[]) => {

			let fromIndex = 0;
			do
			{
				fromIndex = line.indexOf(searchSymbol, fromIndex+1);
				if (fromIndex != -1) {

					// Add found line to search result.
					this.docContent += line + os.EOL;

					resultCount++;

					// Create link in result line, which points to target location
					const linkRange = new vscode.Range(resultCount, fromIndex, resultCount, fromIndex + searchSymbol.length);
					const linkTarget = vscode.Uri.parse(`file:${filePath}#${targetLineNum}`);
					const docLink = new vscode.DocumentLink(linkRange, linkTarget);
					this.links.push(docLink);
					
				}
			}
			while(fromIndex != -1)

			targetLineNum++;
		});
		
		return 'Search "' + searchSymbol + '" (' + resultCount + ' hits in 1 file)' + os.EOL + this.docContent;
	}

	provideDocumentLinks(document: vscode.TextDocument, token: vscode.CancellationToken): vscode.ProviderResult<vscode.DocumentLink[]> {
		
		return this.links;
	}

}