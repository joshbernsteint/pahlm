const {replaceAllRecursive} = require("./myRegExp");
class Queue{
    constructor(string){
        this.string = string;
        this.currentQueue = [];
        this.stringDelta = 0;
        this.inaccessibleRanges = [];
    }


    IsRangeAccessible(startIndex, endIndex){

        return this.inaccessibleRanges.every(range => {
            const left = range[0] + this.stringDelta;
            const right = range[1] + this.stringDelta;
            if(
                (left <= startIndex && startIndex <= right) ||
                (left <= endIndex && endIndex <= right)
            ){
                return false;
            }
            return true;
        });
    }

    /**
     * Replaces the queue string with the specified string or function IF it can.
     * @param {RegExp} pattern 
     * @param {Function | string} replaceWith 
     */
    replaceAll(pattern, replaceWith){
        const replaceFunction = typeof replaceWith === "string" ? ((s) => replaceWith) : replaceWith;
        this.string = this.string.replaceAll(pattern, (s, ...args) => {
            const index = args.filter(el => typeof el === "number")[0];
            if(this.IsRangeAccessible(index, index + s.length)){
                console.log(s, args);
                const ret = replaceFunction(s, ...args);
                this.stringDelta += ret.length - s.length;
                return ret;
            }
            else
                return s;
        });
    }

    replaceAllR(pattern, runFunction){
        this.string = replaceAllRecursive(this.string, pattern, runFunction, (data, s, ...args) => {
            if(!this.IsRangeAccessible(data.start, data.end)) return s;
            else{
                const ret = runFunction(s, ...args);
                this.stringDelta += ret.length - s.length;
                return ret;
            }
        });
    }

    addToQueue(body, range, preventRecursive=false){
        if(!this.IsRangeAccessible(...range)) return -1;

        if(preventRecursive)
            this.inaccessibleRanges.push(range);
        
        this.currentQueue.push({
            match: body,
            start: range[0],
            end: range[1]
        });
        return 0;
    }

    setString(str){
        this.string = str;
    }

    clear(){
        this.currentQueue = [];
        this.inaccessibleRanges = [];
        this.string = "";
    }

    applyQueue(fun){
        const result = fun(this.string, this.currentQueue.map(queueItem => {
            return {
                ...queueItem,
                start: queueItem.start + this.stringDelta,
                end: queueItem.end + this.stringDelta,
            }
        }), this.currentQueue.length);
        this.string = result;
        this.currentQueue = [];
        this.inaccessibleRanges = [];
        return result;
    }

    /**
     * Matches the queue string against the given pattern
     * @param {RegExp} pattern Pattern to match against
     * @returns An array of matches
     */
    match(pattern){
        return Array.from(this.string.matchAll(pattern));
    }
};

module.exports = Queue;

