import fs from 'fs';

const regexes = {
    bold: {
        isGroup: false,
        pattern: /\*\*([^(\*)]*)\*\*/g,
        start: "<b>",
        end: "</b>",
        sliceLength: 2,
    },
    italic:{
        isGroup: false,
        pattern: /\*([^(\*)]*)\*/g,
        sliceLength: 1,
        start: "<i>",
        end: "</i>",
    },
    headings: {
        isGroup: true,
        keys: ["h7", "h6", "h5", "h4", "h3", "h2", "h1"],
        h1: {
            pattern: /#/g,
            start: "<h1>",
            end: "</h1><hr>",
            sliceLength: 1,
        },
        h2: {
            pattern: /##/g,
            start: "<h2>",
            end: "</h2>",
            sliceLength: 2,
        },
        h3: {
            pattern: /###/g,
            start: "<h3>",
            end: "</h3>",
            sliceLength: 3,
        },
        h4: {
            pattern: /####/g,
            start: "<h4>",
            end: "</h4>",
            sliceLength: 4,
        },
        h5: {
            pattern: /#####/g,
            start: "<h5>",
            end: "</h5>",
            sliceLength: 5,
        },
        h6: {
            pattern: /######/g,
            start: "<h6>",
            end: "</h6>",
            sliceLength: 6,
        },
        h7: {
            pattern: /#######/g,
            start: "<h7>",
            end: "</h7>",
            sliceLength: 7,
        },
    },
    // ol: {
    //     isGroup: true,
    //     keys: ['1','2','3'],
    //     pattern: /[]/g,
    // }
}


function parseString(str, obj){
    str = str.replaceAll("\r","").trimStart();

    if(obj.isGroup){
        for (let i = 0; i < obj.keys.length; i++) {
            const key = obj.keys[i];
            if(obj[key].pattern.test(str))
                return obj[key].start + str.slice(obj[key].sliceLength) + obj[key].end;
            
        }
        return str;
    }
    else{
        return str.replaceAll(obj.pattern,(s) => {
            return obj.start + s.slice(0,s.length-obj.sliceLength).slice(obj.sliceLength) + obj.end;
        });
    }
}

const fileData = fs.readFileSync('input.jd').toString().split("\n");

const regexKeys = Object.keys(regexes);
const start = Date.now();
const resLines = [];
const statusCodes = {
    inOrderedList: false,
    inUnorderedList: false,
    inCodeBlock: false,
};


fileData.forEach(line => {
    for (let i = 0; i < regexKeys.length; i++) {
        line = parseString(line, regexes[regexKeys[i]]);
    }
    resLines.push(line);
});
const end = Date.now();

fs.writeFileSync("out.html",resLines.join('\n'));

console.log("Time taken: ", (end-start));

