const path = require('path');
const vscode = require('vscode');
const fs = require('fs');
const toHTML = require('./compileToHTML.js');

/**
 * @param {vscode.TextEditor} textEditor 
 * @param {vscode.TextEditorEdit} edit 
 * @param  {...any} args 
 */
async function autoCompileToHTML(textEditor, edit, ...args){

    let orgFileSize = fs.statSync(textEditor.document.fileName).size;
    await vscode.window.withProgress({
        location: vscode.ProgressLocation.Notification,
        title: "Auto Compiling to HTML....",
        cancellable: true
    }, (_, token) => {
        const task = new Promise((res,rej) => {
            const timeout = setInterval(() => {
                if(token.isCancellationRequested){
                    clearInterval(timeout);
                    res();
                }
                else{
                    //Compile to HTML
                    const curSize = fs.statSync(textEditor.document.fileName).size;
                    if(orgFileSize !== curSize){
                        orgFileSize = curSize;
                        toHTML.run(textEditor, edit, 'noOutput', ...args);
                    }
                }
            }, 2000);
        })

        return task;
    });
}

module.exports = {
    id: "pahlm.compile.auto.html",
    type: "editor",
    run: autoCompileToHTML
}