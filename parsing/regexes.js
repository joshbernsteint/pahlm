import commands from "./general/commands.js";

const headingsRegexes = {
    keys: ['h7','h6','h5','h4','h3','h2','h1'],
    h1: { pattern: /#\s(.*)/gm, start: '<h1>', end: '</h1><hr>' },
    h2: { pattern: /##\s(.*)/gm, start: '<h2>', end: '</h2><hr>' },
    h3: { pattern: /###\s(.*)/gm, start: '<h3>', end: '</h3>' },
    h4: { pattern: /####\s(.*)/gm, start: '<h4>', end: '</h4>' },
    h5: { pattern: /#####\s(.*)/gm, start: '<h5>', end: '</h5>' },
    h6: { pattern: /######\s(.*)/gm, start: '<h6>', end: '</h6>' },
    h7: { pattern: /#######\s(.*)/gm, start: '<h7>', end: '</h7>' }
};

const basicRegexes = {
    comment: {
        pattern: /(<!--).+(-->)/gm,
        sliceLength: 0,
        start: "",
        end: "",
        preventRecursive: true,
    },
    inlineMath: {
        pattern: /\$(.*?)\$/gm,
        sliceLength: 1,
        start: "<math>",
        end: "</math>",
        fullReplace: true,
        preventRecursive: true,
        enterMathMode: true,
    },
    blockLineMath: {
        pattern: /\/\[(.*)\]\//gm,
        sliceLength: 2,
        start: "<br><math>",
        end: "</math><br>",
        fullReplace: true,
        preventRecursive: true,
        enterMathMode: true,
    },
    blockCode: {
        pattern: /```(\{.+?\}|)([^]*?)```/gm,
        sliceLength: 3,
        start: "<pre><code>",
        end: "</code></pre>",
        preventRecursive: true,
        groups: 2,
    },
    code: {
        pattern: /\`([^`]+?)\`/gm,
        sliceLength: 1,
        start: "<code>",
        end: "</code>",
        preventRecursive: true,
    },
    bold: {
        pattern: /\*\*([^(\*)]*)\*\*/gm,
        start: "<b>",
        end: "</b>",
        sliceLength: 2,
    },
    italic:{
        pattern: /\*([^(\*)]*)\*/gm,
        sliceLength: 1,
        start: "<i>",
        end: "</i>",
    },
    br: {
        pattern: /(\s\s\s+)$|^$/gm,
        sliceLength: 0,
        start: "<br>",
        end: "",
        fullReplace: true,
    },
    dash: {
        pattern: /---/gm,
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


const commandRegexes = [
    {pattern: '\\\\setBracketDepth', arguments: 1, offsetIndex: 2, run: commands.setBracketDepth}
];



const escapeRegexes = {
    '$': { pattern: /(\\\$)/g, replace: '&dollar;' },
    '&': { pattern: /(\\\&)/g, replace: '&amp;' },
    '^': { pattern: /(\\\^)/g, replace: '&Hat;' },
    '_': { pattern: /(\\\_)/g, replace: '&lowbar;' },
    '{': { pattern: /(\\\{)/g, replace: '&lcub;' },
    '}': { pattern: /(\\\})/g, replace: '&rcub;' },
    '*': { pattern: /(\\\*)/g, replace: '&midast;' },
    '%': { pattern: /(\\\%)/g, replace: '&percnt;' },
    '\\': { pattern: /(\\\\)/g, replace: '&bsol;' },
    '[': { pattern: /(\\\[)/g, replace: '&lsqb;' },
    ']': { pattern: /(\\\])/g, replace: '&rsqb;' }
  };



export{
    basicRegexes,
    listRegexes,
    escapeRegexes,
    headingsRegexes,
    commandRegexes
}