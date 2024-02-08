const {basicRegexes, listRegexes} = require("./regexes.js");
const {encode} = require('html-entities');
const {replaceAllRecursive} = require('../utils/myRegExp.js');

const escapeCharacterRegex = /\\([\{\(\[\]\)\}]|[^\s\n](?=\s|\\|$))/gm;

function parseFile(str, flags={}){

    //Remove all comments
    str = str.replaceAll(/<!--[^]*-->/gm, "");

    //Check for escape characters and replace them.
    str = str.replaceAll(escapeCharacterRegex, (s) => encode(s.charAt(1), {mode: "extensive"}));

    //Check for lists

    //Check for basic stuff
    basicRegexes.forEach(item => {
        if(item.grouped){
            item.grouped.forEach(smallItem => {
                if(item.balanced)
                    str = replaceAllRecursive(str, smallItem.pattern, (...args) => smallItem.run(flags, ...args));
                else
                    str = str.replaceAll(smallItem.pattern, (s, ...args) => smallItem.run(flags, s, ...args));
            });
        }
        else{
            if(item.balanced)
                str = replaceAllRecursive(str, item.pattern, (...args) => item.run(flags, ...args));
            else
                str = str.replaceAll(item.pattern, (s, ...args) => {return item.run(flags, s, ...args)});
        }
    });

    return str;
}

module.exports = {
    parseFile: parseFile,
}