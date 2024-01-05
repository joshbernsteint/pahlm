import { Queue, createPattern } from "../../utils/index.js";
import { mathMacros, mathOperators,mathIdentifiers, mathCommands } from "./math_regexes.js";

function mathParser(string, flags){
    if(!isNaN(Number(string))) return `<mo>${string}</mo>`;

    console.log(string);
    const mathQueue = new Queue(string);

    mathMacros.forEach(command => {
        const fullPattern = createPattern(command.pattern, command.customArgument, flags);
        // mathQueue.match(fullPattern[0]).forEach(match => {
        //     command.run(flags,...match.filter(el => el));
        // });
        string = string.replaceAll(fullPattern[0], (...args) => {
            return command.run(flags, ...args.filter(el => el));
        })
    });
    return `<mrow>${string}</mrow>`;
}

export default mathParser;