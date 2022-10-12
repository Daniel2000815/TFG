import React, { useState, useEfect } from "react";
import Grid from '@mui/material/Grid';
import Divider from '@mui/material/Divider';
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import newId from '../uniqueIdHook';

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

    return <Grid
        container
        direction="row"
        justifyContent="flex-start"
        alignItems="flex-start"
        spacing={10}
        padding={2}
    >

        <Grid item xs={6}>
            <PolynomialInput label={`f`} val={dividendo} handleChange={(v) => setDividendo(v)} />
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
