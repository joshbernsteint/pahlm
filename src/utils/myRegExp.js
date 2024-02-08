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

function replaceAllRecursive(str, pattern, replaceWith){
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
            if(firstMatch){
                newMatch = {
                    start: firstMatch.index + curIndex,
                    end: firstMatch.index + firstMatch[0].length + curIndex,
                    match: curPattern,
                    isPattern: true
                };
                curIndex = newMatch.end;
                stringLeft = str.substring(curIndex);
            }
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
    //Convert to regex and replace
    return str.replaceAll(new RegExp(regexString, 'gm'), replaceWith);
}


module.exports = {
    replaceAllRecursive,
}