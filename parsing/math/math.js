import { Queue, createPattern, findOffset, replaceAt } from "../../utils/index.js";
import { mathMacros,mathIdentifiers } from "./math_regexes.js";




function mathParser(string, flags){
    if(!isNaN(Number(string))) return `<mn>${string}</mn>`;

    // console.log('New!');

    const mathQueue = new Queue(string);

    // Math macros and commands
    mathMacros.forEach(command => {
        const fullPattern = createPattern(command.pattern, command.customArgument, flags, (command.variableOffset) ? true : false, command.name);
        mathQueue.match(fullPattern[0]).forEach(match => {
            const offset = match.index;
            match = match.filter(el => el != undefined);
            mathQueue.addToQueue({
                match: match[0],
                preventRecursive: true,
                giveFlags: true,
                pattern: fullPattern[0],
                offsetIndex: fullPattern[1],
                run: command.run,
            }, [offset, offset + match[0].length - 1]);
            
        });
    });




    mathIdentifiers.forEach(id => {
        let lengthDif = 0;
        const replaced = id.op ? `<mo>${id.replace}</mo>` : `<mi>${id.replace}</mi>`;
        mathQueue.match(id.pattern).forEach(match => {
            const lowerIndex = match.index + lengthDif;
            const endIndex = match.index + match[0].length - 1 + lengthDif;
            match = match.filter(el => el != undefined);
            
            mathQueue.addToQueue({
                match: match[0],
                preventRecursive: true,
                pattern: id.pattern,
                offsetIndex: undefined,
                run: () => replaced,
            }, [lowerIndex, endIndex]);

        });
    });


    //Convert lone characters to mathIdentifiers and numbers
    const loneNumAndIdentifier = /(?<!\\)\b[a-zA-Z0-9]+\b(?![^\<]*\>)/gm;
    mathQueue.string = mathQueue.string.replaceAll(loneNumAndIdentifier, (s, index) => {
        if(mathQueue.IsRangeAccessible(index, index + s.length - 1)){
            s = s.replaceAll(/[0-9]+/g, (s2) => `<mn>${s2}</mn>`);
            s = s.replaceAll(/[a-zA-Z](?![^\<]*\>)/g, s2 => `<mi>${s2}</mi>`);
        }
        return s;
    })


    // Apply the queue
    mathQueue.applyQueue((str, q) => {
        q.forEach(el => {
            str = str.replace(el.pattern, (...args) => {
                args = args.filter(el => el != undefined)
                const offset = (el.offsetIndex) ? args[el.offsetIndex] : findOffset(...args);
                // console.log(args);
                if(offset >= el.range[0])
                    return ( el.giveFlags ? el.run(flags,...args) : el.run(...args));
                else{
                    // console.log(args, el.offsetIndex);
                    return args[0];
                }
            });
        });
        return str;
    });
    return `<mrow>${mathQueue.string}</mrow>`;
}

export default mathParser;