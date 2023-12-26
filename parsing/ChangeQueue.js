class ChangeQueue{
    constructor(string){
        this.string = string;
        this.currentQueue = [];
        this.inaccessibleRanges = [];
    }


    IsRangeAccessible(startIndex, endIndex, type){
        let validRange = true;
        this.inaccessibleRanges.every(range => {
            if((type !== range[2] || range[2] === "none") && ((range[0] <= startIndex && endIndex <= range[1]) || 
            (startIndex <= range[0] && range[1] <= endIndex) || 
            (range[0] <= startIndex && endIndex >= range[1]) || 
            (range[0] >= startIndex && endIndex <= range[1])) 
            ){
                validRange = false;
                return false;
            }
            return true;
        });
        return validRange;
    }

    addToQueue(regex, startIndex, endIndex, type){
        if(this.IsRangeAccessible(startIndex, endIndex)){
            const newRange = [startIndex, endIndex, type];
            this.currentQueue.push({
                ...regex,
                range: newRange,
                type: type,
            });

            //If this regex prevents recursion inside of it
            if(regex.preventRecursion){
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
};

export default ChangeQueue;