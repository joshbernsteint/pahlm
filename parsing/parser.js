import { basicRegexes, customCharactersAndMacrosRegexes, headingsRegexes, listRegexes } from "./regexes.js";
import {Stack, Queue} from "../utils/index.js";
import mathParser from "./math/math.js";





function parseFile(str, trimInput=true){

    const listDepth = new Stack();
    const flags = {
        
    };
    const basicKeys = Object.keys(basicRegexes);
    const listKeys = Object.keys(listRegexes);
    const customKeys = Object.keys(customCharactersAndMacrosRegexes);


    //Replace all escape characters
    for (let i = 0; i < customKeys.length; i++) {
        const body = customCharactersAndMacrosRegexes[customKeys[i]];
        str = str.replaceAll(body.pattern, body.replace + " ");
    }

    //Headings
    for (let i = 0; i < headingsRegexes.keys.length; i++) {
        const body = headingsRegexes[headingsRegexes.keys[i]];
        str = str.replaceAll(body.pattern,(s,g1) => {
            return body.start + g1 + body.end;
        });
    }


    const blankDepth = str.search(/\S|$/);
    const queue = new Queue(trimInput ? str.trim() : str);

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


    //Basic changes
    for (let i = 0; i < basicKeys.length; i++) {
        const body = basicRegexes[basicKeys[i]];
        const regex = new RegExp(body.pattern);
        let match;
        while ((match = regex.exec(queue.string)) !== null) {
            if(match[0].length === 0){
                queue.addToQueue({
                    ...body,
                    substring: match[0]
                },match.index, match.index, basicKeys[i]);
                regex.lastIndex++;
            }
            else{
                const lower = match.index;
                const upper = (match[0].length - 1) + match.index;
                queue.addToQueue({
                    ...body,
                    substring: match[0],
                },lower,upper,basicKeys[i]);
            }
        }
    }

    //Apply the queue and return
    return queue.applyQueue((x, list) => {
        for (let i = 0; i < list.length; i++) {
            const el = list[i];
            x = x.replace(el.pattern,(s,m1, offset) => {
                if(offset >= el.range[0]){
                    if(el.type === "inlineMath" || el.type === "blockLineMath")
                        return el.start + mathParser(m1) + el.end;
                    else
                        return el.start + (m1 ? m1 : "") + el.end;
                }
                else{
                    return s;
                }
            });
        }
        return x;
    });
}

export default parseFile;