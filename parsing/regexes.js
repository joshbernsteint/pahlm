const basicRegexes = {
    comment: {
        pattern: /(<!--).+(-->)/g,
        sliceLength: 0,
        start: "",
        end: "",
        preventRecursive: true,
    },
    bold: {
        pattern: /\*\*([^(\*)]*)\*\*/g,
        start: "<b>",
        end: "</b>",
        sliceLength: 2,
    },
    italic:{
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
    br: {
        pattern: /(\s\s\s+)$/g,
        sliceLength: 0,
        start: "<br>",
        end: "",
        fullReplace: true,
    },
    dash: {
        pattern: /---/g,
        sliceLength: 0,
        start: "&#8212;",
        end: "",
        fullReplace: true,
    }
};

/**
 * Lists use the depth variable unless specified. 
 * Also sliceLength is actually the depth + sliceLength. Unless in the case of getInput = true, then the sliceLength depends on the input length.
 */
const listRegexes = {
    ul: {
        pattern: /^(\s)*\*(\s+).+/g,
        sliceLength: 2,
        start: "<ul>",
        end: "</ul>",
    },
    ulc: {
        pattern: /^(\s)*(\*\[.+\])(\s+).+/g,
        sliceLength: 1,
        start: "<ul>",
        end: "</ul>",
        getInput: true,
    },
    ol: {
        pattern: /^(\s)*&(\s+).+/g,
        sliceLength: 2,
        start: "<ol>",
        end: "</ol>",
    },
    olc: {
        pattern: /^(\s)*(&\[.+\])(\s+).+/g,
        sliceLength: 1,
        start: "<ol>",
        end: "</ol>",
        getInput: true,
    },
};


export{
    basicRegexes,
    listRegexes
}