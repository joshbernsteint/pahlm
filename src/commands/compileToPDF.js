const vscode = require('vscode');
const path = require('path');
const fs = require('fs');
const {parseFile} = require('../parsing/parser.js');
const {Builder} = require('selenium-webdriver');
const firefox = require('selenium-webdriver/firefox.js');

/**
 * 
 * @param {vscode.TextEditor} textEditor 
 * @param {vscode.TextEditorEdit} edit 
 * @param  {...any} args 
 */
async function CompileToPDF(textEditor, edit, ...args){

    const options = new firefox.Options();
    const html = parseFile(textEditor.document.getText().replaceAll("\r",""));
    const filePath = path.join(`${textEditor.document.fileName}_TEMP.html`);
    const dirPath = path.dirname(filePath);
    const basename = path.basename(textEditor.document.fileName).split('.').slice(0,-1).join('.');
    let buffer = undefined;
    options.addArguments('--headless');
    const driver = new Builder().forBrowser('firefox').setFirefoxOptions(options).build();

    if(args.includes('noOutput')){
        try {
            fs.writeFileSync(filePath, html);
            await driver.get('file://' + filePath);
            buffer = await driver.printPage();
            fs.writeFileSync(path.join(dirPath, basename+'.pdf'), buffer, 'base64');
        } catch (error) {
        }
    }
    else{
        await vscode.window.withProgress({
            location: vscode.ProgressLocation.Notification,
            title: "Compiling to PDF...",
            cancellable: true
        }, () => {
            const task = new Promise((res, rej) => {
                try {
                    fs.writeFileSync(filePath, html);
                    driver.get('file://' + filePath).then(() => (driver.printPage()).then((s) => {
                        buffer = s;
                        res();
                    }));
                } catch (error) {
                    vscode.window.showErrorMessage('File could not be compiled');
                    rej();
                }
            });
    
            return task;
        });
        if(buffer)
            fs.writeFileSync(path.join(dirPath, basename+'.pdf'), buffer, 'base64');
    }
    

    fs.rmSync(filePath); //Remove the temp file
    await driver.quit();
}

module.exports = {
    id: 'pahlm.compile.pdf',
    type: 'editor',
    run: CompileToPDF
};