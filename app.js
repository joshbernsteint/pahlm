import fs from 'fs';
import parseString from './parsing/parser.js';



const fileData = fs.readFileSync('input.plm').toString().split("\n");
const resLines = [];


fileData.forEach(line => {
    resLines.push(parseString(line));
});

fs.writeFileSync("out.html",resLines.join('\n'));
