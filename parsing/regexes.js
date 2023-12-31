

const basicRegexes = {
    comment: {
        pattern: /(<!--).+(-->)/g,
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
    sup: {
        pattern: /([^\s]+|(\{.+\}))\^((\{.+\})|.+?)/g,
        operator: "^",
        start: "<msup>",
        end: "</msup>",
    },
    sub: {
        pattern: /([^\s]+|(\{.+\}))\_((\{.+\})|.+?)/g,
        operator: "_",
        start: "<msub>",
        end: "</msub>",
    }
};

const mathOperators = [
    { pattern: /\\le/g, replace: "&le;" },
    { pattern: /\\ge/g, replace: "&ge;" },
    { pattern: /\+/g, replace: "&plus" },
    { pattern: /-/g, replace: "&minus" },
    { pattern: /\\times/g, replace: "&times"},
    { pattern: /\\div/g, replace: "&divide;"},
    { pattern: /\\ne/g, replace: "&ne;" },
    { pattern: /\\pm/g, replace: "&plusmn;"},
    { pattern: /\\not/g, replace: "&not;" },
    { pattern: /\\cup/g, replace: "&cup;" },
    { pattern: /\\cap/g, replace: "&cap;" },
    { pattern: /\\Alpha/g, replace: '&Alpha;' },
    { pattern: /\\alpha/g, replace: '&alpha;' },
    { pattern: /\\Beta/g, replace: '&Beta;' },
    { pattern: /\\beta/g, replace: '&beta;' },
    { pattern: /\\Gamma/g, replace: '&Gamma;' },
    { pattern: /\\gamma/g, replace: '&gamma;' },
    { pattern: /\\Delta/g, replace: '&Delta;' },
    { pattern: /\\delta/g, replace: '&delta;' },
    { pattern: /\\Epsilon/g, replace: '&Epsilon;' },
    { pattern: /\\epsilon/g, replace: '&epsilon;' },
    { pattern: /\\Zeta/g, replace: '&Zeta;' },
    { pattern: /\\zeta/g, replace: '&zeta;' },
    { pattern: /\\Eta/g, replace: '&Eta;' },
    { pattern: /\\eta/g, replace: '&eta;' },
    { pattern: /\\Theta/g, replace: '&Theta;' },
    { pattern: /\\theta/g, replace: '&theta;' },
    { pattern: /\\Iota/g, replace: '&Iota;' },
    { pattern: /\\iota/g, replace: '&iota;' },
    { pattern: /\\Kappa/g, replace: '&Kappa;' },
    { pattern: /\\kappa/g, replace: '&kappa;' },
    { pattern: /\\Lambda/g, replace: '&Lambda;' },
    { pattern: /\\lambda/g, replace: '&lambda;' },
    { pattern: /\\Mu/g, replace: '&Mu;' },
    { pattern: /\\mu/g, replace: '&mu;' },
    { pattern: /\\Nu/g, replace: '&Nu;' },
    { pattern: /\\nu/g, replace: '&nu;' },
    { pattern: /\\Xi/g, replace: '&Xi;' },
    { pattern: /\\xi/g, replace: '&xi;' },
    { pattern: /\\Omicron/g, replace: '&Omicron;' },
    { pattern: /\\omicron/g, replace: '&omicron;' },
    { pattern: /\\Pi/g, replace: '&Pi;' },
    { pattern: /\\pi/g, replace: '&pi;' },
    { pattern: /\\Rho/g, replace: '&Rho;' },
    { pattern: /\\rho/g, replace: '&rho;' },
    { pattern: /\\Sigma/g, replace: '&Sigma;' },
    { pattern: /\\sigma/g, replace: '&sigma;' },
    { pattern: /\\Tau/g, replace: '&Tau;' },
    { pattern: /\\tau/g, replace: '&tau;' },
    { pattern: /\\Upsilon/g, replace: '&Upsilon;' },
    { pattern: /\\upsilon/g, replace: '&upsilon;' },
    { pattern: /\\Phi/g, replace: '&Phi;' },
    { pattern: /\\phi/g, replace: '&phi;' },
    { pattern: /\\Chi/g, replace: '&Chi;' },
    { pattern: /\\chi/g, replace: '&chi;' },
    { pattern: /\\Psi/g, replace: '&Psi;' },
    { pattern: /\\psi/g, replace: '&psi;' },
    { pattern: /\\Omega/g, replace: '&Omega;' },
    { pattern: /\\omega/g, replace: '&omega;' }
]


const customCharactersAndMacrosRegexes = {
    '$': {
        pattern: /(\\\$)/g,
        replace: "&dollar;"
    },
    "&": {
        pattern: /(\\\&)/g,
        replace: "&amp;"
    },
    "^": {
        pattern: /(\\\^)/g,
        replace: "&Hat;"
    },
    "_": {
        pattern: /(\\\_)/g,
        replace: "&lowbar;"
    },
    "{": {
        pattern: /(\\\{)/g,
        replace: "&lcub;"
    },
    "}": {
        pattern: /(\\\})/g,
        replace: "&rcub;"
    },
    "*": {
        pattern: /(\\\*)/g,
        replace: "&midast;"
    },
    "%": {
        pattern: /(\\\%)/g,
        replace: "&percnt;"
    },
    "\\": {
        pattern: /(\\\\)/g,
        replace: "&bsol;"
    },
    "[": {
        pattern: /(\\\[)/g,
        replace: "&lsqb;"
    },
    "]": {
        pattern: /(\\\])/g,
        replace: "&rsqb;"
    },
};



export{
    basicRegexes,
    listRegexes,
    customCharactersAndMacrosRegexes,
    mathRegexes,
    mathOperators
}