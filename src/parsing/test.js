const {parseFile} = require("./parser.js");
const fs = require('fs');

async function sleep(time){
    await new Promise((res) => {
        setTimeout(res, time);
    });
}

async function main(){
    const sourceFile = "C:/Users/mrcla/Desktop/Coding/palhm/src/parsing/test.plm";
    let curSize = fs.statSync(sourceFile).size;

    const buffer = fs.readFileSync(
        sourceFile
        ).toString().replaceAll("\r","");
    
    const output = parseFile(buffer);
    fs.writeFileSync(
        "C:/Users/mrcla/Desktop/Coding/palhm/src/parsing/test-out.html"
        ,output)


    while(true){
        await sleep(1000);
        const newSize = fs.statSync(sourceFile).size;
        if(curSize !== newSize){
            curSize = newSize;
            console.log('Re-Rendering');
            const buffer = fs.readFileSync(
                sourceFile
                ).toString().replaceAll("\r","");
            
            const output = parseFile(buffer);
            fs.writeFileSync(
                "C:/Users/mrcla/Desktop/Coding/palhm/src/parsing/test-out.html"
                ,output)
        }
    }
}

main();