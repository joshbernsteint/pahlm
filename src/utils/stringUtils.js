/**
 * @param {string} str 
 * @param {Array} arr 
 */
function replaceInSequence(str, markerArr, replaceArr){
    for (let i = 0; i < markerArr.length; i++) {
        str = str.replaceAll(markerArr[i], replaceArr[i]);
    }
    return str;
}

function findOffset(...args){
    for (const el of args) {
        if(Number.isInteger(el)) return el;
    }
    return -1;
}


module.exports = {
    replaceInSequence,
    findOffset
}