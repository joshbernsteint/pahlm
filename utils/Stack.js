class Stack{
    constructor(){
        this.list = [];
        this.lastIndex = -1;
    }
    push(item){
        this.list.push(item);
        this.lastIndex++;
    }
    peek(){
        if(this.lastIndex >= 0)
            return this.list[this.lastIndex];
        else
            return null;
    }
    pop(){
        if(this.lastIndex < 0) return null;

        const retVal = this.peek();
        this.list = this.list.slice(0,this.lastIndex);
        this.lastIndex--;
        return retVal;
    }
    clear(){
        this.list = [];
        this.lastIndex = -1;
    }
};

export default Stack;