const {basicRegexes, preventMatchingRegexes} = require("./regexes.js");
const {encode} = require('html-entities');
const {replaceAllRecursive} = require('../utils/myRegExp.js');
const { Queue } = require("../utils/index.js");

const escapeCharacterRegex = /\\([\{\(\[\]\)\}]|[^\s\n](?=\s|\\|$))/gm;

function parseFile(str, flags={
    customCommands: {
        parser: parseFile,
        registered: [],
    }
}){
    const queue = new Queue(str);
    preventMatchingRegexes.forEach(item => {
        Array.from(str.matchAll(item.pattern)).forEach(mi => {
            queue.addToQueue(mi[0], mi[1],[mi.index, mi.index + mi[0].length], (...args) => item.run(flags, ...args));
        });
    });

    //Remove all comments
    queue.replaceAll(/<!--[^]*?-->/gm, "");
    
    //Check for escape characters and replace them.
    queue.replaceAll(escapeCharacterRegex, (s) => encode(s.charAt(1), {mode: "extensive"}));
    
    
    // Check for basic stuff
    for (const item of basicRegexes) {
        if(item.grouped){
            for (const groupItem of item.grouped){
                queue.replaceAll(groupItem, (...args) => item.run(flags, ...args));
            }
        }
        else{
            queue.replaceAll(item.pattern, (...args) => item.run(flags, ...args));
        }
    }

    //Check for custom commands
    for (const item of flags.customCommands.registered) {
        queue.replaceAll(item.pattern, (...args) => item.run(flags, ...args));
    }

    //Apply the queue
    queue.applyQueue();
    return queue.string;
}

module.exports = {
    parseFile: parseFile,
}