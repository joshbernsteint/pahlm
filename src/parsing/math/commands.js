const { parseOrientation } = require("../../utils");

function parseText(str, flags){
    str = str.trim();
    return str;
}

/**
 * Treats whatever is inputted as basic text
 * @param {string} input 
 */
function text(flags, args){
    return getBracketArgs((g1) => `<mi>${parseText(g1, flags)}</mi>`, args);
}



function makeMatrix(flags, orientation, data){
    const matrixOrientation = parseOrientation(orientation, {validEdges: {begin: ["{", '(', '['], end: ["}",')', "]"]}});
    return data;
}

module.exports = {
    text,
    makeMatrix
}