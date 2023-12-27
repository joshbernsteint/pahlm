import { basicRegexes, listRegexes } from "./regexes.js";
import ChangeQueue from "./ChangeQueue.js";
import Stack from "../utils/Stack.js";

const basicKeys = Object.keys(basicRegexes);
const listKeys = Object.keys(listRegexes);



function parseFile(fileData){

    const listDepth = new Stack();
    const resultList = [];
    const flags = {
        
    };

    function parseString(str){
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
        // const text = res[0].substring(res[2].length+1);
        // const newLi = res[2].substring(2,res[2].length-1);
    
        const blankDepth = str.search(/\S|$/);
        const queue = new ChangeQueue(str.trim());
        //Check for lists, max one per line, just a straight replace. No queue yet.
        for (let i = 0; i < listKeys.length; i++) {
            const body = listRegexes[listKeys[i]];
            const regex = new RegExp(body.pattern);
            const res = regex.exec(queue.string);
            if(!res) continue;

            const peeked = listDepth.peek();
            if(body.getInput){
                const text = res[0].substring(res[2].length+1);
                if(peeked){

                }
                else{
                    if(body.getInput){
                        const newLi = res[2].substring(2,res[2].length-1);
                        queue.setString(body.start+`<li  style="padding-left: ${2.5*(blankDepth+1)}em;list-style-type: '${newLi}';">${text}</li>`);
                    }
                    else{
                        queue.setString(body.start+`<li  style="padding-left: ${2.5*(blankDepth+1)}em;">${text}</li>`);
                    }
                    listDepth.push({
                        depth: blankDepth,
                        currentCount: 1,
                        ...body,
                    });
                }
            }
        };


        for (let i = 0; i < basicKeys.length; i++) {
            const body = basicRegexes[basicKeys[i]];
            if(!body.isGroup){
                const regex = new RegExp(body.pattern);
                let match;
                while ((match = regex.exec(queue.string)) !== null) {
                    const lower = match.index;
                    const upper = (match[0].length - 1) + match.index;
                    queue.addToQueue({
                        ...body,
                        substring: match[0],
                    },lower,upper,basicKeys[i]);
                    console.log('queued', lower, upper);
                }
            }
            else{

            }
            
            
        }
        console.log(queue.currentQueue);
    };


    for (let i = 0; i < fileData.length; i++) {
        const line = fileData[i].replaceAll("\r", "");
        resultList.push(parseString(line));
    }

    return resultList;
}

export default parseFile;