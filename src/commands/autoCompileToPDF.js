const vscode = require('vscode');
const path = require('path');
const fs = require('fs');

/**
 * @param {vscode.TextEditor} textEditor 
 * @param {vscode.TextEditorEdit} edit 
 * @param  {...any} args 
 */
async function autoCompileToPDF(textEditor, edit, ...args){

}

module.exports = {
    id: "pahlm.compile.auto.pdf",
    type: "editor",
    run: autoCompileToPDF
}