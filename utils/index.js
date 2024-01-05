import Stack from "./Stack.js";
import Queue from "./Queue.js";


function createPattern(pattern, argument, flags){
    if(typeof pattern === "object")
        return [pattern,1];
    else{
        let argIndex = 0;
        if(!argument) argument = [flags.maxBracesDepth];
        else if(!Array.isArray(argument)) argument = [argument];
        pattern = pattern.replaceAll(/#!|#@/g, (s) => {
            if(s === "#!"){
                const replace = argument[argIndex % argument.length].source;
                argIndex++;
                return replace;
            }
            else{
                argIndex++;
                return flags.maxBracesDepth.source;
            }
        });
        return [new RegExp(pattern, 'gm'), argIndex + 1];
    }
}

export{
    Stack,
    Queue,
    createPattern
}