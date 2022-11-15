import nerdamer from "nerdamer-ts";
import nerdamerjs from "nerdamer";
import { Console } from "console";

export default class Polynomial {
  private coefMap: Map<string, string> = new Map();
  private varOrder: string[] = [];
  public vars: string[] = ["x", "y", "z"];
  constructor(p: string) {
    var pol = "";
    try {
      pol = nerdamer(p).expand().toString();
    } catch (e) {
      console.log(`ERROR PARSING POLYNOMIAL ${p}`);
    }

    // console.log("=== COMPUTING DE ", pol);

    this.computeCoefficients(pol, true);

    // console.log("POL CREADO ", this.toString());
  }

  // === PUBLIC INSTANCE METHODS ===
  /** Multiply this polynomial by q */
  multiply(q: Polynomial) {
    let product = "";

    this.coefMap.forEach((pVal: string, pKey: string) => {
      q.coefMap.forEach((qVal: string, qKey: string) => {
        product += `${
          product.length > 0 ? "+" : ""
        } (${pVal}*${pKey}) * (${qVal}*${qKey})`;
      });
    });

    product = nerdamer(product).expand().toString();
    return new Polynomial(product);
  }

  /** Add q to this polynomial */
  plus(q: Polynomial) {
    let sum = "0";
    // console.log(this.coefMap, q.coefMap);
    // console.log(Object.entries(this.coefMap));

    this.coefMap.forEach((value: string, key: string) => {
      sum += `${sum.length > 0 ? "+" : ""} (${value}*${key})`;
    });

    q.coefMap.forEach((value: string, key: string) => {
      sum += `+ (${value}*${key})`;
    });

    sum = nerdamer(sum).expand().toString();
    return new Polynomial(sum);

  }

  /** Substract q to this polynomial */
  minus(q: Polynomial) {
    let sum = "0";
    
    this.coefMap.forEach((value: string, key: string) => {
      sum += `${sum.length > 0 ? "+" : ""} (${value}*${key})`;
      // console.log(sum);
    });

    q.coefMap.forEach((value: string, key: string) => {
      sum += `- (${value}*${key})`;
      // console.log(sum);
    });

    sum = nerdamer(sum).expand().toString();
    // console.log("RESTA", sum);
    return new Polynomial(sum);
  }

  /** Leader coefficient */
  lc() {
    // console.log(this.coefMap, this.varOrder);
    return Number(this.coefMap.get(this.varOrder[0]));
  }

  /** Leader monomial */
  lm() {
    return this.varOrder[0];
  }

  /** Leader term */
  lt() {
    const coefNull = this.lc() !== 1;
    return `${coefNull ? this.lc() : ""}${coefNull ? "*" : ""}${this.lm()}`;
  }

  exp() {
    // console.log("a ", this.varOrder[0]);
    return Polynomial.exp(this.varOrder[0]);
  }

  isZero() {
    const n = this.coefMap.size;

    return (
      n === 0 ||
      (n === 1 && this.coefMap.values().next().value === "0")
    );
  }

  toString() {
    let res = "";

    for (var i = 0; i < this.varOrder.length; i++) {
      const mon = this.varOrder[i];
      const coef = this.coefMap.get(mon);

      // console.log(i < this.varOrder.length - 1);
      // console.log("kk", typeof i);
      const nextMon =
        i < this.varOrder.length - 1 ? this.varOrder[i + 1] : null;
      const nextCoef = nextMon ? this.coefMap.get(nextMon) : "";

      const coefNeg = coef === "-1";
      // const needParentheses = coef !== "1" && !coefNeg;

      // console.log("next", nextCoef![0] !== "-");

      const sign = `${
        coef === "-1"
          ? `${mon!=="1" ? "-" : ""}`
          : `${coef![0] === "-" ? nextCoef : `${i > 0 ? "+" : ""}`}`
      }`;

      res += `${sign}${coef!=="1" ? coef : ""}${mon!=="1" ? mon : `${coef!=="1" ? "" : mon}`}`;
    }

    return res;
  }

  // === PUBLIC STATIC METHODS ===

  /** Exponent */
  static exp(p: string): number[] {
    // console.log(p);
    const split = p.split(/[-+]+/); // separa por + o -
    let res = [0, 0, 0];

    // console.log("as", split);
    split.forEach((element) => {
      if (element === "") return;

      // console.log("uno", element);
      let degs = [
        Number(nerdamerjs(`deg(${element}, x)`)),
        Number(nerdamerjs(`deg(${element}, y)`)),
        Number(nerdamerjs(`deg(${element}, z)`)),
      ];

      if (Polynomial.expGreater(degs, res)) res = degs;
    });

    return res;
  }

  /** Builds a monomial with the given exponent and lc=1 */
  static monomial(exp: number[]) {
    return new Polynomial(`x^(${exp[0]}) * y^(${exp[1]}) * z^(${exp[2]})`);
  }

  // === PRIVATE STATIC METHODS (not private yet) ===
  static expGreater(a: number[], b: number[]) {
    return (
      a[0] > b[0] ||
      (a[0] == b[0] && a[1] > b[1]) ||
      (a[0] == b[0] && a[1] == b[1] && a[2] > a[2])
    );
  }

  static expMinus(a: number[], b: number[]) {
    return [a[0] - b[0], a[1] - b[1], a[2] - b[2]];
  }

  static arrayCombinations(array: Polynomial[]) {
    var result = array.flatMap((v, i) => array.slice(i + 1).map((w) => [v, w]));
    return result;
  }

  static divide(f: Polynomial, fs: Polynomial[], maxIter: number = 1000) {
    console.log("INIT DIVISION",f, fs);

    let nSteps = 0;
    var steps: { [k: string]: any } = {};
    let step = [];
    let currIt = 0;
    const s = fs.length;


    let p = f;
    let r = new Polynomial("0");
    let coefs = Array(s).fill(new Polynomial("0"));

    while (!p.isZero() && currIt<maxIter) {
      nSteps++;
      currIt++;
      let i = 0;
      let divFound = 0;
      console.log("\t========= p = ", p, "==============");
      const exp_p = p.exp();

      // console.log("NUEVA ITERACION");
      // console.log("P", p);
      // console.log("coefss", coefs);
      // console.log("R", r);
      while (i < s && divFound === 0) {
        const exp_fi = fs[i].exp();
        const gamma = this.expMinus(exp_p, exp_fi);

        step = [];
        
        if (gamma.every((item) => item >= 0)) {
          const xGamma = this.monomial(gamma);
          const lcp = p.lc();
          const lcfi = fs[i].lc();

          const coef = xGamma.multiply(new Polynomial(`${lcp/lcfi}`)); 

          let newQi = coefs[i].plus(coef);

          let newP = p.minus(
            fs[i].multiply(coef)
          );

          step.push(`f = ${p}`);
          step.push(
            `exp(f) - exp(f_i)= (${exp_p[0]}, ${exp_p[1]}, ${exp_p[2]}) - (${exp_fi[0]}, ${exp_fi[1]}, ${exp_fi[2]}) => We can divide`
          );
          step.push(`q_i = (${coefs[i]}) + (${coef}) = ${newQi}`);
          step.push(`p = (${p}) - (${coef} * (${fs[i]}) ) = ${newP}`);
          step.push(p);
          coefs[i] = newQi;

          p = newP;
          divFound = 1;
          console.log("\tchange", newP.coefMap);
        } else {
          console.log(`\tNO PODEMOS`);
          i++;
        }
      }
      if (divFound === 0) {
        const LC = p.lc();
        const MON = this.monomial(exp_p);
        const lt = MON.multiply(new Polynomial(LC.toString()));

        const newR = r.plus(lt);
        const newP = p.minus(lt);
        
        console.log("\tchange", newP.coefMap);
        
        step.push("No division posible:");
        step.push(`lt(p) = (${LC})*(${MON}) = ${lt}`);
        step.push(`r = (${r}) + lt(p) = ${newR}`);
        step.push(`p = (${p}) - lt(p) = ${newP}`);

        r = newR;
        p = newP;
      }

      steps[`step${nSteps}`] = step;
    }

    step = [];

    let mult = new Polynomial("0");
    step.push(`r = ${r}`);
    coefs.forEach((qi, i) => {
      step.push(`q_${i} = ${qi}`);
      mult = mult.plus(qi.multiply(fs[i]));
    });

    mult = mult.plus(r);
    mult = mult.minus(f);

    steps["result"] = step;

    console.log("\tCHECK RESULT: " , mult.isZero());

    console.log("\tRES", [...coefs, r, steps]);

    return {
      quotients: [...coefs],
      remainder: r,
      steps: steps,
    };
  }

  /**
   * 
   * @param alfa in N^n
   * @param beta in N^n
   * @returns lcm(alfa,beta) = ( max(alfa_1,beta_1), ··· , max(alfa_n, beta_n) )
   */
  static lcm(alfa: number[], beta: number[]) {
    if(alfa.length !== beta.length){
      return [-1];
    }
  
    let res = [];
  
    for(let i=0; i<alfa.length; i++){
      res.push(Math.max(alfa[i], beta[i]));
    }
  
    return res;
  }

  /**
   * 
   * @returns S-Polynomial of f and g
   */
  static sPol(f: Polynomial, g: Polynomial) {
    const alpha = f.exp();
    const beta = g.exp();
    const gamma = this.lcm(alpha, beta);
 
    return this.monomial(this.expMinus(gamma,alpha)).multiply(f).minus(
      this.monomial(this.expMinus(gamma,beta)).multiply(g)
    );

  }

  /**
   * 
   * @param F Generator of the ideal I = <F>
   * @param maxIter maximum iterations
   * @returns Groebner base of I
   */
  static bucherberg(F: Polynomial[], maxIter: number = 1000) {
    let currIt = 0;
    let G = F;
    let added;

    console.log("BUCHERBERG", F);

    do {
      currIt++;
      let newG = Array.from(G);
      const fgPairs = this.arrayCombinations(newG);

      added = false;

      console.log("\tG=", G);
      for (let i = 0; i < fgPairs.length && !added; i++) {
        const r = this.divide(this.sPol(fgPairs[i][0], fgPairs[i][1]), newG).remainder;
        console.log("\t\tSPOL", this.sPol(fgPairs[i][0], fgPairs[i][1]));
        if (!r.isZero()) {
          
          G.push(r);
          added = true;
          console.log("\t\tAÑADIMOS ", r);
          
        }
      }
    } while (added && currIt<maxIter);

  console.log("FINAL");
    return G;
  }

  // === PRIVATE INSTANCE METHODS ===
  strContainsChar(str: string, chars: string[]) {
    // console.log('COMPROBANDO ' + str);
    for (let i = 0; i < str.length; i++) {
      if (chars.includes(str[i])) return true;
    }

    return false;
  }


  computeCoefficients(pol: string, firstIt = false) {
    if (firstIt){
      this.coefMap.clear();
    }
    if (!pol) return;
    const node = nerdamer.tree(pol);
    const nMinus = (pol.match(/-/g)||[]).length;
    const nPlus = (pol.match(/\+/g)||[]).length;

    // Si tiene un + no lo es: x+y
    // Si tiene algun -, lo sera si solo tiene uno: -xy, -x-y
    const isMonomial = nPlus===0 && nMinus <= 1;

    // === NO ES MONOMIO -> SEGUIMOS SEPARANDO
    if(!isMonomial){
      if(node.left)   this.computeCoefficients(this.nodeToString(node.left));
      if(node.right)  node.value==="-" ? this.computeCoefficients(`-${this.nodeToString(node.right)}`) : this.computeCoefficients(this.nodeToString(node.right));
    }

    else{
      let coef = "";
      let variable = "";
      let writingCoef = true;

      // Recorremos string
      for (let i = 0; i < pol.length; i++) {

        // Si nos encontramos con una variable, dejamos de escribir en coef. Si no encontramos
        // ningun coeficiente, significa que es 1, y si el coeficiente es -, significa que es -1

        if (this.vars.includes(pol[i])) {
          writingCoef = false;

          if (coef.length === 0)  coef = "1";
          else if(coef === "-")   coef = "-1";

          // Si el coeficiente acaba con el * de multiplicaral monomio lo quitamos
          if (coef[coef.length - 1] === "*") coef = coef.slice(0, -1);
        }

        if (!["(", ")"].includes(pol[i])) {
          if (writingCoef) coef += pol[i];
          else variable += pol[i];
        }
      }
      
      // Si no se ecnontro ninguna variable, es 1
      if(variable==="")
        variable = "1";

      this.coefMap.set(variable, coef === "-" ? "-1" : coef);
    }
    
    // Aplicamos LEX
    let monomials = Array.from(this.coefMap.keys());
    monomials.sort(function (a, b) {
      return Polynomial.expGreater(Polynomial.exp(a), Polynomial.exp(b))
        ? -1
        : 1;
    });

    this.varOrder = monomials;
  }

  nodeToString(node: any): string {
    // console.log(node);
    if (node !== null && node !== undefined) {
      if (node.type === "VARIABLE_OR_LITERAL") {
        const isVariable = ["x", "y", "z"].includes(node.value);
        // console.log("ES LITERAL O VARIABLE: " + node.value);
        // console.log(node.value);
        return isVariable ? node.value : node.value;
      }

      if (node.type === "OPERATOR") {
        let left = this.nodeToString(node.left);
        let right = this.nodeToString(node.right);

        // console.log("ES OPERATOR: " + node.value);
        // console.log("OPERATOR LEFT: " + left);
        // console.log("OPERATOR RIGHT: " + right);
        // console.log(`DEVUELVO ${(right && left) ? `${left}${node.value}${right}` : `${node.value}${left}`}`);

        const leftParenthesis = node.left?.type !== "VARIABLE_OR_LITERAL";
        const rightParenthesis = node.right?.type !== "VARIABLE_OR_LITERAL";

        // console.log("OPERATOR: " + node.value);
        // console.log(node.value === "-");
        // console.log("TYPEL: " + node.left?.type);
        // console.log("TYPER: " + node.right?.type);
        // console.log(`PAR.LEFT: ${leftParenthesis}, RIGHT. PAR: ${rightParenthesis}`);
        const l = leftParenthesis ? `(${left})` : `${left}`;
        const r = rightParenthesis ? `(${right})` : `${right}`;
        // console.log('RIGHT ' + r);
        if (node.value === "-") {
          // console.log("asi es:", left, right);
        }
        if (right && left) return `${l}${node.value}${r}`;
        else {
          // console.log("ASI ES", `${node.value}${l}`);
          return `${node.value}${l}`;
        }
      }

      if (node.type === "FUNCTION") {
        // console.log("ES F: " + node.value);
        let left = this.nodeToString(node.left);
        let right = this.nodeToString(node.right);

        // console.log(`DEVUELVO ${left}${node.value}${right}`);
        return `${left}${node.value}${right}`;
      }
    }

    return "";
  }
}
