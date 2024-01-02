import fs from 'fs';
import parseFile from './parsing/parser.js';
// import { encode } from 'html-entities';



const fileData = fs.readFileSync('input.plm').toString().replaceAll("\r","");
const resLines = parseFile(fileData);

fs.writeFileSync("out.html",resLines);

//Taken from StackOverflow and modified
function matchCurlyBraces(depth=3)
{
    const basePatterns = ['\\{[^}{]*(?:','[^}{]*)*\\}'];
    return new RegExp(basePatterns[0].repeat(depth) + '\\{[^}{]*\\}' + basePatterns[1].repeat(depth), 'gm');
}

const t = matchCurlyBraces(3);
console.log(t);

// /\{[^}{]*(?:\{[^}{]*(?:\{[^}{]*(?:\{[^}{]*\}[^}{]*)*\}[^}{]*)*\}[^}{]*)*\}/gm

// console.log(encode('=', {mode: 'extensive'}));