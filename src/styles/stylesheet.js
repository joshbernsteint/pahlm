const { checkString } = require("../utils/inputVal");

class Stylesheet{
    constructor(styleObj={}){
        if(typeof styleObj !== "object"){
            throw 'styleObj must be an object';
        }
        else{
            this.styles = styleObj;
        }
    }

    /**Creates a new selector, if the selector already exists, it will be overridden */
    addSelector(selector, attributes){
        const select = checkString(selector, "selector");
        if(typeof attributes !== "object")
            throw 'attributes must be an object';

        this.styles[select] = attributes;
    }

    /**Creates a new selector, if the selector already exists, it adds to it. */
    editSelector(selector, newFields){
        const select = checkString(selector, "selector");
        if(typeof newFields !== "object")
            throw 'newFields must be an object';

        if(this.styles[select]){
            this.styles[select] = {...this.styles[select], ...newFields};
        }
        else
            this.styles[select] = newFields;
    }

    /** Returns the stylesheet as an object */
    getSheet(){
        return this.styles;
    }

    toCSS(){
        const result = [];
        Object.keys(this.styles).forEach(key => {
            const el = this.styles[key];
            const entry = Object.keys(el).reduce((prev,cur) => {
                return prev + `${cur}:${el[cur]};`;
            }, key + " {") + "}";
            result.push(entry);
        });

        return result.join('\n');
    }

    toHTMLCSS(){
        return "<style>" + this.toCSS() + "</style>";
    }
}

module.exports = {
    default: Stylesheet
}