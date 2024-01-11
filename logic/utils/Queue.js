
class Queue{
    constructor(string){
        this.string = string;
        this.currentQueue = [];
        this.inaccessibleRanges = [];
    }


    IsRangeAccessible(startIndex, endIndex){

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

    addToQueue(objBody, range){
        if(!this.IsRangeAccessible(...range)) return -1;

        if(objBody.preventRecursive)
            this.inaccessibleRanges.push(range);
        
        this.currentQueue.push({
            ...objBody,
            range: range,
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
        const result = fun(this.string, this.currentQueue, this.currentQueue.length);
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

export default Queue;

