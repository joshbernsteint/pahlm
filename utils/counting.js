function toRomanNumeral(num){
    //Taken from StackOverflow: https://stackoverflow.com/a/41358305
    const roman = {
        m: 1000,
        cm: 900,
        d: 500,
        cd: 400,
        c: 100,
        xc: 90,
        l: 50,
        xl: 40,
        x: 10,
        ix: 9,
        v: 5,
        iv: 4,
        i: 1
      };
      let str = '';
    
      for (const i of Object.keys(roman)) {
        const q = Math.floor(num / roman[i]);
        num -= q * roman[i];
        str += i.repeat(q);
      }
    
      return str;
}

function toLetters(num){
    const iter = (num === 0) ? (1) : Math.ceil(num/26)
    return String.fromCharCode(97 + (num % 26)).repeat(iter);
}

//Taken from StackOverflow and modified
function matchCurlyBraces(depth=3){
  const basePatterns = ['\{([^}{]*(?:','[^}{]*)*)\}'];
  return new RegExp(basePatterns[0].repeat(depth) + '\{[^}{]*\}' + basePatterns[1].repeat(depth));
}

export{
    toRomanNumeral,
    toLetters,
    matchCurlyBraces,
}