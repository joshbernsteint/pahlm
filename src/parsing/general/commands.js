const { parseOrientation } = require("../../utils");


function makeTable(flags, orientation, data){
    const tableData = parseOrientation(orientation, {validEdges: {begin: ["|"], end: ["|"]}});
    // console.log(tableData);
    return data;
}

function newCommand(flags, numArgs, initialString){

}



module.exports =  {
    makeTable,
    newCommand
}