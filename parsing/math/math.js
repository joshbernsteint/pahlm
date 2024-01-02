import { mathMacros, mathOperators,mathIdentifiers, mathCommands } from "./math_regexes.js";

function mathParser(string){


    function helper(str){
        // console.log(str);
        if(!isNaN(Number(str))){
            return `<mn>${str}</mn>`;
        }
    
    
        // mathCommands.forEach(command => {
        //     str = str.replaceAll(command.pattern, command.run);
        // });


        
        mathOperators.forEach(op => {
            str = str.replaceAll(op.pattern,`<mo>${op.replace}</mo>`);
        });


        
        mathIdentifiers.forEach(id => {
            str = str.replaceAll(id.pattern, `<mi>${id.replace}</mi>`);
        });

        
        for (let i = 0; i < mathMacros.length; i++) {
            const body = mathMacros[i];
            str = str.replaceAll(body.pattern, (s,g1,g2,g3) => {
                let [left,right] = s.split(body.operator);
                if(left[0] === "{" && left[left.length-1] === "}")
                    left = helper(left.substring(1,left.length - 1));
                else
                    left = helper(left);
    
                if(right[0] === "{" && right[right.length-1] === "}")
                    right = helper(right.substring(1,right.length - 1));
                else
                    right = helper(right);
    
                return body.start + left + right + body.end;
            });
        }



        return `<mrow>${str}</mrow>`;
    }

    // Replacing unbound indentifiers
    string = string.replaceAll(/(?<!\\)\b[a-zA-Z0-9]+/gm,(s) => {
        const splitted = s.split('').map(el => `<mi>${el}<mi>`);
        return splitted.join('');
    });

    string = helper(string);
    return string;
}

export default mathParser;