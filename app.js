import fs from 'fs';
import parseFile from './parsing/parser.js';



const fileData = fs.readFileSync('input.plm').toString().split("\n");
const resLines = parseFile(fileData);

fs.writeFileSync("out.html",resLines.join('\n'));
