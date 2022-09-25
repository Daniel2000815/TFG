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
import evaluatex from '../../node_modules/evaluatex/dist/evaluatex';
import MathJax from 'react-mathjax';
import ButtonCard from '../CustomComponents/ButtonCard';
import CustomTable from '../CustomComponents/CustomTable';
import { evaluate, create, all } from 'mathjs';
import nerdamer from 'nerdamer';
import { isImportEqualsDeclaration } from 'typescript';
import 'katex/dist/katex.min.css';
import Latex from 'react-latex-next';
import useLocalStorage from '../storageHook.js';

const latexEq = (eq) => {
  return <Latex>{`\$ ${eq} \$`}</Latex>;
};
const tableCols = [
  { id: 'name', label: 'Name', minWidth: 170 },
  { id: 'implicit', label: 'Implicit', minWidth: 350 },
  { id: 'sdf', label: 'SDF', minWidth: 10 },
];

const tableRows2 = [
  { name: 'ej1', implicit: latexEq(localStorage.getItem('ej')) },
];

function SurfaceDialog(props) {
  var nerdamer = require('nerdamer');
  require('nerdamer/Calculus');

  const [eqData, setEqData] = useState({});
  const [eq, setEq] = useState('');
  const [validEq, setValEq] = useState(false);
  const [validName, setValidName] = useState(false);
  const [parsedEq, setParsedEq] = useState('');
  const [name, setName] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [storage, setStorage] = useLocalStorage('user_implicits', {});

  /*
  const handleNewEquation = (newEq) => {
    const math = create(all);

    let f = null;

    try {
      f = math.parse(newEq);
    } catch (error) {
      setValEq(false);
      console.warn("ERROR PARSING EQUATION");
      console.log(f);
      return;
    }

    setValEq(true);

    const x = math.parse('x');
    const y = math.parse('y');
    const z = math.parse('z');

    const dfdx = math.derivative(f, x);
    const dfdy = math.derivative(f, y);
    const dfdz = math.derivative(f, z);

    //const norm = math.sqrt(dfdx*dfdx + dfdy*dfdy + dfdz*dfdz);
    console.log(math.prod(dfdx,dfdx));
    // console.log("NORMA: " + norm);

    let newData = {
      f: f,
      dx: dfdx,
      dy: dfdy,
      dz: dfdz}

    setEqData(eqData => ({
      ...eqData,
      ...newData
    }));
  

    console.log("dFdX: " + dfdx);
    console.log("dFdY: " + dfdy);
    console.log("dFdZ: " + dfdz);
    //console.log(math.norm([dfdx, dfdy, dfdz]));
    console.log(eqData);
  }
  */

  const traverseTree = (node) => {
    if (node) {
      if (node.type === 'VARIABLE_OR_LITERAL') {
        console.log('VARIABLE: ' + node.value);
        const isVariable =
          node.value === 'x' || node.value === 'y' || node.value === 'z';
        return isVariable ? node.value : parseFloat(node.value).toFixed(4);
      }
      if (node.type === 'OPERATOR') {
        console.log('OPERATOR: ' + node.value);
        let left = traverseTree(node.left);
        let right = traverseTree(node.right);

        if (node.value === '^') {
          console.log(`pow(${left}, ${right})`);
          return `pow(${left}, ${right})`;
        } else {
          if (right && left) return `(${left})${node.value}(${right})`;
          else if (left) return `${node.value}(${left})`;
          else return '????';
        }

        console.log(node.toString());
        return node.toString();
      }
      if (node.type === 'FUNCTION') {
        console.log('FUNCTION: ' + node.value);
        let left = traverseTree(node.left);
        let right = traverseTree(node.right);

        if (node.value === '^') {
          console.log(`pow(${left}, ${right})`);
          return `pow(${left}, ${right})`;
        } else {
          if (right) return `${node.value}(${right})`;
          else return '????';
        }
      }
    }
  };

  const handleNewEquation = (newEq) => {
    let f = null;

    try {
      f = nerdamer(newEq);
    } catch (error) {
      setErrorMsg(error.message);
      setValEq(false);
      setEq('');
      console.log(error);
      console.warn('ERROR PARSING EQUATION');

      return;
    }

    setValEq(true);
    setEq(newEq);
    setErrorMsg('');

    let dfdx = nerdamer.diff(f, 'x', 1);
    let dfdy = nerdamer.diff(f, 'y', 1);
    let dfdz = nerdamer.diff(f, 'z', 1);
    let norm = nerdamer(`sqrt((${dfdx})^2 + (${dfdy})^2 + (${dfdz})^2)`);

    console.log('DEB 2');
    console.log(norm.toString());

    if (norm.toString() === '0') {
      setValEq(false);
      setErrorMsg("Norm can't be 0");
      return;
    }

    let sdf = nerdamer(`(${f})/(${norm})`);
    console.log('DEB 3');
    console.log('F: ' + f.toString());
    console.log('dFdX: ' + dfdx.toString());
    console.log('dFdY: ' + dfdy.toString());
    console.log('dFdZ: ' + dfdz.toString());
    console.log('norm: ' + norm.toString());
    console.log('sdf: ' + sdf.toString());

    var x = nerdamer.tree(sdf.toString());
    console.log(x);
    setParsedEq(traverseTree(x));

    setEqData({
      f: f,
      dx: dfdx,
      dy: dfdy,
      dz: dfdz,
      norm: norm,
      sdf: sdf,
    });

    console.log(eqData);
  };

  const handleSave = () => {
    console.log(storage);
    console.log(typeof storage);

    if (name in storage) {
      console.log('ya esta');
    } else {
      let newData = { ...storage };
      console.log('old:');
      console.log(newData);
      newData[name] = {
        name: name,
        implicit: eqData.f.toString(),
        sdf: eqData.sdf.toString(),
      };
      console.log('new:');
      console.log(newData);
      setStorage(newData);
      console.log('no esta');
      console.log(storage);
      props.handleClose();
    }
  };

  useEffect(() => {
    console.log('STOROTO');
  }, [storage]);

  useEffect(() => {
    console.log('CHANGE');
    console.log(eqData);
  }, [eqData]);

  useEffect(() => {
    console.log(storage);
    setValidName(!(name in storage));
  }, [name]);

  return (
    <Dialog open={props.open} onClose={props.handleClose}>
      <DialogTitle>New Surface</DialogTitle>

      <DialogContent>
        EQ: {eqData.f ? eqData.f.toString() : ''}
        <MathJax.Provider>
          <div>
            <p>Block formula:</p>
            <MathJax.Node
              formula={
                eqData.f
                  ? `\\begin{align*} 
            f(x,y,z) &=  ${nerdamer.convertToLaTeX(
              eqData.f.toString()
            )} \\\\[10pt]
            \\nabla f(x,y,z) &= \\left( 
              ${nerdamer.convertToLaTeX(eqData.dx.toString())}, 
              ${nerdamer.convertToLaTeX(eqData.dy.toString())}, 
              ${nerdamer.convertToLaTeX(eqData.dz.toString())}
            \\right) \\\\[10pt]
            \\Vert \\nabla f(x,y,z) \\Vert &= ${nerdamer.convertToLaTeX(
              eqData.norm.toString()
            )} \\\\[10pt]
            \\text{sdf}(x,y,z) &= ${nerdamer.convertToLaTeX(
              eqData.sdf.toString()
            )}
          \\end{align*}`
                  : ''
              }
            />
            salida string: {parsedEq}
          </div>
        </MathJax.Provider>
        <DialogContentText>Introduce surface information:</DialogContentText>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TextField
              error={!validName || name == ''}
              helperText={
                name === '' ? '' : validName ? '' : 'Name already in use'
              }
              onChange={(e) => setName(e.target.value)}
              id="name"
              label="Name"
            />
          </Grid>

          <Grid item xs={12}>
            <TextField
              sx={{ width: '100%' }}
              defaultValue=""
              label="Implicit"
              onChange={(e) => handleNewEquation(e.target.value)}
              id="Implicit"
              error={!validEq || eq === ''}
              helperText={errorMsg}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end"> = 0</InputAdornment>
                ),
              }}
            />
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={props.handleClose}>Cancel</Button>
        <Button
          onClick={handleSave}
          disabled={!validName || !validEq || name === '' || eq === ''}
        >
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default function SurfacePage() {
  const [storage, setStorage] = useLocalStorage('user_implicits', {});
  const [dialogOpen, setDialogOpen] = useState(false);
  const [tableRows, setTableRows] = useState([]);

  const makeRow = (item) => {
    return { name: 'ej1', implicit: latexEq(localStorage.getItem('ej')) };
  };

  useEffect(() => {
    let newRows = [];
    console.log('hasasa');
    console.log(storage);
    console.log('as');

    Object.keys(storage).forEach(function (key, index) {
      const item = storage[key];
      console.log(item);
      newRows.push({
        name: item.name,
        implicit: latexEq(nerdamer.convertToLaTeX(item.implicit)),
        sdf: item.sdf,
      });
    });

    console.log(newRows);
    console.log(tableRows2);

    setTableRows(newRows);
  }, [storage]);

  const handleDelete = (selectedList) => {
    // Convert `obj` to a key/value array
    // `[['name', 'Luke Skywalker'], ['title', 'Jedi Knight'], ...]`
    const asArray = Object.entries(storage);
    console.log(selectedList);
    const filtered = asArray.filter(
      ([key, value]) => !selectedList.includes(key)
    );

    console.log(filtered);

    // Convert the key/value array back to an object:
    // `{ name: 'Luke Skywalker', title: 'Jedi Knight' }`
    const newStorage = Object.fromEntries(filtered);
    console.log(newStorage);
    setStorage(newStorage);
  };
  return (
    <Box>
      <CustomTable
        rows={tableRows}
        columns={tableCols}
        handleDelete={handleDelete}
        handleCreateRow={() => setDialogOpen(true)}
      />
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
          <ButtonCard />
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
