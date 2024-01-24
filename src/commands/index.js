const vscode = require('vscode');
const commands = [
    require('./compileToPDF'), 
    require('./compileToHTML'),
    require("./autoCompileToHTML"),
    require("./autoCompileToPDF"),
];


function registerCommands(){
    const disposables = commands.map(com => {
        if(com.type === "editor"){
            return vscode.commands.registerTextEditorCommand(com.id, (...args) => com.run(...args));
        }
        else{
            return vscode.commands.registerCommand(com.id, (...args) => com.run(...args));
        }
    });
    return disposables;
}


module.exports = {
    registerCommands: registerCommands
};