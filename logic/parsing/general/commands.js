import { matchCurlyBraces } from "../../utils/counting.js";
function setBracketDepth(flags, full, val){
    const toNum = Number(val);
    if(isNaN(toNum)) return "";
    flags.maxBracesDepth =  matchCurlyBraces(toNum);
    return "";
}





export default {
    setBracketDepth: setBracketDepth,
}