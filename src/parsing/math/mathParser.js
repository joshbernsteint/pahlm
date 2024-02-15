const {Queue, createPattern, findOffset, replaceAt} = require("../../utils/index.js");
const mathRegexes = require('./regexes.js');
const {mathIdentifiers, mathMacros} = mathRegexes;

function mathParser(str, flags){
    flags.math = {
        parser: mathParser
    };

    if(!isNaN(Number(str)))
        return `<mn>${str}</mn>`;

    const mathQueue = new Queue(str);
    for (const item of mathIdentifiers) {
        if(item.op)
            mathQueue.replaceAll(item.pattern, `<mo>${item.replace}</mo>`);
        else
            mathQueue.replaceAll(item.pattern, `<mi>${item.replace}</mi>`);
    }

    for (const item of mathMacros) {
        if(item.grouped){
            for (const groupItem of item.grouped) {
                mathQueue.replaceAll(groupItem, (...args) => `<mrow>${item.run(flags, ...args)}</mrow>`);
            }
        }
        else
            mathQueue.replaceAll(item.pattern, (...args) => `<mrow>${item.run(flags, ...args)}</mrow>`);
    }

    return mathQueue.string;
}


module.exports = {
    mathParser: mathParser
};