const {basicRegexes, escapeRegexes, listRegexes} = require("./regexes.js");
const {Stack, Queue, createPattern, findOffset} = require("../utils/index.js");


function parseFile(str, trimInput=true, flags={
    maxBracesDepth: /{([^}{]*(?:{([^}{]*(?:{([^}{]*(?:{[^}{]*}[^}{]*)*)}[^}{]*)*)}[^}{]*)*)}/,
    maxBracesSize: 3,
}){




    const listDepth = new Stack();
    // console.log(str);

    const listKeys = Object.keys(listRegexes);
    const customKeys = Object.keys(escapeRegexes);

    // console.log(headingsRegexes);


    //Replace all escape characters
    for (let i = 0; i < customKeys.length; i++) {
        const body = escapeRegexes[customKeys[i]];
        str = str.replaceAll(body.pattern, body.replace);
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
    basicRegexes.forEach(element => {
        const fullPattern = createPattern(element.pattern, element.customArgument, flags, (element.variableOffset) ? true : false);
        const matches = queue.match(fullPattern[0]);
        matches.forEach(m => {
            const offset = m.index;
            queue.addToQueue({
                run: element.run,
                giveFlags: (element.giveFlags) ? true : false,
                pattern: fullPattern[0],
                preventRecursive: element.preventRecursive ? true : false,
                offsetIndex: fullPattern[1]
            }, [offset, (m[0].length === 0) ? offset :  m[0].length + offset - 1]);
        })

    });



    queue.applyQueue((str, q) => {
        q.forEach(el => {
            str = str.replace(el.pattern, (...args) => {
                const offset = (el.offsetIndex) ? args[el.offsetIndex] : findOffset(...args);
                if(offset >= el.range[0])
                    return ( el.giveFlags ? el.run(flags,...args) : el.run(...args));
                else {
                    return args[0];
                }
            });
        });
        return str;
    });


    return queue.string;
}

module.exports = {parseFile: parseFile};