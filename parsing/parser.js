import { basicRegexes, listRegexes } from "./regexes.js";

const basicKeys = Object.keys(basicRegexes);
const listKeys = Object.keys(listRegexes);

function findDepth(str){
    const depth = str.search(/\S/);
    return (depth === -1) ? 0 : depth; 
}

function parseString(str){
    // str = str.replaceAll("\r","").trimStart();

    // if(obj.isGroup){
    //     for (let i = 0; i < obj.keys.length; i++) {
    //         const key = obj.keys[i];
    //         if(obj[key].pattern.test(str))
    //             return obj[key].start + str.slice(obj[key].sliceLength) + obj[key].end;
    //     }
    //     return str;
    // }
    // else{
    //     return str.replaceAll(obj.pattern,(s) => {
    //         return obj.start + s.slice(0,s.length-obj.sliceLength).slice(obj.sliceLength) + obj.end;
    //     });
    // }

    str = str.replaceAll('\r', "");

    const blankDepth = findDepth(str);

    //Check for lists
    for (let i = 0; i < listKeys.length; i++) {
        const listType = listKeys[i];
        const regex = new RegExp(listRegexes[listType].pattern);
        const t = regex.exec(str);
        if(t) console.log(t);

    }


}

export default parseString;