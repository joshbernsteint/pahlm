import parseFile from "../parser.js"
/**
 * Treats whatever is inputted as basic text
 * @param {string} input 
 */
function text(flags, args){
    return getBracketArgs((g1) => `<span>${parseFile(g1, false, flags)}</span>`, args);
}


function getBracketArgs(fun, args){
    args.splice(-2);
    const res = [];
    // console.log(args);
    let last = undefined;
    for (let i = args.length-1; i >= 0; i--) {
        const cur = args[i];
        if(!last){
            last = cur;
        }
        else if(cur.indexOf("{"+last+"}") === -1){
            res.unshift(last);
        }
        last = cur;
    }
    res.unshift(last);
    const t = fun(...res);
    return t;
    
}

export default {
    text: text,
    getBracketArgs: getBracketArgs,
}