const XRegExp = require('xregexp');

function matchRecursive(str, leftPattern, rightPattern, flags, startIndex=0){
    const left = new RegExp(leftPattern, flags);
    const right = new RegExp(rightPattern, flags);
    const result = {
        start: -1,
        end: -1,
        match: ""
    };
    let currentDepth = 0;
    let leftSideIndex = str.substring(startIndex).search(left);
    let jumpAmount = startIndex + leftSideIndex;
    let stringLeft = str.substring(jumpAmount + 1);
    let rightSideIndex = -1;
    result.start = jumpAmount + 1;

    if(leftSideIndex === -1)
        return null;

    currentDepth++;
    do {
        rightSideIndex = stringLeft.search(right);
        leftSideIndex = stringLeft.search(left);
        if(rightSideIndex < leftSideIndex || leftSideIndex === -1){
            currentDepth--;
            jumpAmount += rightSideIndex + 1;
            stringLeft = stringLeft.substring(rightSideIndex+1);
        }
        else{
            currentDepth++;
            jumpAmount += leftSideIndex + 1;
            stringLeft = stringLeft.substring(leftSideIndex+1);
        }
    } while (currentDepth > 0 && rightSideIndex !== -1);
    result.end = jumpAmount;
    result.match = str.substring(result.start, result.end);

    return result;
}

function replaceAllR(str, pattern, replaceWith){
    const numArgs = pattern.length;
    const matches = [];
    let curIndex = 0;
    let regexString = "";
    let stringLeft = str;

    for (let i = 0; i < numArgs; i++) {
        let newMatch = undefined;
        const curPattern = pattern[i];
        if(Array.isArray(curPattern)){
            //If it's a recursive pattern
            const recursiveMatch = matchRecursive(str, curPattern[0], curPattern[1], 'gm', curIndex);
            if(recursiveMatch){
                newMatch = {...recursiveMatch};
                curIndex = newMatch.end;
                stringLeft = str.substring(curIndex);
            }
        }
        else{
            const firstMatch = Array.from(stringLeft.matchAll(curPattern))[0];
            newMatch = {
                start: firstMatch.index + curIndex,
                end: firstMatch.index + firstMatch[0].length + curIndex,
                match: curPattern,
                isPattern: true
            };
            curIndex = newMatch.end;
            stringLeft = str.substring(curIndex);
        }
        if(!newMatch)
            return str;
        if(i > 0){
            const last = matches[i-1];
            if(last.isPattern && (last.end + 1 !== newMatch.start))
                return str;
            else if(!last.isPattern && (last.end + 2 !== newMatch.start))
                return str;
        }    

        if(newMatch.isPattern){
            regexString += newMatch.match.source;
        }
        else{
            regexString += "{(" + newMatch.match.replaceAll(/(\+|-|\*|\/|=|>|<|>=|<=|&|\||%|!|\^|\(|\)|\]|\[)/gm, (s) => "\\" + s) + ")}";
        }
        matches.push(newMatch);
    }
    return str.replaceAll(new RegExp(regexString, 'gm'), replaceWith);
    //Convert to regex and replace
}

function replaceAllRecursive(str, pattern, replaceWith){
    // console.log(pattern);
    const numArgs = pattern.length;
    const matches = [];
    for (let i = 0; i < numArgs; i++) {
        if(Array.isArray(pattern[i])){
            //If it's a recursive pattern
            // matches.push(XRegExp.matchRecursive(str, pattern[i][0], pattern[i][1],'g', {valueNames: [null,null,"match",null], unbalanced: "skip"}).map(el => {
            //     return {...el, value: el.value, end: el.end+1, left: pattern[i][0], right: pattern[i][1]};
            // }));
            
           
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
                // console.log(str, prevMatch, matchGroup);
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
                        const switched = v.val.replaceAll(/(\+|-|\*|\/|=|>|<|>=|<=|&|\||%|!|\^|\(|\)|\]|\[)/gm, (s) => "\\" + s);
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
    return str;
}

// console.log(matchRecursive("[cc{ghg}|c]}{Hello {}{{}}there}", "{", "}", 'g', 0));
console.log(replaceAllR("\\table{Hello there}{Why not}",[/\\table/gm, ["{","}"],  ["{","}"]],"test"));

module.exports = {
    replaceAllRecursive: replaceAllRecursive,
}