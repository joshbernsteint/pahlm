const Stack = require('./Stack.js');
const Queue = require('./Queue.js');

const preventBrackets = /(?<!\{[^]*)#1#N(?<!\s*\})#2/gm;

function createPattern(pattern, argument, flags, varOffset=false, name=/[]/){
    if(typeof pattern === "object")
        return [pattern,(varOffset) ? undefined : 1];
    else{
        let base = pattern.split(name);
        let argIndex = 0;
        base = base.map(el => {
            if(!argument) argument = [flags.maxBracesDepth];
            else if(!Array.isArray(argument)) argument = [argument];
            el = el.replaceAll(/#!|#@/g, (s) => {
                if(s === "#!"){
                    const replace = argument[argIndex % argument.length].source;
                    argIndex++;
                    return replace;
                }
                else{
                    argIndex++;
                    varOffset = true;
                    return flags.maxBracesDepth.source;
                }
            });
            return el;
        });

        if(base.length === 1){
            return [new RegExp(base[0], 'gm'), (varOffset) ? undefined : (argIndex + 1)];
        }
        else{
            return [new RegExp("(?<!\\{[^\\\\\\}]*)#1#N(?<!\\s*\\})#2".replace(/#1/,base[0]).replace(/#N/, name).replace(/#2/,base[1]), 'gm'), (varOffset) ? undefined : (argIndex + 1)]
        }
    }
}

function findOffset(...args){
    let index;
    args.every(el => {
        if(Number.isInteger(el)){
            index = el;
            return false;
        }
        return true;
    });
    return index;
}

function replaceAt(str, index, endIndex, replacement){
    return str.substring(0, index) + replacement + str.substring(endIndex);
}

module.exports = {
    Stack:Stack,
    Queue: Queue,
    createPattern: createPattern,
    findOffset: findOffset,
    replaceAt: replaceAt
}