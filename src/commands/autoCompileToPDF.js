const vscode = require('vscode');
const path = require('path');
const fs = require('fs');
const toPDF = require("./compileToPDF");
const defaultConfig = require('../defaultConfig');

/**
 * @param {vscode.TextEditor} textEditor 
 * @param {vscode.TextEditorEdit} edit 
 * @param  {...any} args 
 */
async function autoCompileToPDF(textEditor, edit, ...args){
    let orgFileSize = fs.statSync(textEditor.document.fileName).size;
    await vscode.window.withProgress({
        location: vscode.ProgressLocation.Notification,
        title: "Auto Compiling to PDF....",
        cancellable: true
    }, (_, token) => {
        const task = new Promise((res,rej) => {
            const timeout = setInterval(() => {
                if(token.isCancellationRequested){
                    clearInterval(timeout);
                    res();
                }
                else{
                    //Compile to PDF
                    const curSize = fs.statSync(textEditor.document.fileName).size;
                    if(orgFileSize !== curSize){
                        orgFileSize = curSize;
                        toPDF.run(textEditor, edit, 'noOutput', ...args);
                    }
                }
            }, vscode.workspace.getConfiguration().get('pahlm.compile.interval', defaultConfig.autoCompileInterval) * 1000);
        })

        return task;
    });
}

module.exports = {
    id: "pahlm.compile.auto.pdf",
    type: "editor",
    run: autoCompileToPDF
}