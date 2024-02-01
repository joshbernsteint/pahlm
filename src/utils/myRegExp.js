const XRegExp = require('xregexp');

function replaceAllRecursive(str, pattern, replaceWith){
    // console.log(pattern);
    const numArgs = pattern.length;
    const matches = [];
    for (let i = 0; i < numArgs; i++) {
        if(Array.isArray(pattern[i])){
            //If it's a recursive pattern
            matches.push(XRegExp.matchRecursive(str, pattern[i][0], pattern[i][1],'g', {valueNames: [null,null,"match",null], unbalanced: "skip"}).map(el => {
                return {...el, value: el.value, end: el.end, left: pattern[i][0], right: pattern[i][1]};
            }));
           
        }
        else{
            //If it's a standard pattern
            matches.push(Array.from(str.matchAll(pattern[i])).map(el => 
                {
                    return {value: pattern[i], start: el.index, end: el[0].length + el.index, isPattern: true};
                }
            ));
        }
       
    }

    // console.log(matches);

    if(matches.length > 0){
        for (let i = 0; i < matches[0].length; i++) {
            // let prevMatch = {start: matches[0][i].start, value: [{val: matches[0][i].value, left: matches[0][i].left, right: matches[0][i].right}], end: matches[0][i].end};
            let prevMatch = {
                start: matches[0][i].start,
                value: [
                    matches[0][i].isPattern ? 
                    {isPattern: true, val: matches[0][i].value} 
                    : {val: matches[0][i].value, left: matches[0][i].left, right: matches[0][i].right}
                ], 
                end: matches[0][i].end
            };
            let valid = false;
            for (let j = 1; j < matches.length; j++) {
                const matchGroup = matches[j].filter(el => el.start >= prevMatch.end);
                console.log(str, prevMatch, matchGroup);
                // console.log(matchGroup);
                // console.log(prevMatch);
                valid = false;
                for (let k = 0; k < matchGroup.length && !valid; k++) {
                    const element = matchGroup[k];
                    if(prevMatch.end === element.start - 1){
                        prevMatch = {
                            ...prevMatch, 
                            value: prevMatch.value.concat(
                                element.isPattern ? 
                                {isPattern: true, val: element.value} 
                                : {val: element.value, left: element.left, right: element.right}), 
                                end: element.end
                        };
                        valid = true;
                    }
                }
                if(!valid){
                    break;
                }
            }
            if(valid){
                let regexString = "";
                prevMatch.value.forEach(v => {
                    // console.log(v);
                    if(v.isPattern){
                        regexString += v.val.source;
                    }
                    else{
                        const switched = v.val.replaceAll(/(\+|-|\*|\/|=|>|<|>=|<=|&|\||%|!|\^|\(|\))/gm, (s) => "\\" + s);
                        if(v.left){
                            regexString += v.left + "(" + switched + ")" + v.right;
                        }
                        else
                            regexString += switched;
                    }
                });
                const toRegex = new RegExp(regexString, 'gm')
                // console.log(toRegex);
                str = str.replaceAll(toRegex, replaceWith);
            }
        }
    }
    console.log("\n");
    return str;
}

module.exports = {
    replaceAllRecursive: replaceAllRecursive,
}