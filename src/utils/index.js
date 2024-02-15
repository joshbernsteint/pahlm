const Stack = require('./Stack.js');
const Queue = require('./Queue.js');
const {replaceInSequence, findOffset} = require('./stringUtils.js');

function parseOrientation(orientation, options={}){
    const validAlignments = /l|L|r|R|c|C/;
    const alignMap = {"l": "left", "r": "right", "c": "center"};
    const result = {
        numCols: 0,
        numBorders: 0,
        begin: "",
        end: "",
        columns: [],
        spacers: [],
    }

    const everyChar = orientation.split('');
    everyChar.forEach((char,i) => {
        if(!validAlignments.test(char) && (i === 0 || i === everyChar.length - 1)){
            //Parse & last first character
            if(options.validEdges){
                if(i === 0){
                    if(options.validEdges.begin.includes(char)){
                        result.begin = char;
                    }
                    else
                        throw `Invalid edge value ${char}`;
                }
                else if(i === everyChar.length - 1){
                    if(options.validEdges.end.includes(char)){
                        result.end = char;
                    }
                    else
                        throw `Invalid edge value ${char}`;
                }
            }
            else{
                if(i === 0){
                    result.begin = char;
                }
                else if(i === everyChar.length - 1){
                    result.end = char;
                }
            }
        }
        else if(char !== "|"){
            if(!validAlignments.test(char)){
                throw 'Invalid alignment value';
            }
            else{
                result.numCols++;
                result.columns.push(alignMap[char.toLowerCase()]);
            }
        }
        else{
            result.numBorders++;
            result.spacers.push({
                type: 'line',
                atIndex: i - 1
            });
        }
    });

    return result;
}



function replaceAt(str, index, endIndex, replacement){
    return str.substring(0, index) + replacement + str.substring(endIndex);
}

module.exports = {
    Stack:Stack,
    Queue: Queue,
    replaceInSequence,
    findOffset: findOffset,
    replaceAt: replaceAt,
    parseOrientation,
}