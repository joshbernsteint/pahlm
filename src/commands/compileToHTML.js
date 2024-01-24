const vscode = require('vscode');
const path = require('path');
const fs = require('fs');
const {parseFile} = require('../parsing/parser.js');

/**
 * 
 * @param {vscode.TextEditor} textEditor 
 * @param {vscode.TextEditorEdit} edit 
 * @param  {...any} args 
 */
async function CompileToHTML(textEditor, edit, ...args){
    const html = parseFile(textEditor.document.getText().replaceAll("\r",""));
    const basename = path.basename(textEditor.document.fileName).split('.').slice(0,-1).join('.');
    const dirPath = path.dirname(textEditor.document.fileName);

    if(args.includes('noOutput')){
        try {
            fs.writeFileSync(path.join(dirPath, basename + '.html'), html);
        } catch (error) {
        }
    }
    else{
        await vscode.window.withProgress({
            location: vscode.ProgressLocation.Notification,
            title: "Compiling to HTTML...",
            cancellable: true
        }, () => {
            const task = new Promise((res, rej) => {
                try {
                    fs.writeFileSync(path.join(dirPath, basename + '.html'), html);
                    res();
                } catch (error) {
                    vscode.window.showErrorMessage('File could not be compiled');
                    rej();
                }
            });
    
            return task;
        });
    }
}

module.exports = {
    id: 'pahlm.compile.html',
    type: 'editor',
    run: CompileToHTML
};