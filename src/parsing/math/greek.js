
/**
 * Used for generating a list of regular expressions corresponding to greek letters.
 * @returns A list of objects containing regular expression, replace pairs.
 */
function greekParser(){
    const list = ['alpha','beta','gamma','delta','epsilon','zeta','eta','theta','iota','kappa','lambda','mu','nu','xi','omicron','pi','rho','sigma','tau','upsilon','phi','chi','psi','omega'];
    const result = [];
    for (let i = 0; i < list.length; i++) {
        const element = list[i];
        const upper = element.charAt(0).toUpperCase() + element.substring(1);
        result.push({
            pattern: new RegExp(`\\\\${upper}`,'g'),
            replace: `&${upper};`,
        });

        result.push({
            pattern: new RegExp(`\\\\${element}`,'g'),
            replace: `&${element};`,
        });

    }
    return result;
}
module.exports = greekParser;