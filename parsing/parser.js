import { basicRegexes, listRegexes } from "./regexes.js";
import ChangeQueue from "./ChangeQueue.js";

const basicKeys = Object.keys(basicRegexes);
const listKeys = Object.keys(listRegexes);



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

    const blankDepth = str.search(/\S|$/);
    const queue = new ChangeQueue(str.trim());
    


    //Check for lists, max one per line, just a straight replace. No queue yet.
    let newStr = "";
    for (let i = 0; i < listKeys.length; i++) {
        const body = listRegexes[listKeys[i]];
        const regex = new RegExp(body.pattern);
        const res = regex.exec(queue.string);
        if(!res) continue;

        if(body.getInput){
            const text = res[0].substring(res[2].length+1);
            const newLi = res[2].substring(2,res[2].length-1);
            queue.setString(body.start.repeat(blankDepth+1) + `<li style="list-style-type: '${newLi} ';">${text}</li>` + body.end.repeat(blankDepth+1));
        }
        else{
            const text = res[0].substring(body.sliceLength);
            queue.setString(body.start.repeat(blankDepth+1) + `<li>${text}</li>` + body.end.repeat(blankDepth+1));
        }
        break;
    }
    console.log(queue.string);


}

export default parseString;