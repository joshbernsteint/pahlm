const { findOffset } = require("./stringUtils.js");
const {replaceAllRecursive} = require("./myRegExp");

class Queue{
    /**
     * @param {string} string 
     */
    constructor(string){
        this.string = string;
        this.currentQueue = [];
    }


    IsRangeAccessible(startIndex, endIndex){
        return this.currentQueue.every(el => {
            const range = el.rangeData;
            const left = range.start + range.delta;
            const right = range.end + range.delta;
            if(
                (left <= startIndex && startIndex <= right) ||
                (left <= endIndex && endIndex <= right)
            ){
                return false;
            }
            return true;
        });
    }

    _updateStringDeltas(position, amount){
        for (let i = 0; i < this.currentQueue.length; i++) {
            if(position <= this.currentQueue[i].rangeData.end)
                this.currentQueue[i].rangeData.delta += amount;
        }
    }

    /**
     * Replaces the queue string with the specified string or function IF it can.
     * @param {RegExp} pattern 
     * @param {Function | string} replaceWith 
     */
    _rA(pattern, replaceWith){
        const replaceFunction = typeof replaceWith === "string" ? ((s) => replaceWith) : replaceWith;
        this.string = this.string.replaceAll(pattern, (s, ...args) => {
            const index = findOffset(args);
            if(this.IsRangeAccessible(index, index + s.length)){
                const ret = replaceFunction(s, ...args);
                this._updateStringDeltas(index,ret.length - s.length);
                return ret;
            }
            else
                return s;
        });
    }

    _rAR(pattern, runFunction){
        this.string = replaceAllRecursive(this.string, pattern, runFunction, (data, s, ...args) => {
            if(!this.IsRangeAccessible(data.start, data.end)) return s;
            else{
                const ret = runFunction(s, ...args);
                this._updateStringDeltas(data.start, ret.length - s.length);
                return ret;
            }
        });
    }

    /**
     * 
     * @param {Array|RegExp} pattern 
     * @param {string|Function} replaceWith 
     */
    replaceAll(pattern, replaceWith){
        if(Array.isArray(pattern))
            this._rAR(pattern, replaceWith);
        else
            this._rA(pattern, replaceWith);
    }

    addToQueue(body, range){
        if(!this.IsRangeAccessible(...range)) return -1;
        this.currentQueue.push({
            match: body,
            rangeData: {
                start: range[0],
                end: range[1],
                delta: 0,
            }
        });
        return 0;
    }

    setString(str){
        this.string = str;
    }

    clear(){
        this.currentQueue = [];
        this.string = "";
    }

    applyQueue(fun){
        const result = fun(this.string, this.currentQueue, this.currentQueue.length);
        this.string = result;
        this.currentQueue = []; 
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

