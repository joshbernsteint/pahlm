function checkString(str, label="test_string", options={}){
    const config = {
        throwErrors: options.throwErrors || true,
        trim: options.trim || true,
        customCheck: options.customCheck,
        allowEmpty: options.allowEmpty || false,
    }

    if(typeof str !== "string"){
        if(config.throwErrors)
            throw `${label} must be of type string`;
        else
            return false;
    }

    if(config.trim)
        str = str.trim();

    
    if(!config.allowEmpty && str.length === 0){
        if(config.throwErrors)
        throw `${label} cannot be of 0 length`;
        else
            return false;
    }




    if(config.customCheck && !config.customCheck(str)){
        if(config.throwErrors)
            throw `${label} failed custom check`;
        else
            return false;
    }
    return str;
}

module.exports = {
    checkString,
}