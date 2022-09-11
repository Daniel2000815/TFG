import React, { useState, useEffect } from 'react';
import SurfaceCard from './SurfaceCard';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Fab from '@mui/material/Fab';
import AddIcon from '@mui/icons-material/Add';
import Typography from '@mui/material/Typography';
import InputAdornment from '@mui/material/InputAdornment';

import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Button from '@mui/material/Button';
import EquationEditor from 'equation-editor-react';
import evaluatex from '../node_modules/evaluatex/dist/evaluatex';
import MathJax from 'react-mathjax';

import { evaluate, create, all } from 'mathjs';

function SurfaceDialog(props) {
  const [equation, setEquation] = useState('2+x');
  const [eqData, setEqData] = useState({});

  const handleSave = () => {
    let fn = evaluatex(equation);
    let result = fn({ x: 3, y: 0, z: 0 });
    console.log('EVALUACION EN X=3: ' + result);

    const math = create(all);

    // defined methods can be used in both JavaScript as well as the parser
    math.import({
      myConstant: 42,
      sdf: function (x, y, z) {
        return fn({ x: x, y: y, z: z });
      },
    });

    console.log(math.evaluate('sdf(3,2,0)')); // 84
    console.log(math.derivative(math.sdf, 'x').evaluate({ x: 4 }));
  };

  const handleNewEquation = (newEq) => {
    const math = create(all);

    setEquation(newEq);
    let f = null;

    try {
      f = math.parse(newEq);
    } catch (error) {
      return;
    }
    
    const x = math.parse('x');
    const y = math.parse('y');
    const z = math.parse('z');

    const dfdx = math.derivative(f, x);
    const dfdy = math.derivative(f, y);
    const dfdz = math.derivative(f, z);   

    setEqData({
      eq: newEq,
      dx: dfdx,
      dy: dfdy,
      dz: dfdz
    })

    console.log("dFdX: " + dfdx);
    console.log("dFdY: " + dfdy);
    console.log("dFdZ: " + dfdz);
    console.log(eqData);
  }

  return (
    <Dialog open={props.open} onClose={props.handleClose}>
      <DialogTitle>New Surface</DialogTitle>
      
      <DialogContent>
        <MathJax.Node formula={'2x'} />
        <DialogContentText>
          Introduce surface information:
          {/* <EquationEditor
            value={equation}
            onChange={setEquation}
            autoCommands="pi theta sqrt sum prod alpha beta gamma rho"
            autoOperatorNames="sin cos tan"
          /> */}
          {equation}
        </DialogContentText>

        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TextField id="name" label="Name" />
          </Grid>

          <Grid item xs={12}>
            <TextField
              sx={{ width: '100%' }}
              defaultValue="x^2 + y^2 + z^2 - 1"
              label="Implicit"
              id="Implicit"
              onChange={(e) => handleNewEquation(e.target.value)}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end"> = 0</InputAdornment>
                ),
              }}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              disabled
              sx={{ width: '100%' }}
              id="derivative"
              label="Derivative"
              defaultValue="0"
            />
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={props.handleClose}>Cancel</Button>
        <Button onClick={handleSave}>Save</Button>
      </DialogActions>
    </Dialog>
  );
}
export default function SurfacePage() {
  const [dialogOpen, setDialogOpen] = useState(false);

  return (
    <Box>
      <MathJax.Node inline formula={'2x'} />
      <Fab
        style={{ position: 'absolute', bottom: 16, right: 16 }}
        color="primary"
        aria-label="add"
        onClick={() => setDialogOpen(true)}
      >
        <AddIcon />
      </Fab>
      <SurfaceDialog
        open={dialogOpen}
        handleClose={() => setDialogOpen(false)}
      />
      <Grid
        container
        direction="row"
        justifyContent="flex-start"
        alignItems="flex-start"
        spacing={2}
      >
        <Grid item>
          <SurfaceCard />
        </Grid>
        <Grid item>
          <SurfaceCard />
        </Grid>
        <Grid item>
          <SurfaceCard />
        </Grid>
        <Grid item>
          <SurfaceCard />
        </Grid>
        <Grid item>
          <SurfaceCard />
        </Grid>
        <Grid item>
          <SurfaceCard />
        </Grid>
        <Grid item>
          <SurfaceCard />
        </Grid>
      </Grid>
    </Box>
  );
}
