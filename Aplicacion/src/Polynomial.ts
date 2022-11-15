import nerdamer from 'nerdamer-ts';


export default class Polynomial {
  private coefMap : Map<string, string> = new Map();
  private varOrder: string[] = [];

  constructor(p: string) {
    var pol = "";
    try {
      pol = nerdamer(p).expand().toString();
    } catch (e) {
      console.log(`ERROR PARSING POLYNOMIAL ${p}`);
    }

    this.computeCoefficients(nerdamer.tree(pol), true);
  }

  // === PUBLIC INSTANCE METHODS ===
  /** Multiply this polynomial by q */
  multiply(q: Polynomial) {
    let product = '';
    
    for (let keyP in this.coefMap) {
      for (let keyQ in q.coefMap) {
        product += `${product.length > 0 ? '+' : ''} (${
          this.coefMap.get(keyP)
        }*${keyP}) * (${q.coefMap.get(keyQ)}*${keyQ})`;
      }
    }

    product = nerdamer(product).expand().toString();
    this.computeCoefficients(nerdamer.tree(product), true);
  }

  /** Add q to this polynomial */
  plus(q: Polynomial){
    let sum = '';
    console.log(this.coefMap, q.coefMap);

    for (let keyP in this.coefMap)
      sum += `${sum.length > 0 ? '+' : ''} (${this.coefMap.get(keyP)}*${keyP})`;

    let keyQ: keyof typeof q.coefMap;
    for (let keyQ in q.coefMap)   
      sum += `+ (${q.coefMap.get(keyQ)}*${keyQ})`;
    
    sum = nerdamer(sum).expand().toString();
    this.computeCoefficients(nerdamer.tree(sum), true);
  }

  /** Leader coefficient */
  lc(){
    return this.coefMap.get(this.varOrder[0]);
  }

  /** Leader monomial */
  lm(){
    return this.varOrder[0];
  }

  /** Leader term */
  lt(){
    const coefNull = this.lc() !== '1';
    return `${coefNull ? this.lc() : ''}${coefNull ? '*' : ''}${this.lm()}`;
  }

  exp(){
    return Polynomial.exp(this.varOrder[0]);
  }

  toString() {
    let res = '';

    for (var i = 0; i < this.varOrder.length; i++) {
      const mon = this.varOrder[i];
      const coef = this.coefMap.get(mon);
      
      console.log(i < this.varOrder.length - 1);
      console.log("kk",  typeof(i));
      const nextMon =
        i < this.varOrder.length - 1 ? this.varOrder[i + 1] : null;
        console.log("mon ", nextMon);
      const nextCoef = nextMon ? this.coefMap.get(nextMon) : '';

      const coefNeg = coef === '-1';
      const needParentheses = coef !== '1' && !coefNeg;

      console.log("next", nextCoef![0] !=='-');

      const sign = `${coef==='-1' ? '-' : `${coef![0]==='-' ? nextCoef : `${i>0 ? '+' : ''}`}`}`;
      res += 
      `${sign} ${needParentheses ? '(' : ''}${mon}${needParentheses ? ')' : ''} `;
    }

    return res;
  }

  // === PUBLIC STATIC METHODS ===

  /** Exponent */
  static exp(p: string) {
    const split = p.split(/[-+]+/); // separa por + o -
    let res = [0, 0, 0];

    split.forEach((element) => {
      if (element === '') return;

      let degs = [
        Number(nerdamer(`deg(${element}, x)`).toString()),
        Number(nerdamer(`deg(${element}, y)`).toString()),
        Number(nerdamer(`deg(${element}, z)`).toString()),
      ];

      if (Polynomial.expGreater(degs, res)) res = degs;
    });

    return res;
  }

  // === PRIVATE STATIC METHODS (not private yet) ===
  static expGreater(a: number[], b: number[]) {
    return (
      a[0] > b[0] ||
      (a[0] == b[0] && a[1] > b[1]) ||
      (a[0] == b[0] && a[1] == b[1] && a[2] > a[2])
    );
  }

  // === PRIVATE INSTANCE METHODS ===
  strContainsChar(str: string, chars: string[]) {
    // console.log('COMPROBANDO ' + str);
    for (let i = 0; i < str.length; i++) {
      if (chars.includes(str[i])) return true;
    }

    return false;
  }


  computeCoefficients(node: any, firstIt = false) {

    if(firstIt)
      this.coefMap.clear();

    const pol = this.nodeToString(node);
    const vars = ['x', 'y', 'z'];
    console.log("pol ", pol);
    if (node === null || node === undefined) return;

    if (!node.left && !node.right) {
      console.log(node.value);
      if (['x', 'y', 'z'].includes(node.value)) 
        this.coefMap.set(node.value, '1');
      else{
        console.log("AQUI: ", pol);
        this.coefMap.set('1', pol);
      }

      return;
    }

    // console.log(pol);
    if (!this.strContainsChar(pol, vars)) {
      console.log('AÑADO ' + pol);
      this.coefMap.set('1', pol);
      return;
    }

    // console.log(pol);
    var pattern = /[+]/;

    if (!pattern.test(pol) && pol !== '') {
      // const coef = this.nodeToString(node.left);
      // const variable = this.nodeToString(node.right);

      let coef = '';
      let variable = '';
      let writingCoef = true;
      console.log(pol);
      for (let i = 0; i < pol.length; i++) {
        if (['x', 'y', 'z'].includes(pol[i])) {
          writingCoef = false;

          if (coef.length === 0) coef = '1';

          // console.log('HOLA:' + coef[coef.length - 1]);
          if (coef[coef.length - 1] === '*') coef = coef.slice(0, -1);
        }

        if (!['(', ')'].includes(pol[i])) {
          if (writingCoef) coef += pol[i];
          else variable += pol[i];
        }
      }

      this.coefMap.set(variable, coef==='-' ? '-1' : coef);

      // console.log(`COEF: ${coef}, VAR: ${variable}`);
    } else {
      this.computeCoefficients(node.left);
      this.computeCoefficients(node.right);
    }

    if (node !== null && node !== undefined) {
      if (node.type === 'OPERATOR' && node.value === '*') {
        // console.log('PRODUC');
        // console.log(node.left);
        // console.log(node.right);
      }
    }

    let monomials = Object.keys(this.coefMap);
    monomials.sort(function (a, b) {
      return Polynomial.expGreater(Polynomial.exp(a), Polynomial.exp(b)) ? -1 : 1;
    });

    this.varOrder = monomials;
  }

  nodeToString(node: any): string {
    console.log(node);
    if (node !== null && node !== undefined) {
      if (node.type === 'VARIABLE_OR_LITERAL') {
        const isVariable = ['x', 'y', 'z'].includes(node.value);
        // console.log("ES LITERAL O VARIABLE: " + node.value);
        // console.log(node.value);
        return isVariable ? node.value : parseFloat(node.value);
      }

      if (node.type === 'OPERATOR') {
        let left = this.nodeToString(node.left);
        let right = this.nodeToString(node.right);

        // console.log("ES OPERATOR: " + node.value);
        // console.log("OPERATOR LEFT: " + left);
        // console.log("OPERATOR RIGHT: " + right);
        // console.log(`DEVUELVO ${(right && left) ? `${left}${node.value}${right}` : `${node.value}${left}`}`);

        const leftParenthesis = node.left?.type !== 'VARIABLE_OR_LITERAL';
        const rightParenthesis = node.right?.type !== 'VARIABLE_OR_LITERAL';

        console.log("OPERATOR: " + node.value);
        console.log(node.value === '-');
        console.log("TYPEL: " + node.left?.type);
        console.log("TYPER: " + node.right?.type);
        // console.log(`PAR.LEFT: ${leftParenthesis}, RIGHT. PAR: ${rightParenthesis}`);
        const l = leftParenthesis ? `(${left})` : `${left}`;
        const r = rightParenthesis ? `(${right})` : `${right}`;
        // console.log('RIGHT ' + r);
        if(node.value === '-'){
          console.log("asi es:", left, right);
        }
        if (right && left) return `${l}${node.value}${r}`;
        else{ console.log("ASI ES", `${node.value}${l}`);
        return `${node.value}${l}`;}
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
  }

}
