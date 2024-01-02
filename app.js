import fs from 'fs';
import parseFile from './parsing/parser.js';
// import { encode } from 'html-entities';



const fileData = fs.readFileSync('input.plm').toString().replaceAll("\r","");
const resLines = parseFile(fileData);

fs.writeFileSync("out.html",resLines);

// console.log(encode('=', {mode: 'extensive'}));