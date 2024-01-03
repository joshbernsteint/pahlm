import { Queue } from "../../utils/index.js";
import { mathMacros, mathOperators,mathIdentifiers, mathCommands } from "./math_regexes.js";

function mathParser(string, flags){


    function helper(str){
        if(!isNaN(Number(str)))
            return `<mn>${str}</mn>`;
        



        
        mathOperators.forEach(op => {
            str = str.replaceAll(op.pattern,`<mo>${op.replace}</mo>`);
        });


        
        mathIdentifiers.forEach(id => {
            str = str.replaceAll(id.pattern, `<mi>${id.replace}</mi>`);
        });

        
        for (let i = 0; i < mathMacros.length; i++) {
            const body = mathMacros[i];
            str = str.replaceAll(body.pattern, (s,g1,g2,g3) => {
                let [left,right] = s.split(body.operator);
                if(left[0] === "{" && left[left.length-1] === "}")
                    left = helper(left.substring(1,left.length - 1));
                else
                    left = helper(left);
    
                if(right[0] === "{" && right[right.length-1] === "}")
                    right = helper(right.substring(1,right.length - 1));
                else
                    right = helper(right);
    
                return body.start + left + right + body.end;
            });
        }



        return `<mrow>${str}</mrow>`;
    }

    // Replacing unbound indentifiers
    // string = string.replaceAll(/(?<!\\)\b[a-zA-Z0-9]+/gm,(s) => {
    //     const splitted = s.split('').map(el => `<mi>${el}<mi>`);
    //     return splitted.join('');
    // });

    const mathQueue = new Queue(string);
    
    mathCommands.forEach(command => {
        const regex = new RegExp(command.pattern + flags.maxBracesDepth.pattern.repeat(command.arguments),'gm');
        string = string.replaceAll(regex, (...args) => {
            const startIndex = args[command.offsetIndex];
            const upperIndex = startIndex + args[0].length - 1;
            mathQueue.addToQueue({
                regex: regex,
                substring: args[0],
                sliceLength: 0,
                offsetIndex: command.offsetIndex,
                output: command.run(flags, ...args),
                preventRecursive: true,
            },startIndex, upperIndex, 'mathCommand');
            return args[0];
        });
    });

    string = helper(string);
    return string;
}

export default mathParser;