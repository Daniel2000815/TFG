import React, { useState, useEfect } from 'react';
import Grid from '@mui/material/Grid';
import Divider from '@mui/material/Divider';
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import newId from '../uniqueIdHook';
import Button from '@mui/material/Button';
import DeleteIcon from '@mui/icons-material/Delete';
import IconButton from '@mui/material/IconButton';

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

function lc(f, variable) {
  let res = '0';

  const split = f.split(/[-+]+/);
  split.forEach((element) => {
    if (element.includes(variable)) {
      if (isNaN(element[0])) res = '1';
      else res = element.match(/\d+/);
      return;
    }
  });

  return res;

  console.log(`CALCULANDO LC DE ${f} CON VARIABLE ${variable}`);
  // const coeffs = nerdamer.coeffs(`${f}`, `${variable}`);
  // let lc = '';
  // coeffs.each(function(e, i) {
  //     console.log(`(${variable})^${i}: ${e.toString()}`);
  //     lc = e.toString();
  //  });

  //  return lc;
}

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
  console.log('INIT');

  const s = dividers.length;
  let p = f;
  let r = 0;
  let q = new Array(s).fill('0');

  while (p !== '0') {
    let i = 0;
    let step = 0;
    console.log(`========= p = ${p} ==============`);
    const exp_p = exp(p);

    while (i < s && step === 0) {
      const exp_fi = exp(dividers[i]);
      const gamma = expMinus(exp_p, exp_fi);

      console.log(`PROBANDO DIVISION POR ${dividers[i]}`);
      console.log(`\texp(p)-exp(fi) = (${exp_p}) - (${exp_fi}) = (${gamma})`);
      if (gamma.every((item) => item >= 0)) {
        console.log(`\tPODEMOS`);
        const xGamma = monomial(gamma);
        const lcp = lc(p, monomial(exp_p));
        const lcfi = lc(dividers[i], monomial(exp_fi));

        const coef = nerdamer(`(${lcp})/(${lcfi}) * ${xGamma}`).toString();

        console.log(`\t\tRESTAMOS (${coef}) * (${dividers[i]})`);

        q[i] = nerdamer(`${q[i]} + ${coef}`).expand().toString();
        p = nerdamer(`${p} - (${coef}) * (${dividers[i]})`).expand().toString();
        step = 1;
      } else {
        console.log(`\tNO PODEMOS`);
        i++;
      }
    }
    if (step === 0) {
      const LC = nerdamer(`${lc(p, monomial(exp_p))}`).toString();
      const MON = nerdamer(`${monomial(exp_p)}`).toString();

      const lt = nerdamer(`(${LC})*(${MON})`).toString();

      console.log(
        `NO HEMOS PODIDO DIVIDIR POR NADA, QUITAMOS lt(p)= (${LC}) * (${MON}) = ${lt}`
      );
      r = nerdamer(`${r} + ${lt}`).toString();
      p = nerdamer(`${p} - ${lt}`).toString();
    }
  }

  console.log(`Qs: ${q}`);
  console.log(`R: ${r}`);

  console.log('COMPROBANDO...');

  let mult = '';
  q.forEach((qi, i) => {
    mult += nerdamer(`(${qi})*(${dividers[i]})`).toString();
    if (i < q.length - 1) mult += '+';
  });

  console.log(`q1f1 + ··· + qsfs = ${mult}`);
  const check = nerdamer(`(${mult})-(${f}) + ${r}`).expand().toString();
  console.log(`(${mult})-(${f}) + ${r} = ${check}`);

  console.log([...q, r]);
  return [...q, r];
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
                {/* <IconButton
                  onClick={() => {setDivisores(divisores.splice(idx, 1)); console.log(divisores);}}
                  aria-label="delete"
                >
                  <DeleteIcon />
                </IconButton> */}
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
            onClick={() => division(dividendo, divisores)}
            disabled={!divisores.every((item) => item !== '' && item !== '0')}
          >
            Divide
          </Button>
        </Grid>
      </Grid>
      <Grid item xs={6}>
        TODO
      </Grid>
    </Grid>
  );
}
