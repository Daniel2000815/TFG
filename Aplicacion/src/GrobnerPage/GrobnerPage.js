import React, { useState, useEfect } from "react";
import Grid from '@mui/material/Grid';
import Divider from '@mui/material/Divider';
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import newId from '../uniqueIdHook';

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

function exp(p){
    return [
        Number(nerdamer(`deg(${p}, x)`).toString()), 
        Number(nerdamer(`deg(${p}, y)`).toString()),
        Number(nerdamer(`deg(${p}, z)`).toString())
    ];
}

function lc(f, variable){
    const coeffs = nerdamer.coeffs(`${f}`, `${variable}`);
    let lc = '';
    coeffs.each(function(e, i) {
        lc = e.toString();
     });

     return lc;
}

// monomio lider
function lm(f){
    return ''
}

function division(f, dividers){
    const s = dividers.length;
    let p = f;
    let r = 0;
    let q = new Array(s).fill(0);
    
    while(p!=='0'){
        let i = 1;
        let step = 0;

        while(i<s && step===0){
            const exp_p = exp(p);
            const exp_fi = exp(dividers[i]);
            const gamma = exp_p[1] - exp_fi[1];

            if(gamma > 0){ 
                const lcp = lc(p, exp_p[0]);
                const lcfi = lc(dividers[i], exp_fi[0]);

                const coef = nerdamer(`(${lcp})/(${lcfi}) * ${exp_fi[0]}^${gamma}`).toString();
                q[i] = nerdamer(`${q[i]} + ${coef}`).toString();
                p += nerdamer(`${p} - ${coef} * ${dividers[i]}`).toString();
            }
            else{
                i++;
            }
        }
        if(step === 0){
            r = nerdamer(`${r} + `).toString();
            p = nerdamer(`${p} - `).toString();
        }
    }
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
    const [dividendo, setDividendo] = useState("");
    const [divisores, setDivisores] = useState(["2x", "3x"]);

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

        </Grid>
        <Grid item xs={6}>TODO</Grid>
    </Grid >;
}
