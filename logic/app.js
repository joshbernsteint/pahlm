import fs from 'fs';
import parseFile from './parsing/parser.js';
// import { encode } from 'html-entities';

async function sleep(seconds){
    return new Promise((resolve) => {
        setTimeout(resolve, seconds*1000);
      });
}


const filePath = "input.plm";
let fileSize = 0;


while(true){
    const newSize = fs.statSync(filePath).size;
    if(fileSize !== newSize){
        fileSize = newSize;
        const fileData = fs.readFileSync(filePath).toString().replaceAll("\r","");
        fs.writeFileSync("out.html",parseFile(fileData));
    }
    await sleep(5);
}




// /\{[^}{]*(?:\{[^}{]*(?:\{[^}{]*(?:\{[^}{]*\}[^}{]*)*\}[^}{]*)*\}[^}{]*)*\}/gm

// console.log(encode('=', {mode: 'extensive'}));