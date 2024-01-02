import parseFile from "../parser.js"
/**
 * Treats whatever is inputted as basic text
 * @param {string} input 
 */
function text(fullString, group1){
    return `<span>${parseFile(group1,false)}</span>`;
}

export default {
    text: text,
}