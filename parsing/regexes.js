import commands from "./general/commands.js";
import mathParser from "./math/math.js";

const basicRegexes = [
    {pattern: '\\\\setBracketDepth#!', run: commands.setBracketDepth},
    //comment 
    {
        pattern: /<!--[^]+-->/gm,
        preventRecursive: true,
        run: (s) => s,
    },
    // math
    {
        pattern: '\\$#!\\$',
        customArgument: /(.*?)/,
        preventRecursive: true,
        giveFlags: true,
        run: (flags,s,g1) => `<math>${mathParser(g1, flags)}<math>`
    },
    // block math
    {
        pattern: "\/\\[#!\]\\/",
        customArgument: /(.*?)/,
        preventRecursive: true,
        giveFlags: true,
        run: (flags, s, g1) => `<br><math display="block">${mathParser(g1, flags)}</math><br>`,
    },
    // blockcode
    {
        pattern: "```#!#!```",
        customArgument: [/(\{.+?\}|)/,/([^]*?)/],
        preventRecursive: true,
        run: (s,g1, g2) => `<pre><code>${g2}</code></pre>`,
    },
    // code
    {
        pattern: "\\`#!\\`",
        customArgument: /([^`]+?)/,
        preventRecursive: true,
        run: (s, g1) => `<code>${g1}</code>`,
    },
    // bold
    {
        pattern: "\\*\\*#!\\*\\*" ,
        customArgument: /([^(\\*)]*)/,
        run: (s,g1) => `<b>${g1}</b>`,
    },
    // italic
    {
        pattern: "\\*#!\\*",
        customArgument: /([^(\*)]*)/,
        run: (s,g1) => `<i>${g1}</i>`,
    },
    // br
    {
        pattern: "(\\s\\s\\s+)#!|^$",
        customArgument: /$/,
        run: () => "<br>",
    },
    // Dash
    {
        pattern: /---/gm,
        run: () => "&#8212;",
    },
    { pattern: '#######\\s#!', customArgument: /(.*)/, run: (s,g1) => `<h7>${g1}</h7>`, name: /#######\s/g},
    { pattern: '######\\s#!', customArgument: /(.*)/, run: (s,g1) => `<h6>${g1}</h6>`, name: /######\s/g },
    { pattern: '#####\\s#!', customArgument: /(.*)/, run: (s,g1) => `<h5>${g1}</h5>`, name: /#####\s/g },
    { pattern: '####\\s#!', customArgument: /(.*)/, run: (s,g1) => `<h4>${g1}</h4>`, name: /####\s/g },
    { pattern: '###\\s#!', customArgument: /(.*)/, run: (s,g1) => `<h3>${g1}</h3>`, name: /###\s/g },
    { pattern: '##\\s#!', customArgument: /(.*)/, run: (s,g1) => `<h2>${g1}</h2><hr>`, name: /##\s/g},
    { pattern: '#\\s#!', customArgument: /(.*)/, run: (s,g1) => `<h1>${g1}</h1><hr>`, name: /#\s/g},
];

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
    commandRegexes,
}