import defaultCommands from './commands.js';
import  mathParser  from './math.js';

const mathOperators = [
    { pattern: /\\le/g, replace: "&le;" },
    { pattern: /\\ge/g, replace: "&ge;" },
    { pattern: /\+/g, replace: "&plus;" },
    { pattern: /-/g, replace: "&minus;" },
    { pattern: /\\times/g, replace: "&times;"},
    { pattern: /\\div/g, replace: "&divide;"},
    { pattern: /=/g, replace: "&equals;" },
    { pattern: /\\ne/g, replace: "&ne;" },
    { pattern: /\\pm/g, replace: "&plusmn;"},
    { pattern: /\\not/g, replace: "&not;" },
    { pattern: /\\cup/g, replace: "&cup;" },
    { pattern: /\\cap/g, replace: "&cap;" },
];

const mathIdentifiers = [
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
];

/**
 * Contains simple math macros
 */
const mathMacros = [
    {
        pattern: "(#@|#!)\\^(#@|#!)",
        customArgument: [undefined, /[^\s]+/,undefined,/[^\s]+/],
        giveFlags: true,
        run: (flags, s, ...args) => {
            args.splice(-2)
            args = args.slice(0,4);
            let base;
            let sub;
            for (let i = 0; i < args.length; i++) {
                const element = args[i];
                if(element[0] === "{") continue;
                else if(base) sub = element;
                else base = element;
            }
            return `<msup>${mathParser(base, flags)}${mathParser(sub, flags)}</msup>`;
        }
    },
    {
        pattern: "(#@|#!)\\_(#@|#!)",
        customArgument: [undefined, /[^\s]+/,undefined,/[^\s]+/],
        giveFlags: true,
        run: (flags, s, ...args) => {
            args.splice(-2)
            args = args.slice(0,4);
            let base;
            let sub;
            for (let i = 0; i < args.length; i++) {
                const element = args[i];
                if(element[0] === "{") continue;
                else if(base) sub = element;
                else base = element;
            }
            return `<msub>${mathParser(base, flags)}${mathParser(sub, flags)}</msub>`;
        },
    },
];

const mathCommands = [
    { pattern: '\\\\text', arguments: 1, offsetIndex: 2, run: defaultCommands.text },
]


export{
    mathOperators,
    mathMacros,
    mathIdentifiers,
    mathCommands,
};