import React, { useState, useEfect } from "react";
import Grid from '@mui/material/Grid';
import Divider from '@mui/material/Divider';
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import newId from '../uniqueIdHook';
import Button from '@mui/material/Button';

const nerdamer = require('nerdamer');
require('nerdamer/Algebra');

// [variable, exponent] both strings
// function exp (p) {
//     const v = ['x', 'y', 'z'];
//     const degs = [nerdamer(`deg(${p}, x)`).toString(), nerdamer(`deg(${p}, y)`).toString(), nerdamer(`deg(${p}, z)`).toString()];
//     const max = Math.max(...degs).toString();

//     return [ v[degs.indexOf(max)] , max];
// }

function lexify(p){
    let simplified = '';
    
    try{
        simplified = nerdamer(`expand(${p})`).toString();
    }catch(error){
        console.log(error);
        return;
    }
    console.log(simplified);
    return simplified;
}

function expGrater(a,b){
    return a[0]>b[0] || (a[0]==b[0] && a[1]>b[1]) || (a[0]==b[0] && a[1]==b[1] && a[2]>a[2]);
}

function exp(p){
    const split = p.split(/[-+]+/); // separa por + o -
    let res = ['0', '0', '0'];
    console.log(split);
    split.forEach(element => {
        let degs = [
            Number(nerdamer(`deg(${element}, x)`).toString()), 
            Number(nerdamer(`deg(${element}, y)`).toString()),
            Number(nerdamer(`deg(${element}, z)`).toString())
        ];
        console.log(degs);
        if(expGrater(degs,res))
            res = degs;
    });

    console.log(`exp(${p}) = ${res}`);
    return res;
}

function expEq(e1,e2){
    return e1[0]==e2[0] && e1[1]==e2[1] && e1[2]==e2[2];
}

function lc(f, variable){
    console.log(`CALCULANDO LC DE ${f} CON VARIABLE ${variable}`);
    let res = "0";

    const split = f.split(/[-+]+/);
    split.forEach(element => {
        console.log(`COMPROBANDO ${element}`);
        console.log(`${element} includes ${variable}: ${element.includes(variable)}`);
        if(element.includes(variable)){
            if(isNaN(element[0]))
                res = '1';
            else
                res = element.match(/\d+/);
            return;
       }
    });

    console.log(`DEVOLVEMOS ${res}`);
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

function expMinus(a,b){
    return [a[0]-b[0], a[1]-b[1], a[2]-b[2]];
}

// monomio lider
function lm(f){
    return ''
}

function monomial(exp){
    return nerdamer(`x^(${exp[0]})y^(${exp[1]})z^(${exp[2]})`).toString();
}

function division(f, dividers){
    console.log("INIT")
    const s = dividers.length;
    let p = f;
    let r = 0;
    let q = new Array(s).fill(0);
    
    while(p!=='0'){
        let i = 0;
        let step = 0;

        while(i<s && step===0){
            console.log(`ITERATION ${i}: ${p}`);
            const exp_p = exp(p);
            const exp_fi = exp(dividers[i]);
            const gamma = expMinus(exp_p, exp_fi);
                console.log(gamma);
            if( gamma.every(item => item >= 0) ){
                console.log(`PODEMOS DIVIDIR POR ${dividers[i]}`); 
                const xGamma = monomial(gamma);
                const lcp = lc(p, monomial(exp_p));
                const lcfi = lc(dividers[i], monomial(exp_fi));
                
                console.log(`X: ${xGamma}, LCP: ${lcp}, LCPFI: ${lcfi}`);

                const coef = nerdamer(`(${lcp})/(${lcfi}) * ${xGamma}`).toString();
                q[i] = nerdamer(`${q[i]} + ${coef}`).toString();
                p = nerdamer(`${p} - ${coef} * ${dividers[i]}`).toString();
                step = 1;
            }
            else{
                console.log(`NO PODEMOS DIVIDIR POR ${dividers[i]}`) 
                i++;
            }
        }
        if(step === 0){
            
            const lt = nerdamer(`${lc(p)}*${monomial(exp(p))}`).toString();

            console.log(`NO HEMOS PODIDO DIVIDIR POR NADA, QUITAMOS LT: ${lt}`); 
            r = nerdamer(`${r} + ${lt}`).toString();
            p = nerdamer(`${p} - ${lt}`).toString();
        }
    }

    console.log(q,r);
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
    )
}

export default function GrobnerPage() {
    const [dividendo, setDividendo] = useState("x^2*y + x*y^2 + y^2");
    const [divisores, setDivisores] = useState(["x*y-1", "y^2-1"]);

    const handleDivisoresChange = (idx, val) => {
        let newDivisores = [...divisores];
        newDivisores[idx] = val;
        setDivisores(newDivisores);
    }

    const handleDividendoChange = (val) => {
        setDividendo(val);
        lexify(val);
    }

    return <Grid
        container
        direction="row"
        justifyContent="flex-start"
        alignItems="flex-start"
        spacing={10}
        padding={2}
    >
        <Grid item xs={12}>
        Hola:{exp('2x^2 + y^3').toString()}
        coefs: {nerdamer.coeffs('x^2 -99x^2+6x-9x^6+y^3+ xy', 'x').toString()   }
        lc: {lc('9x^9+6y^8', 'y')}

        AL ESCRIBIR POLINOMIOS INDICAR TODAS LAS MULTIPLICACIONES: NO xy, SINO x*y
        </Grid>
        <Grid item xs={6}>
            <PolynomialInput label={`f`} val={dividendo} handleChange={(v) => handleDividendoChange(v)} />
            <Divider>DIVIDERS</Divider>
            {divisores.map(function (divisor, idx) {
                return (
                    <div key={`dividerInput_${idx}`}>
                        <Grid item xs={12}>
                            <PolynomialInput label={`f${idx + 1}`} val={divisor} handleChange={(v) => handleDivisoresChange(idx, v)} />
                        </Grid>
                    </div>
                );
            })}

            <Grid item>
                <Button 
                    variant="contained" 
                    onClick={()=>division(dividendo,divisores)}
                >
                    Divide
                </Button>

            </Grid>

        </Grid>
        <Grid item xs={6}>TODO</Grid>
    </Grid >;
}
