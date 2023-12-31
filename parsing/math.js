import { mathRegexes, mathOperators } from "./regexes.js";

const mathKeys = Object.keys(mathRegexes);

function mathParser(str){

    if(!isNaN(Number(str))){
        return `<mn>${str}</mn>`;
    }
    
    for (let i = 0; i < mathKeys.length; i++) {
        const body = mathRegexes[mathKeys[i]];
        str = str.replaceAll(body.pattern, (s,g1,g2,g3) => {
            let [left,right] = s.split(body.operator);
            if(left[0] === "{" && left[left.length-1] === "}")
                left = mathParser(left.substring(1,left.length - 1));
            else
                left = mathParser(left);

            if(right[0] === "{" && right[right.length-1] === "}")
                right = mathParser(right.substring(1,right.length - 1));
            else
                right = mathParser(right);

            return body.start + left + right + body.end;
            
        })
        
    }

    return str;
}

export default mathParser;