const basicRegexes = {
    comment: {
        pattern: /(<!--).+(-->)/g,
        sliceLength: 0,
        start: "",
        end: "",
        preventRecursive: true,
    },
    inlineMath: {
        pattern: /\$.*?\$/gm,
        sliceLength: 1,
        start: "",
        end: "",
        fullReplace: true,
        preventRecursive: true,
        enterMathMode: true,
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
            pattern: /^#\s/g,
            start: "<h1>",
            end: "</h1><hr>",
            sliceLength: 1,
        },
        h2: {
            pattern: /^##\s/g,
            start: "<h2>",
            end: "</h2>",
            sliceLength: 2,
        },
        h3: {
            pattern: /^###\s/g,
            start: "<h3>",
            end: "</h3>",
            sliceLength: 3,
        },
        h4: {
            pattern: /^####\s/g,
            start: "<h4>",
            end: "</h4>",
            sliceLength: 4,
        },
        h5: {
            pattern: /^#####\s/g,
            start: "<h5>",
            end: "</h5>",
            sliceLength: 5,
        },
        h6: {
            pattern: /^######\s/g,
            start: "<h6>",
            end: "</h6>",
            sliceLength: 6,
        },
        h7: {
            pattern: /^#######\s/g,
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
    },
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
        type: 'ul',
    },
    ulc: {
        pattern: /^(\s)*(\*\[.+\])(\s+).+/g,
        sliceLength: 1,
        start: "<ul>",
        end: "</ul>",
        type: 'ul',
        getInput: true,
    },
    ol: {
        pattern: /^(\s)*&(\s+).+/g,
        sliceLength: 2,
        start: "<ol>",
        end: "</ol>",
        type: 'ol',
    },
    olc: {
        pattern: /^(\s)*(&\[.+\])(\s+).+/g,
        sliceLength: 1,
        start: "<ol>",
        end: "</ol>",
        getInput: true,
        type: "ol",
    },
};

/**
 * Contains inline math options as well as custom commands
 */
const mathRegexes = {
    supBoth: {
        pattern: /\{.+\}\^\{.+\}/g,
        operator: "^",
        start: "<msup>",
        end: "</msup>",
    },
    supTop: {
        pattern: /[^\s]+\^\{.+\}/g,
        operator: "^",
        start: "<msup>",
        end: "</msup>",
    },
    supBottom: {
        pattern: /\{.+\}\^([^\{]+?)/g,
        operator: "^",
        start: "<msup>",
        end: "</msup>",
    },
    supNeither: {
        pattern: /[^\s]+\^([^\{]+?)/g,
        operator: "^",
        start: "<msup>",
        end: "</msup>",
    },
};


export{
    basicRegexes,
    listRegexes
}