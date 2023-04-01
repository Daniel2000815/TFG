import React, { useState, useEfect } from 'react';
import Grid from '@mui/material/Grid';
import Divider from '@mui/material/Divider';
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import newId from '../uniqueIdHook';
import Button from '@mui/material/Button';
import DeleteIcon from '@mui/icons-material/Delete';
import IconButton from '@mui/material/IconButton';
import { Maximize, SignalCellularNoSimOutlined } from '@mui/icons-material';
import Polynomial from '../Utils/Polynomial';
import { variables } from 'nerdamer-ts/dist/Core/Utils';

const nerdamer = require('nerdamer');
require('nerdamer/Algebra');


// [variable, exponent] both strings
// function exp (p) {
//     const v = ['x', 'y', 'z'];
//     const degs = [nerdamer(`deg(${p}, x)`).toString(), nerdamer(`deg(${p}, y)`).toString(), nerdamer(`deg(${p}, z)`).toString()];
//     const max = Math.max(...degs).toString();

//     return [ v[degs.indexOf(max)] , max];
// }

function lexify(p) {
  let simplified = '';

  try {
    simplified = nerdamer(`expand(${p})`).toString();
  } catch (error) {
    console.log(error);
    return;
  }
  console.log(simplified);
  return simplified;
}

function expGrater(a, b) {
  return (
    a[0] > b[0] ||
    (a[0] == b[0] && a[1] > b[1]) ||
    (a[0] == b[0] && a[1] == b[1] && a[2] > a[2])
  );
}

function exp(p) {
  const split = p.split(/[-+]+/); // separa por + o -
  let res = ['0', '0', '0'];

  split.forEach((element) => {
    if (element === '') return;

    let degs = [
      Number(nerdamer(`deg(${element}, x)`).toString()),
      Number(nerdamer(`deg(${element}, y)`).toString()),
      Number(nerdamer(`deg(${element}, z)`).toString()),
    ];

    if (expGrater(degs, res)) res = degs;
  });

  return res;
}

function expEq(e1, e2) {
  return e1[0] == e2[0] && e1[1] == e2[1] && e1[2] == e2[2];
}

function lc(f, variable){
  console.log(Polynomial("(4+a)*x+3xy"));
}
// function lc(f, variable) {
//   let res = '0';

//   // const split = f.split(/[-+]+/);
//   // console.log(split);

//   let split = '';

//   for(let i=0; i<f.length; i++){
//     let c = f[i];

//     if(c==='-' || c==='+'){
//       res.push(split);
//       split = c;

//     }

//     split += c;
    
//   }

//   split.forEach((element) => {
//     if (element.includes(variable)) {
//       if (isNaN(element[0])) res = '1';
//       else res = element.match(/\d+/);
//       return;
//     }
//   });
//   console.log("lc:" + res);
//   return res;

//   console.log(`CALCULANDO LC DE ${f} CON VARIABLE ${variable}`);
//   // const coeffs = nerdamer.coeffs(`${f}`, `${variable}`);
//   // let lc = '';
//   // coeffs.each(function(e, i) {
//   //     console.log(`(${variable})^${i}: ${e.toString()}`);
//   //     lc = e.toString();
//   //  });

//   //  return lc;
// }

// function lc(p){
//     const split = p.split(/[-+]+/); // separa por + o -
//     const expP = exp(p);

//     split.forEach(element => {
//         let expI = exp(nerdamer(`${element}`).toString());
//         if(expEq(expP, expI))
//             return
//     });
// }

function expMinus(a, b) {
  return [a[0] - b[0], a[1] - b[1], a[2] - b[2]];
}

// monomio lider
function lm(f) {
  return '';
}

function monomial(exp) {
  return nerdamer(`x^(${exp[0]})y^(${exp[1]})z^(${exp[2]})`).toString();
}

function division(f, dividers) {
  console.log(`INIT DIVISION ${f} / (${dividers})`);
  let nSteps = 0;
  let steps = {};
  let step = [];

  const s = dividers.length;
  let p = f;
  let r = 0;
  let q = new Array(s).fill('0');

  while (p !== '0') {
    nSteps++;
    let i = 0;
    let divFound = 0;
    console.log(`========= p = ${p} ==============`);
    const exp_p = exp(p);

    while (i < s && divFound === 0) {
      const exp_fi = exp(dividers[i]);
      const gamma = expMinus(exp_p, exp_fi);

      step = [];
      console.log(`PROBANDO DIVISION POR ${dividers[i]}`);
      console.log(`\texp(p)-exp(fi) = (${exp_p}) - (${exp_fi}) = (${gamma})`);
      if (gamma.every((item) => item >= 0)) {
        console.log(`\tPODEMOS`);
        const xGamma = monomial(gamma);
        const lcp = lc(p, monomial(exp_p));
        const lcfi = lc(dividers[i], monomial(exp_fi));

        const coef = nerdamer(`(${lcp})/(${lcfi}) * ${xGamma}`).toString();

        console.log(`\t\tRESTAMOS (${coef}) * (${dividers[i]})`);

        let newQi = nerdamer(`${q[i]} + ${coef}`).expand().toString();
        let newP = nerdamer(`${p} - (${coef}) * (${dividers[i]})`)
          .expand()
          .toString();

        step.push(`f = ${p}`);
        step.push(
          `exp(f) - exp(f_i)= (${exp_p[0]}, ${exp_p[1]}, ${exp_p[2]}) - (${exp_fi[0]}, ${exp_fi[1]}, ${exp_fi[2]}) => We can divide`
        );
        step.push(`q_i = (${q[i]}) + (${coef}) = ${newQi}`);
        step.push(`p = (${p}) - (${coef} * (${dividers[i]}) ) = ${newP}`);

        q[i] = newQi;
        p = newP;
        divFound = 1;
      } else {
        console.log(`\tNO PODEMOS`);
        i++;
      }
    }
    if (divFound === 0) {
      const LC = nerdamer(`${lc(p, monomial(exp_p))}`).toString();
      const MON = nerdamer(`${monomial(exp_p)}`).toString();

      const lt = nerdamer(`(${LC})*(${MON})`).toString();

      console.log(
        `NO HEMOS PODIDO DIVIDIR POR NADA, QUITAMOS lt(p)= (${LC}) * (${MON}) = ${lt}`
      );
      const newR = nerdamer(`${r} + ${lt}`).toString();
      const newP = nerdamer(`${p} - ${lt}`).toString();

      step.push('No division posible:');
      step.push(`lt(p) = (${LC})*(${MON}) = ${lt}`);
      step.push(`r = (${r}) + lt(p) = ${newR}`);
      step.push(`p = (${p}) - lt(p) = ${newP}`);

      r = newR;
      p = newP;
    }

    steps[`step${nSteps}`] = step;
  }

  console.log(`Qs: ${q}`);
  console.log(`R: ${r}`);

  console.log('COMPROBANDO...');

  step = [];

  let mult = '';
  step.push(`r = ${r}`);
  q.forEach((qi, i) => {
    step.push(`q_i = ${qi}`);
    mult += nerdamer(`(${qi})*(${dividers[i]})`).toString();
    if (i < q.length - 1) mult += '+';
  });

  steps['result'] = step;

  console.log(`q1f1 + ··· + qsfs = ${mult}`);
  const check = nerdamer(`(${mult})-(${f}) + ${r}`).expand().toString();
  console.log(`(${mult})-(${f}) + ${r} = ${check}`);

  console.log([...q, r]);
  console.log(steps);

  return {
    quotients: [...q],
    remainder: r,
    steps: steps,
  };
}

function PolynomialInput(props) {
  return (
    <TextField
      sx={{ width: '100%' }}
      value={props.val}
      onChange={(e) => props.handleChange(e.target.value)}
      id={props.label}
      error={props.val === ''}
      InputProps={{
        startAdornment: (
          <InputAdornment position="start">{props.label} = </InputAdornment>
        ),
      }}
    />
  );
}

function arrayCombinations(array) {
  var result = array.flatMap((v, i) => array.slice(i + 1).map((w) => [v, w]));
  return result;
}

function lcm(alfa, beta) {
  console.log(`lcm(${alfa}, ${beta})`);
  console.log(typeof(alfa));
  console.log(alfa.length);
  console.log(alfa[1]);
  if(alfa.length !== beta.length){
    console.log("ERROR");
    return -1;
  }

  let res = [];

  for(let i=0; i<alfa.length; i++){
    console.log(Math.max(alfa[i], beta[i]));
    res.push(Math.max(alfa[i], beta[i]));
  }

  console.log(res);
  return res;
}

function sPol(f, g) {
  const alpha = exp(f);
  const beta = exp(g);
  const gamma = lcm(alpha, beta);
  console.log(`lcm(f,g) = ${gamma}`);
  console.log(`lc(g) = ${lc(g, beta)}`);
  const res = nerdamer(`
  (${lc(g, monomial(beta))})*(${monomial(expMinus(gamma, alpha))})*(${f}) 
  - 
  (${lc(f, monomial(alpha))})*(${monomial(expMinus(gamma, beta))})*(${g})`)
    .expand()
    .toString();

  console.log(`S(${f}, ${g}) = ${res}`);
  return res;
}

function Bucherberg(F) {
  const maxIt = 10;
  let currIt = 0;
  let G = F;
  let added;

  do {
    currIt++;
    let newG = G;
    const fgPairs = arrayCombinations(newG);

    for (let i = 0; i < fgPairs.length; i++) {
      const r = division(sPol(fgPairs[i][0], fgPairs[i][1]), newG).remainder;
      if (r !== '0') {
        G.concat(r);
        added = true;
      }
    }
  } while (added && currIt<maxIt);

  console.log(G);
  return G;
}

export default function GrobnerPage() {
  const [dividendo, setDividendo] = useState('x^2*y + x*y^2 + y^2');
  const [divisores, setDivisores] = useState(['x*y-1', 'y^2-1']);

  const handleDivisoresChange = (idx, val) => {
    let newDivisores = [...divisores];
    newDivisores[idx] = val;
    setDivisores(newDivisores);
  };

  const handleDividendoChange = (val) => {
    setDividendo(val);
    lexify(val);
  };

  const handleDivision = () => {
    // const res = division(dividendo, divisores);

    // console.log(res.quotients);

    lc(2,2);
  };

  const handleBase = () => {
    Bucherberg(divisores);
  };

  const z = new Polynomial("-x + x*y^2");
  const t1 = new Polynomial("-x*y + z - 2");
  const t2 = new Polynomial("y - 5 + x");
  const t3 = new Polynomial("x^2*y + x*y^2 + y^2");
  const t4 = new Polynomial("x*y-1");
  const t5 = new Polynomial("y^2-1");
  const t6 = new Polynomial("-1 - x+x*y^2+y^2");

  const t7 = new Polynomial("x^2 + 2*y^2 - 3");
  const t8 = new Polynomial("x^2 + x*y + y^2 - 3");

  // const t9 = new Polynomial("-t+x");
  // const t10 = new Polynomial("-t^2+y");
  // const t11 = new Polynomial("-t^3+z");

  // console.log("XERO",z,t1,t2,t3,t4,t5,t6);

  // const two = new Polynomial("2*x");
  // // console.log("2x", two, two.toString());
  console.log(t1);
  const f = new Polynomial('x^2*y + x*y^2 + y^2');
  
  const f1 = new Polynomial('x*y - 1');
  // console.log("AQUISSS ", f1.toString());
  // console.log("F1 ", f1);
  const f2 = new Polynomial('y^2-1');
  const f3 = new Polynomial("x^(10) + y^2 -z^(30)*y - t");
  const e = new Polynomial('x^(10) + y^2 -z^(30)*y - t -1');
  const e2 = new Polynomial('y^2 -z^(30)*y - t + x^(10)  -1');

  // console.log("EQ1: ", t1.equals(t2));
  // console.log("EQ1: ", t1.equals(t3));
  // console.log("EQ1: ", t1.equals(t4));
  // console.log("EQ1: ", t1.equals(t5));
  // console.log("EQ1: ", t1.equals(t1));
  // console.log("EQ1: ", e.equals(e2));

  // console.log("BARS:", e.variables());
  const h1 = new Polynomial("x^2*y-1");
  const h2 = new Polynomial("x*y^2-x");

  const h3 = new Polynomial("-x*y^3 -z +x*y +x^2*y*z");

  Polynomial.setVars(["x","y","z","w"]);
  const g1 = new Polynomial("3x-6y-2z");
  const g2 = new Polynomial("2x-4y+4w");
  const g3 = new Polynomial("x-2y-z-w");


  // console.log(Polynomial.divide(h3, [h1,h2],10));

  // console.log(f3);
  // console.log(`TEST: ${t7}, ${t8}, ${f}, ${f1}, ${f3} `);
  // Polynomial.divide(t6, [t5,t1,z,t2], 100);
  // console.log(Polynomial.bucherberg([h1,h2]));
  console.log(Polynomial.bucherbergReduced([g1,g2,g3]));
  console.log(Polynomial.bucherbergReduced([t1,t2,t4]));
  console.log(Polynomial.bucherbergReduced([t1,t5,t2]));
  console.log(Polynomial.bucherbergReduced([t1,t4,t5]));
  console.log(Polynomial.bucherbergReduced([t1,t3,t4]));
  console.log(Polynomial.bucherbergReduced([t1,t2,t6]));

  // console.log([new Polynomial("0"), new Polynomial("0")]);

  // console.log(Polynomial.expIsMultiple([2,2,4], [1,1,2]));
  // console.log(Polynomial.expIsMultiple([3,2,9], [1,1,3]));
  // console.log(Polynomial.expIsMultiple([0,0,0], [0,0,1]));
  // console.log(Polynomial.expIsMultiple([1,1,1], [1,1,1]));

  // console.log(Number("4/3"));
  // const t1 = new Polynomial("2*x*y - x*z + y*z");
  // const t2 = new Polynomial("x*y*z + x*y - 7");
  // const t3 = new Polynomial("y*z  - 1 - 7*z");

  // console.log("===== CHECK OUTSIDE METHOD =====");
  // let r = new Polynomial("0");
  // let coefs = [new Polynomial("0"), new Polynomial("0")];

  // console.log(r);
  // console.log(coefs);
  // console.log("===== CHECK OUTSIDE METHOD =====");

  // console.log("TEST PARSING",t1,t2, t3);

  // p.plus(q);
  // console.log(`POL P+Q = ${p}`);
  // p.multiply(q);
  // console.log(`POL P*Q = ${p}`);
  // console.log(`LC: ${p.lc()}`);
  // console.log(`LM: ${p.lm()}`);
  // console.log(`LT: ${p.lt()}`);
  // console.log(`EXP: ${p.exp()}`);
  // console.log(`OTRO EXP: ${Polynomial.exp('2x^2*z')}`);
 

  return (
    <Grid
      container
      justifyContent="flex-start"
      alignItems="flex-start"
      spacing={10}
      padding={2}
    >
      
      <Grid item xs={12}>
        {/* Hola:{exp('2x^2 + y^3').toString()}
        coefs: {nerdamer.coeffs('x^2 -99x^2+6x-9x^6+y^3+ xy', 'x').toString()   }
        lc: {lc('9x^9+6y^8', 'y')} */}
        AL ESCRIBIR POLINOMIOS INDICAR TODAS LAS MULTIPLICACIONES: NO xy, SINO
        x*y
      </Grid>
      <Grid item xs={6}>
        <PolynomialInput
          label={`f`}
          val={dividendo}
          handleChange={(v) => handleDividendoChange(v)}
        />
        <Divider>DIVIDERS</Divider>
        {divisores.map(function (divisor, idx) {
          return (
            <div key={`dividerInput_${idx}`}>
              <Grid item xs={10}>
                <PolynomialInput
                  label={`f${idx + 1}`}
                  val={divisor}
                  handleChange={(v) => handleDivisoresChange(idx, v)}
                />
              </Grid>
              <Grid item xs={2}>
                <IconButton
                  onClick={() => {
                    setDivisores(divisores.splice(idx, 1));
                    console.log(divisores);
                  }}
                  aria-label="delete"
                >
                  <DeleteIcon />
                </IconButton>
              </Grid>
            </div>
          );
        })}

        <Grid item>
          <Button
            variant="contained"
            onClick={() => setDivisores(divisores.concat(''))}
          >
            Add divider
          </Button>
          <Button
            variant="contained"
            onClick={() => handleDivision()}
            disabled={!divisores.every((item) => item !== '' && item !== '0')}
          >
            Divide
          </Button>
          <Button
            variant="contained"
            onClick={() => handleBase()}
            disabled={!divisores.every((item) => item !== '' && item !== '0')}
          >
            Groebner Base
          </Button>
        </Grid>
      </Grid>

      <Grid item xs={6}>
        TODO
      </Grid>
    </Grid>
  );
}
