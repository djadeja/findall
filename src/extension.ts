// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import FindAllResultProvider from './FindAllResultProvider';

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {

	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
	console.log('Congratulations, your extension "findall" is now active!');

	const findAllResultDocProvider = new FindAllResultProvider();
	const providerRegistrations = vscode.Disposable.from(
		vscode.workspace.registerTextDocumentContentProvider(FindAllResultProvider.scheme, findAllResultDocProvider),
		vscode.languages.registerDocumentLinkProvider({ scheme: FindAllResultProvider.scheme }, findAllResultDocProvider)
	);

	// The command has been defined in the package.json file
	// Now provide the implementation of the command with registerCommand
	// The commandId parameter must match the command field in package.json
	let disposable = vscode.commands.registerCommand('extension.findAllInCurrentFile', () => {
		// The code you place here will be executed every time your command is executed

		if (vscode.window){
			if (vscode.window.activeTextEditor){
		
				const currentlyOpenUri = vscode.window.activeTextEditor.document.uri;
				const position = vscode.window.activeTextEditor.selection.active;
				const document = vscode.window.activeTextEditor.document;
				const selectedSymbol = document.getText(document.getWordRangeAtPosition(position));

				vscode.window.showInputBox({ value: selectedSymbol, prompt: "Enter the text", 
							placeHolder: "", password: false }).then( (info) => {

					if (info !== undefined && info.length > 0) {

						vscode.window.setStatusBarMessage(info);
						const query = JSON.stringify([info, currentlyOpenUri]);
						let docUri = vscode.Uri.parse(`${FindAllResultProvider.scheme}:${info}.find ?${query}`);
						
						return vscode.workspace.openTextDocument(docUri).then((doc) => {
							vscode.window.showTextDocument(doc.uri, {preserveFocus:false, preview:false});
						});
			
					} else {
						vscode.window.setStatusBarMessage("no text provided");
					}
				});
		
			} else {
				// Display a message box to the user
				vscode.window.showInformationMessage('Text editor is not active');
			}
		} else {
			// Display a message box to the user
			vscode.window.showInformationMessage('VSCcode Window is not active');
		}
	});

	context.subscriptions.push(disposable);
}

// this method is called when your extension is deactivated
export function deactivate() {}
