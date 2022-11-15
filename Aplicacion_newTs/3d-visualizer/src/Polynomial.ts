import nerdamer from "nerdamer-ts";
import nerdamerjs from "nerdamer";
import { Console } from "console";

export default class Polynomial {
  private coefMap: Map<string, string> = new Map();
  private varOrder: string[] = [];

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

    console.log("MULT ", this.coefMap, q.coefMap, product);
    product = nerdamer(product).expand().toString();
    console.log(product);
    console.log("res muLT ", new Polynomial(product));
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

    console.log("su,m", sum);
    sum = nerdamer(sum).expand().toString();
    return new Polynomial(sum);

  }

  /** Substract q to this polynomial */
  minus(q: Polynomial) {
    let sum = "0";
    console.log("RESTANDO", this.coefMap, q.coefMap);
    
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
    // console.log("CHECK KEYS", this.coefMap);
    console.log(typeof(this.coefMap.values().next().value));
    console.log(this.coefMap);
    console.log("comprobando si ",  this.coefMap.values().next().value, " es 0",
    (n === 1 && this.coefMap.values().next().value === "0"));
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

  static divide(f: Polynomial, fs: Polynomial[], maxIter: number = 1000) {
    console.log(`INIT DIVISION ${f} / (${fs})`);
    console.log(f);
    console.log(fs[0], fs[1]);
    let nSteps = 0;
    var steps: { [k: string]: any } = {};
    let step = [];
    let currIt = 0;
    const s = fs.length;


    let p = f;
    let r = new Polynomial("0");
    let coefs = [new Polynomial("0"), new Polynomial("0")];

    while (!p.isZero() && currIt<maxIter) {
      console.log("CHECK0 ", p, p.isZero());
      nSteps++;
      currIt++;
      let i = 0;
      let divFound = 0;
      console.log(p);
      console.log(`========= p = ${p} ==============`);
      const exp_p = p.exp();

      // console.log("NUEVA ITERACION");
      // console.log("P", p);
      // console.log("coefss", coefs);
      // console.log("R", r);
      while (i < s && divFound === 0) {
        console.log(fs[i].toString());
        const exp_fi = fs[i].exp();
        const gamma = this.expMinus(exp_p, exp_fi);

        step = [];
        console.log(`PROBANDO DIVISION POR ${fs[i]}`);
        console.log(`\texp(p)-exp(fi) = (${exp_p}) - (${exp_fi}) = (${gamma})`);
        if (gamma.every((item) => item >= 0)) {
          console.log(`\tPODEMOS`);
          const xGamma = this.monomial(gamma);
          console.log("MONOMIAL ", xGamma);
          const lcp = p.lc();
          const lcfi = fs[i].lc();

          const coef = xGamma.multiply(new Polynomial(`${lcp/lcfi}`)); 
          console.log(`\t\tRESTAMOS (${coef}) * (${fs[i]})`, xGamma);

          let newQi = coefs[i].plus(coef);
          console.log(fs[i].multiply(coef));
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
          console.log("change", coefs[0].toString(), coefs[1].toString());
          p = newP;
          divFound = 1;
          console.log(newP);
        } else {
          console.log(`\tNO PODEMOS`);
          i++;
        }
      }
      if (divFound === 0) {
        const LC = p.lc();
        const MON = this.monomial(exp_p);

        const lt = MON.multiply(new Polynomial(LC.toString()));

        console.log(
          `NO HEMOS PODIDO DIVIDIR POR NADA, QUITAMOS lt(p)= (${LC}) * (${MON}) = ${lt}`
        );

        const newR = r.plus(lt);
        const newP = p.minus(lt);
          console.log(newP.coefMap);
        step.push("No division posible:");
        step.push(`lt(p) = (${LC})*(${MON}) = ${lt}`);
        step.push(`r = (${r}) + lt(p) = ${newR}`);
        step.push(`p = (${p}) - lt(p) = ${newP}`);

        r = newR;
        
        p = newP;
      }

      steps[`step${nSteps}`] = step;
    }

    console.log(`Qs: ${coefs}`);
    console.log(`R: ${r}`);

    console.log("COMPROBANDO...", coefs, r);

    step = [];

    let mult = new Polynomial("0");
    step.push(`r = ${r}`);
    coefs.forEach((qi, i) => {
      console.log("SUMANDO ", qi.multiply(fs[i]));
      step.push(`q_${i} = ${qi}`);
      mult = mult.plus(qi.multiply(fs[i]));
      console.log(mult);
    });

    mult = mult.plus(r);
    mult = mult.minus(f);

    steps["result"] = step;

   
    console.log("CHECK RESULT: " , mult.isZero());

    console.log("RES", [...coefs, r]);
    console.log(steps);

    return {
      quotients: [...coefs],
      remainder: r,
      steps: steps,
    };
  }

  // === PRIVATE INSTANCE METHODS ===
  strContainsChar(str: string, chars: string[]) {
    // console.log('COMPROBANDO ' + str);
    for (let i = 0; i < str.length; i++) {
      if (chars.includes(str[i])) return true;
    }

    return false;
  }

  // computeCoefficients(node: any, firstIt = false) {
  //   if (firstIt) this.coefMap.clear();

  //   const pol = this.nodeToString(node);
  //   const vars = ["x", "y", "z"];
  //   var pattern = /[+-]/;
  //   console.log("pol ", pol);
  //   if (node === null || node === undefined) return;

  //   if (!node.left && !node.right) {
  //     console.log(node.value);
  //     if (vars.includes(node.value)){
  //       console.log("ES VAR");
  //       this.coefMap.set(node.value, "1");
  //       console.log(this.coefMap);
  //     }
  //     else {
  //       console.log("AQUI: ", pol);
  //       console.log(typeof(pol));
  //       this.coefMap.set("1", pol.toString());
  //     }

  //     console.log("CHANGES:", this.coefMap);
  //   }

    
  //   if (!this.strContainsChar(pol, vars)) {
  //     console.log('AÑADO ' + pol);
  //     this.coefMap.set('1', pol);
  //     console.log(this.coefMap);
  //     // return;
  //   }

  //   // // console.log(pol);
  //   // if (!this.strContainsChar(pol, vars)) {
  //   //   // console.log("AÑADO " + pol);
  //   //   this.coefMap.set("1", pol);
  //   // }

  //   // console.log(pol);
    
  //   console.log(!pattern.test(pol));
  //   if (!pattern.test(pol) && pol !== "" && !(!node.left && !node.right)) {
  //     // console.log("SA");
  //     // const coef = this.nodeToString(node.left);
  //     // const variable = this.nodeToString(node.right);
  //     // console.log("ALA ", pol);
  //     // console.log(node.left);
  //     // console.log(node.right);
  //     let coef = "";
  //     let variable = "";
  //     let writingCoef = true;
  //     console.log(pol);
  //     for (let i = 0; i < pol.length; i++) {
  //       if (["x", "y", "z"].includes(pol[i])) {
  //         writingCoef = false;

  //         if (coef.length === 0) coef = "1";

  //         console.log('HOLA:' + coef[coef.length - 1]);
  //         if (coef[coef.length - 1] === "*") coef = coef.slice(0, -1);
  //       }

  //       if (!["(", ")"].includes(pol[i])) {
  //         if (writingCoef) coef += pol[i];
  //         else variable += pol[i];
  //       }
  //     }
      
        
  //     console.log(variable==="" , "!");
  //     if(variable==="")
  //       variable = "1";

  //     this.coefMap.set(variable, coef === "-" ? "-1" : coef);
  //     console.log("CHANGES:", this.coefMap);
  //     console.log(`COEF: ${coef}, VAR: ${variable}`);
  //   } else {
  //     console.log("TYPEEEE", node.type, node.value);
  //     this.computeCoefficients(node.left);
  //     this.computeCoefficients(node.right);
  //   }

  //   if (node !== null && node !== undefined) {
  //     if (node.type === "OPERATOR" && node.value === "*") {
  //       console.log('PRODUC');
  //       console.log(node.left);
  //       console.log(node.right);
  //     }
  //   }

  //   // console.log(this.coefMap);
  //   let monomials = Array.from(this.coefMap.keys());
  //   monomials.sort(function (a, b) {
  //     return Polynomial.expGreater(Polynomial.exp(a), Polynomial.exp(b))
  //       ? -1
  //       : 1;
  //   });

  //   // console.log("mon", monomials);
  //   this.varOrder = monomials;
  //   // console.log("RESSS ", this.coefMap);
  //   // console.log("aqui2 ", this.varOrder);
  // }

  computeCoefficients(pol: string, firstIt = false) {
    if (firstIt){
      this.coefMap.clear();
    }
    if (!pol) return;
    const node = nerdamer.tree(pol);

    console.log("comprobando ", pol);
    const vars = ["x", "y", "z"];
    const nMinus = (pol.match(/-/g)||[]).length;
    const nPlus = (pol.match(/\+/g)||[]).length;

    // Si tiene un + no lo es: x+y
    // Si tiene algun -, lo sera si solo tiene uno: -xy, -x-y
    const isMonomial = nPlus===0 && nMinus <= 1;

    // === NO ES MONOMIO -> SEGUIMOS SEPARANDO
    if(!isMonomial){
      console.log("NO MONOMIO", node.left, node.right);
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

        if (vars.includes(pol[i])) {
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
