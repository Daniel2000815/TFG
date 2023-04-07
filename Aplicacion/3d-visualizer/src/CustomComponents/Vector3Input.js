import React, {useEffect, useState} from 'react';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid';
import { styled } from '@mui/material/styles';
import TextField from '@mui/material/TextField';


const Header = styled(Paper)(({ theme, color }) => ({
    backgroundColor: color,
    ...theme.typography.body2,
    textAlign: 'center',
    color: theme.palette.primary.contrastText,
    borderRadius: "3px 3px 0 0"
}));

export const TextFieldWrapper = styled(TextField)`
  fieldset {
    border-radius: 0 0 2px 2px;
  }
`;

function Field(props) {
    return (
        <TextFieldWrapper
            value={props.val}
            type="number"
            onChange={(ev) => props.handleChange(parseFloat(ev.target.value))}
            size="small"
            style={{borderRadius: "0"}}
        />
    )
}
export default function Vector3Input(props) {
    const [x, setX] = useState(0);
    const [y, setY] = useState(0);
    const [z, setZ] = useState(0);

    useEffect(() => {
        props.handleChange([x,y,z]);
    }, [x,y,z]);

    return (
        <>
            <Box sx={{ flexGrow: 1 }}>
                sasa
                <Grid container spacing={0} columns={{ xs: 4, sm: 8, md: 12 }}>
                    <Grid item xs={2} sm={4} md={4} key={1}><Header color='red'>x</Header></Grid>
                    <Grid item xs={2} sm={4} md={4} key={2}><Header color="green">y</Header></Grid>
                    <Grid item xs={2} sm={4} md={4} key={3}><Header color="blue">z</Header></Grid>

                    <Grid item xs={2} sm={4} md={4} key={4}>
                        <Field val={x} handleChange={setX}/>
                    </Grid>
                    <Grid item xs={2} sm={4} md={4} key={5}>
                        <Field val={y} handleChange={setY}/>
                    </Grid>
                    <Grid item xs={2} sm={4} md={4} key={6}>
                        <Field val={z} handleChange={setZ}/>
                    </Grid>

                </Grid>
            </Box>
        </>
    );
}
