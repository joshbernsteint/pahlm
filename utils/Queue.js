
class Queue{
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
            return 0;
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

    applyQueue(fun){
        const result = fun(this.string, this.currentQueue);
        this.string = result;
        this.currentQueue = [];
        return result;
    }
};

export default Queue;

