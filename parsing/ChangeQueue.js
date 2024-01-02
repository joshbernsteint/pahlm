import mathParser from "./math/math.js";

class ChangeQueue{
    constructor(string){
        this.string = string;
        this.currentQueue = [];
        this.inaccessibleRanges = [];
    }


    IsRangeAccessible(startIndex, endIndex, type){

        let validRange = true;
        this.inaccessibleRanges.every(range => {
            if(
                (range[0] <= startIndex && startIndex <= range[1]) ||
                (range[0] <= endIndex && endIndex <= range[1])
            ){
                validRange = false;
                return false;
            }
            return true;
        });
        return validRange;
    }

    addToQueue(regex, startIndex, endIndex, type){

        if(regex.substring.substring(regex.sliceLength,regex.substring.length - regex.sliceLength).length === 0) return -1;
        else if(this.IsRangeAccessible(startIndex, endIndex)){
            const newRange = [startIndex, endIndex];
            this.currentQueue.push({
                ...regex,
                range: newRange,
                type: type,
            });

            //If this regex prevents recursion inside of it
            if(regex.preventRecursive){
                this.inaccessibleRanges.push(newRange);
            }
        }
        else{
            return -1;
        }
    }

    setString(str){
        this.string = str;
    }

    clear(){
        this.currentQueue = [];
        this.string = "";
    }

    applyQueue(){
        for (let i = 0; i < this.currentQueue.length; i++) {
            const el = this.currentQueue[i];
            this.string = this.string.replace(el.pattern,(s,m1, offset) => {
                if(offset >= el.range[0]){
                    if(el.type === "inlineMath" || el.type === "blockLineMath")
                        return el.start + mathParser(m1) + el.end;
                    else
                        return el.start + (m1 ? m1 : "") + el.end;
                }
                else{
                    return s;
                }
            });
        }
        this.currentQueue = [];
        return this.string;
    }
};

export default ChangeQueue;

