const {matchCurlyBraces} = require('../../utils/counting.js');
const { parseOrientation } = require("../../utils");

function setBracketDepth(flags, full, val){
    const toNum = Number(val);
    if(isNaN(toNum)) return "";
    flags.maxBracesDepth =  matchCurlyBraces(toNum);
    return "";
}

function makeTable(flags, orientation, data){
    const tableData = parseOrientation(orientation, {validEdges: {begin: ["|"], end: ["|"]}});
    // console.log(tableData);
    return data;
}



module.exports =  {
    setBracketDepth: setBracketDepth,
    makeTable,
}