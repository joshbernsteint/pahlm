import parseFile from "../parser.js"
/**
 * Treats whatever is inputted as basic text
 * @param {string} input 
 */
function text(flags, fullString, group1){
    return `<span>${parseFile(group1, false, flags)}</span>`;
}

export default {
    text: text,
}