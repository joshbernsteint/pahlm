const {Queue, createPattern, findOffset, replaceAt} = require("../../utils/index.js");
// const {mathMacros, mathIdentifiers} = require("./math_regexes.js");
const {replaceAllRecursive} = require('../../utils/myRegExp.js');


const defaultCommands = require("./commands.js");

const mathIdentifiers = [
    /**     Operators           */
    { pattern: /\\le/gm, replace: "&le;", op: true, },
    { pattern: /\\ge/gm, replace: "&ge;", op: true, },
    { pattern: /\+/gm, replace: "&plus;", op: true, },
    { pattern: /-/gm, replace: "&minus;", op: true, },
    { pattern: /\\times/gm, replace: "&times;", op: true,},
    { pattern: /\\div/gm, replace: "&divide;", op: true,},
    { pattern: /=/gm, replace: "&equals;", op: true, },
    { pattern: /\\ne/gm, replace: "&ne;", op: true, },
    { pattern: /\\pm/gm, replace: "&plusmn;", op: true,},
    { pattern: /\\not/gm, replace: "&not;", op: true, },
    { pattern: /\\cup/gm, replace: "&cup;", op: true, },
    { pattern: /\\cap/gm, replace: "&cap;", op: true, },
    { pattern: /\(/gm, replace: "&lpar;", op: true, },
    { pattern: /\)/gm, replace: "&rpar;", op: true, },

    /**     Arrow Regexes        */
    { pattern: /\\rarr/gm, replace: "&rarr;", op: true, },
    { pattern: /\\Rarr/gm, replace: "&DoubleRightArrow;", op: true, },
    { pattern: /\\Longrarr/gm, replace: "&LongRightArrow;", op: true, },
    { pattern: /\\LongRarr/gm, replace: "&DoubleLongRightArrow;", op: true, },

    { pattern: /\\larr/gm, replace: "&larr;", op: true, },
    { pattern: /\\Larr/gm, replace: "&DoubleLeftArrow;", op: true, },
    { pattern: /\\Longlarr/gm, replace: "LongLeftArrow;", op: true, },
    { pattern: /\\LongLarr/gm, replace: "&DoubleLongLeftArrow;", op: true, },

    { pattern: /\\lrarr/gm, replace: "&LeftRightArrow;", op: true, },
    { pattern: /\\LRarr/gm, replace: "&DoubleLeftRightArrow;", op: true, },
    { pattern: /\\Longlrarr/gm, replace: "&LongLeftRightArrow;", op: true, },
    { pattern: /\\LongLRarr/gm, replace: "&DoubleLongLeftRightArrow;", op: true, },


    /**     Other */
    { pattern: /\\;/gm, replace: "&nbsp;", },

    /**     Greek Letters        */
    { pattern: /\\Alpha/gm, replace: '&Alpha;' },
    { pattern: /\\alpha/gm, replace: '&alpha;' },
    { pattern: /\\Beta/gm, replace: '&Beta;' },
    { pattern: /\\beta/gm, replace: '&beta;' },
    { pattern: /\\Gamma/gm, replace: '&Gamma;' },
    { pattern: /\\gamma/gm, replace: '&gamma;' },
    { pattern: /\\Delta/gm, replace: '&Delta;' },
    { pattern: /\\delta/gm, replace: '&delta;' },
    { pattern: /\\Epsilon/gm, replace: '&Epsilon;' },
    { pattern: /\\epsilon/gm, replace: '&epsilon;' },
    { pattern: /\\Zeta/gm, replace: '&Zeta;' },
    { pattern: /\\zeta/gm, replace: '&zeta;' },
    { pattern: /\\Eta/gm, replace: '&Eta;' },
    { pattern: /\\eta/gm, replace: '&eta;' },
    { pattern: /\\Theta/gm, replace: '&Theta;' },
    { pattern: /\\theta/gm, replace: '&theta;' },
    { pattern: /\\Iota/gm, replace: '&Iota;' },
    { pattern: /\\iota/gm, replace: '&iota;' },
    { pattern: /\\Kappa/gm, replace: '&Kappa;' },
    { pattern: /\\kappa/gm, replace: '&kappa;' },
    { pattern: /\\Lambda/gm, replace: '&Lambda;' },
    { pattern: /\\lambda/gm, replace: '&lambda;' },
    { pattern: /\\Mu/gm, replace: '&Mu;' },
    { pattern: /\\mu/gm, replace: '&mu;' },
    { pattern: /\\Nu/gm, replace: '&Nu;' },
    { pattern: /\\nu/gm, replace: '&nu;' },
    { pattern: /\\Xi/gm, replace: '&Xi;' },
    { pattern: /\\xi/gm, replace: '&xi;' },
    { pattern: /\\Omicron/gm, replace: '&Omicron;' },
    { pattern: /\\omicron/gm, replace: '&omicron;' },
    { pattern: /\\Pi/gm, replace: '&Pi;' },
    { pattern: /\\pi/gm, replace: '&pi;' },
    { pattern: /\\Rho/gm, replace: '&Rho;' },
    { pattern: /\\rho/gm, replace: '&rho;' },
    { pattern: /\\Sigma/gm, replace: '&Sigma;' },
    { pattern: /\\sigma/gm, replace: '&sigma;' },
    { pattern: /\\Tau/gm, replace: '&Tau;' },
    { pattern: /\\tau/gm, replace: '&tau;' },
    { pattern: /\\Upsilon/gm, replace: '&Upsilon;' },
    { pattern: /\\upsilon/gm, replace: '&upsilon;' },
    { pattern: /\\Phi/gm, replace: '&Phi;' },
    { pattern: /\\phi/gm, replace: '&phi;' },
    { pattern: /\\Chi/gm, replace: '&Chi;' },
    { pattern: /\\chi/gm, replace: '&chi;' },
    { pattern: /\\Psi/gm, replace: '&Psi;' },
    { pattern: /\\psi/gm, replace: '&psi;' },
    { pattern: /\\Omega/gm, replace: '&Omega;' },
    { pattern: /\\omega/gm, replace: '&omega;' }
];

/**
 * Contains simple math macros
 */
const mathMacros = [
    //Superscript
    {
        grouped: [
            //Both brackets
            {
                balanced: true,
                pattern: [["{","}"], /\^/gm, ["{","}"]],
                run: (flags, s, g1, g2) => {
                    return `<msup>${mathParser(g1, flags)}${mathParser(g2, flags)}</msup>`
                }
            },
            // //Left brackets only
            {
                balanced: true,
                pattern: [["{","}"], /\^([^\n\^]*)/gm],
                run: (flags, s, g1, g2) => {
                    return `<msup>${mathParser(g1, flags)}${mathParser(g2, flags)}</msup>`
                }
            },
            //Right brackets only
            {
                balanced: true,
                pattern: [/([^\n\^]*)\^/gm, ["{","}"]],
                run: (flags, s, g1, g2) => {
                    return `<msup>${mathParser(g1, flags)}${mathParser(g2, flags)}</msup>`
                }
            },
            //Version with no brackets
            {
                pattern: /([^\n\^]*)\^([^\n\^]*)/gm,
                run: (flags, s, g1, g2) => {console.log(g1,g2);return `<msup>${mathParser(g1, flags)}${mathParser(g2, flags)}</msup>`}
            },
        ]
    },
    //Subscript
    // {
    //     pattern: "(#@|#!)_(#@|#!)",
    //     customArgument: [undefined, /[^\s]+/,undefined,/[^\s]*[^\{]/],
    //     name: "_",
    //     customOffset: true,
    //     variableOffset: true,
    //     giveFlags: true,
    //     run: (flags, s, ...args) => {
    //         args = args.filter(el => el != undefined);
    //         args.splice(-2);
    //         args = args.slice(0,4);
    //         let base;
    //         let sub;
    //         for (let i = 0; i < args.length; i++) {
    //             const element = args[i];
    //             if(element[0] === "{") continue;
    //             else if(base) sub = element;
    //             else base = element;
    //         }
    //         return `<msub>${mathParser(base, flags)}${mathParser(sub, flags)}</msub>`;
    //     },
    // },
    // { pattern: "\\\\text#@", giveFlags: true, run: (flags, s, ...args) => defaultCommands.text(flags, args), name: "\\\\text" },
    // { pattern: "\\\\sqrt#@", giveFlags: true, run: (flags, s, ...args) => defaultCommands.getBracketArgs(((g1) => `<msqrt>${mathParser(g1,flags)}</msqrt>`), args),  name: "\\\\sqrt"},
    // { pattern: "\\\\root#@#@", giveFlags: true, run: (flags, s, ...args) => defaultCommands.getBracketArgs(((g1, g2) => `<mroot>${mathParser(g1,flags)}${mathParser(g2,flags)}</mroot>`), args),  name: "\\\\root"},
    // { pattern: "\\\\frac#@#@", giveFlags: true, run: (flags, s, ...args) => defaultCommands.getBracketArgs(((g1, g2) => `<mfrac>${mathParser(g1,flags)}${mathParser(g2,flags)}</mfrac>`), args),  name: "\\\\frac"},
    // { pattern: "\\\\binom#@#@", giveFlags: true, run: (flags, s, ...args) => defaultCommands.getBracketArgs(((g1, g2) => `<mo>&lpar;</mo><mfrac linethickness="0">${mathParser(g1,flags)}${mathParser(g2,flags)}</mfrac><mo>&rpar;</mo>`), args),  name: "\\\\frac"},
    // { pattern: "\\\\int#@#@", giveFlags: true, run: (flags, s, ...args) => defaultCommands.getBracketArgs(((g1, g2) => `<msubsup><mo>&#x222B;</mo>${mathParser(g1,flags)}${mathParser(g2,flags)}</msubsup>`), args),  name: "\\\\int"},
];

function mathParser(str, flags){
    if(!isNaN(Number(str))){
        return `<mn>${str}</mn>`;
    }
    mathMacros.forEach(macro => {
        if(macro.grouped){
            macro.grouped.forEach(group => {
                if(group.balanced){
                    // console.log(str);
                    console.log(group);
                    str = replaceAllRecursive(str,group.pattern, (...args) => group.run(flags, ...args));
                }
                else{
                    str = str.replaceAll(group.pattern, (...args) => group.run(flags, ...args));
                }
            });
        }
    });

    return `<mrow>${str}</mrow>`;
}


module.exports = {
    mathParser: mathParser
};