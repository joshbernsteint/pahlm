import { matchCurlyBraces } from "../../utils/counting.js";
function setBracketDepth(flags, full, val){
    const toNum = Number(val);
    if(isNaN(toNum)) return "";
    flags.maxBracesDepth = {
        amount: toNum,
        pattern: matchCurlyBraces(toNum),
    }
    return "";
}

export default {
    setBracketDepth: setBracketDepth
}