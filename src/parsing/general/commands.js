const { parseOrientation, replaceInSequence } = require("../../utils");


function makeTable(flags, orientation, data){
    const tableData = parseOrientation(orientation, {validEdges: {begin: ["|"], end: ["|"]}});
    console.log(tableData);
    //Ignore this
    const preRows = data.replaceAll("\n","").split(/(\&bsol\;)|(\s\s\s+)|(\\hline)/g,).filter(el => {
        if(!el || el.trim().length === 0 || el === '&bsol;')
            return false;
        return true;
    }).map(el => el.trim()); 

    console.log(preRows);
    const doneRows = [];
    let borderFlag = undefined;
    for (let i = 0; i < preRows.length; i++) {
        const curRow = preRows[i];
        if(curRow === "\\hline"){
            if(i === 0){
                borderFlag = "top";
            }
            else{
                borderFlag = "bottom";
            }
        }
        else{
            const elements = curRow.split("&");
            console.log(elements);
            borderFlag = undefined;
        }
    }

    if(borderFlag)
        return `<table style="border-${borderFlag}: 1px solid black">${doneRows.join('')}</table`;
    else
        return `<table>${doneRows.join('')}</table`;

}

function newCommand(flags, commandName, numArgs, initialString){
    const result = {
        pattern: undefined,
        run: undefined,
    };
    numArgs = Number(numArgs);
    if(!Number.isInteger(numArgs)) return initialString;
    else if(numArgs === 0){
        result.pattern = new RegExp(commandName, 'gm');
        result.run = () => initialString;
    }
    else{
        const argPatterns = [...Array.from(Array(numArgs+1).keys()).splice(1)].map(el => new RegExp("#"+el,'gm'));
        result.pattern = [new RegExp("\\" + commandName, 'gm')].concat(new Array(numArgs).fill(["{","}"]));
        result.run = (flags, s, ...args) => flags.customCommands.parser(replaceInSequence(initialString, argPatterns, args), flags);
    }
    flags.customCommands.registered.push({...result});
    return "";
}



module.exports =  {
    makeTable,
    newCommand
}