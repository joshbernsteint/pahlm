const commands = require('./general/commands.js');
const defaultCommands = require('./general/commands.js');
const {mathParser} = require('./math/mathParser.js');

const preventMatchingRegexes = [
    // blockcode
    {
        pattern: /```(\{.+?\}|)([^]*?)```/gm,
        run: (s, g1, g2) => `<pre><code>${g2}</code></pre>`,
    },
    // code
    {
        pattern: /\`([^`]+?)\`/gm,
        run: (s, g1) => `<code>${g1}</code>`,
    },
    // math
    {
        pattern: /\$(.*?)\$/gm,
        run: (flags,s,g1) => `<math>${mathParser(g1, flags)}</math>`,
    },
    // block math
    {
        pattern: /\/\[([^]*?)\]\//gm,
        run: (flags, s, g1) => `<br><math display="block">${mathParser(g1, flags)}</math><br>`,
    },
]


const basicRegexes = [
    //Custom command
    {
        pattern: [/\\newcommand/gm, ["{","}"], ["[","]"], ["{","}"]],
        run: (flags, s, g1, g2, g3) => defaultCommands.newCommand(flags, g1, g2, g3),
    },
    //Table
    {
        pattern: [/\\table/gm, ["{","}"],  ["{","}"]],
        run: (flags, s, g1, g2, ...args) => {
            return defaultCommands.makeTable(flags, g1, g2);
        },
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
    { pattern: /(\\s\\s\\s+)$|\\\\|^$/gm, run: () => "<br>",},
    // Dash
    { pattern: /---/gm, run: () => "&#8212;",},
    {
        pattern: /(#{1,7})\s(.*)/gm,
        run: (_, s, depth, title) => {
            const length = depth.length;
            const ret = `<h${length}>${title}</h${length}>`
            return (length < 3) ? ret + "<hr>" : ret;
        }
    }
];





module.exports = {
    basicRegexes: basicRegexes,
    preventMatchingRegexes: preventMatchingRegexes
}