import nerdamer from "nerdamer";

export default class Polynomial {
    pol = "0";
    lc = "0";
    coefMap = {};
    coefList = [];

    constructor(p){
        try{
            this.pol = nerdamer(p).expand().toString();
        }catch(e){
            console.log(`ERROR PARSING POLYNOMIAL ${p}`);
        }

        console.log(this.pol);
        this.findCoefficients(nerdamer.tree(this.pol));

        console.log("FINAL COEFFS");
        console.log(this.coefMap);

    }

    multiply(q){
      let product= "";

      for (let keyP in this.coefMap) {
        for (let keyQ in q.coefMap) {
          console.log(`(${this.coefMap[keyP]}*${keyP}) * (${q.coefMap[keyQ]}*${keyQ})`);
          product += `${product.length>0 ? '+' : ''} (${this.coefMap[keyP]}*${keyP}) * (${q.coefMap[keyQ]}*${keyQ})`;
        }
      }

      this.p = nerdamer(product).expand().toString();
      console.log("PRODUCT;");
      console.log(this.p);
    }

    strContainsChar(str, chars){
      console.log("COMPROBANDO " + str);
      for(let i=0; i<str.length; i++){
        if(chars.includes(str[i]))
          return true;
      }

      return false;
    }

    findCoefficients(node){

      const pol = this.nodeToString(node);
      const vars = ['x', 'y', 'z'];
      let coefMap = {};

      if(node===null || node===undefined)
        return;

      if(!node.left && !node.right){
        if(['x','y','z'].includes(node.value))
         coefMap[node.value] = "1";
        else
         coefMap["1"] = pol;

        return;
      }

      console.log(pol);
      if(!this.strContainsChar(pol, vars)){
        console.log("AÑADO " + pol);
       coefMap["1"] = pol;
        return;
      }

      console.log(pol);
      var pattern = /[+-]/;

      if(!pattern.test(pol) && pol!==''){
        // const coef = this.nodeToString(node.left);
        // const variable = this.nodeToString(node.right);

        let coef = "";
        let variable = "";
        let writingCoef = true;

        for(let i=0; i<pol.length; i++){
          if(['x','y','z'].includes(pol[i])){
            writingCoef = false;

            if(coef.length === 0)
              coef = "1";

            console.log("HOLA:" + coef[coef.length-1]);
            if(coef[coef.length-1] === "*")
              coef = coef.slice(0, -1);
          }

          
          if(!['(', ')'].includes(pol[i])){
            if(writingCoef) coef += pol[i];
            else            variable += pol[i];
          }
        }

       coefMap[variable] = coef;

        console.log(`COEF: ${coef}, VAR: ${variable}`);
      }
      else{
        this.findCoefficients(node.left);
        this.findCoefficients(node.right);
      }

      if (node!==null && node!==undefined) {
        if(node.type === 'OPERATOR' && node.value === "*"){
          console.log("PRODUC");
          console.log(node.left);
          console.log(node.right);
        }
      }

      let monomials = coefMap.keys();
      monomials.sort((lexOrder);
      
    }

    toString(){
      return this.pol;
    }

    nodeToString(node) {
        // console.log(node);
        if (node!==null && node!==undefined) {

          if (node.type === 'VARIABLE_OR_LITERAL') {
            const isVariable = ['x', 'y', 'z'].includes(node.value);
            // console.log("ES LITERAL O VARIABLE: " + node.value);
            // console.log(node.value);
            return isVariable ? node.value : parseFloat(node.value).toFixed(4);
          }

          if (node.type === 'OPERATOR') {
            
            let left = this.nodeToString(node.left);
            let right = this.nodeToString(node.right);

            // console.log("ES OPERATOR: " + node.value);
            // console.log("OPERATOR LEFT: " + left);
            // console.log("OPERATOR RIGHT: " + right);
            // console.log(`DEVUELVO ${(right && left) ? `${left}${node.value}${right}` : `${node.value}${left}`}`);

            const leftParenthesis = node.left?.type!=="VARIABLE_OR_LITERAL";
            const rightParenthesis = node.right?.type!=="VARIABLE_OR_LITERAL";

            // console.log("OPERATOR: " + node.value);
            // console.log("TYPEL: " + node.left.type);
            // console.log("TYPER: " + node.right.type);
            // console.log(`PAR.LEFT: ${leftParenthesis}, RIGHT. PAR: ${rightParenthesis}`);
            const l = leftParenthesis ? `(${left})` : `${left}`;
            const r = rightParenthesis ? `(${right})` : `${right}`;

            if(right && left)   return `${l}${node.value}${r}`;
            else                return `${node.value}${l}`;
          }

          if (node.type === 'FUNCTION') {
            // console.log("ES F: " + node.value);
            let left = this.nodeToString(node.left);
            let right = this.nodeToString(node.right);
            
            // console.log(`DEVUELVO ${left}${node.value}${right}`);
            return `${left}${node.value}${right}`;
            
          }
        }

        return '';
      };
}