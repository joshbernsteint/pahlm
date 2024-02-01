const commands = require('./general/commands.js');
const { makeTable } = require('./math/commands.js');
const {mathParser} = require('./math/mathParser.js');

const basicRegexes = [
    // math
    {
        pattern: /\$(.*?)\$/gm,
        giveFlags: true,
        run: (flags,s,g1) => `<math>${mathParser(g1, flags)}</math>`
    },
    // block math
    {
        pattern: /\/\[(.*?)\]\//gm,
        run: (flags, s, g1) => `<br><math display="block">${mathParser(g1, flags)}</math><br>`,
    },
    // blockcode
    {
        pattern: /```(\{.+?\}|)([^]*?)```/gm,
        run: (s, g1, g2) => `<pre><code>${g2}</code></pre>`,
    },
    //Table
    {
        balanced: true,
        pattern: [/\\table/gm, {left: "{", right: "}"}, {left: "{", right: "}"}],
        run: (flags, s, g1, g2, ...args) => {
            return makeTable(flags, g1, g2);
        },
    },
    // code
    {
        pattern: /\`([^`]+?)\`/gm,
        run: (s, g1) => `<code>${g1}</code>`,
    },
    // bold
    {
        pattern: /\*\*([^(\*)]*)\*\*/gm ,
        run: (s,g1) => `<b>${g1}</b>`,
    },
    // italic
    {
        pattern: /\*([^(\*)]*)\*/gm,
        run: (s,g1) => `<i>${g1}</i>`,
    },
    // br
    { pattern: /(\\s\\s\\s+)$|^$/gm, run: () => "<br>",},
    // Dash
    { pattern: /---/gm, run: () => "&#8212;",},
    { pattern: /#######\\s(.*)/gm, run: (s,g1) => `<h7>${g1}</h7>`},
    { pattern: /######\\s(.*)/gm, run: (s,g1) => `<h6>${g1}</h6>`},
    { pattern: /#####\\s(.*)/gm, run: (s,g1) => `<h5>${g1}</h5>`},
    { pattern: /####\\s(.*)/gm, run: (s,g1) => `<h4>${g1}</h4>`},
    { pattern: /###\\s(.*)/gm, run: (s,g1) => `<h3>${g1}</h3>`},
    { pattern: /##\\s(.*)/gm, run: (s,g1) => `<h2>${g1}</h2>`},
    { pattern: /#\\s(.*)/gm, run: (s,g1) => `<h1>${g1}</h1>`},
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
    
];



module.exports = {
    basicRegexes: basicRegexes,
    listRegexes: listRegexes,
    commandRegexes: commandRegexes,
}