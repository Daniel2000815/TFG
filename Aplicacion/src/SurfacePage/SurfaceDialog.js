import React, { useState, useEffect } from 'react';
import Grid from '@mui/material/Grid';
import InputAdornment from '@mui/material/InputAdornment';

import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Button from '@mui/material/Button';
import MathJax from 'react-mathjax';
import 'katex/dist/katex.min.css';
import useLocalStorage from '../storageHook.js';
import usePrimitivesHook from '../primitivesHook';
import Shader from '../CustomComponents/Shader';
import CustomInputTable from '../CustomComponents/CustomInputTable';

export default function SurfaceDialog(props) {
  var nerdamer = require('nerdamer');
  require('nerdamer/Calculus');

  const [eqData, setEqData] = useState(props.eqData ? props.eqData : null);

  const [eqInput, setEqInput] = useState('');
  const [nameInput, setNameInput] = useState('');
  const [parametersInput, setParametersInput] = useState([]);

  const [parsedEq, setParsedEq] = useState('');

  const [storage, setStorage] = useLocalStorage('user_implicits', {});
  const [primitives, setPrimitives] = usePrimitivesHook();

  const [errorMsg, setErrorMsg] = useState('');
  const [validEq, setValEq] = useState(false);
  const [validName, setValidName] = useState(false);

  const latexInfo = () => {
    const implicit =
      eqData && validEq ? nerdamer.convertToLaTeX(eqData.f.toString()) : '';
    const dx =
      eqData && validEq ? nerdamer.convertToLaTeX(eqData.dx.toString()) : '';
    const dy =
      eqData && validEq ? nerdamer.convertToLaTeX(eqData.dy.toString()) : '';
    const dz =
      eqData && validEq ? nerdamer.convertToLaTeX(eqData.dz.toString()) : '';
    const norm =
      eqData && validEq ? nerdamer.convertToLaTeX(eqData.norm.toString()) : '';
    const sdf =
      eqData && validEq ? nerdamer.convertToLaTeX(eqData.sdf.toString()) : '';

    return `\\begin{align*} 
          f(x,y,z) &=  ${implicit} \\\\[10pt]
          \\nabla f(x,y,z) &= \\left( 
            ${dx}, 
            ${dy}, 
            ${dz}
          \\right) \\\\[10pt]
          \\Vert \\nabla f(x,y,z) \\Vert &= ${norm} \\\\[10pt]
          \\text{sdf}(x,y,z) &= ${sdf}
        \\end{align*}`;
  };

  const traverseTree = (node) => {
    if (node) {
      if (node.type === 'VARIABLE_OR_LITERAL') {
        const isVariable =
          node.value === 'x' || node.value === 'y' || node.value === 'z';
        return isVariable ? node.value : parseFloat(node.value).toFixed(4);
      }
      if (node.type === 'OPERATOR') {
        let left = traverseTree(node.left);
        let right = traverseTree(node.right);

        if (node.value === '^') {
          return `pow(${left}, ${right})`;
        } else {
          if (right && left) return `(${left})${node.value}(${right})`;
          else if (left) return `${node.value}(${left})`;
          else return '????';
        }

        return node.toString();
      }
      if (node.type === 'FUNCTION') {
        let left = traverseTree(node.left);
        let right = traverseTree(node.right);

        if (node.value === '^') {
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
    setEqInput(newEq);

    try {
      f = nerdamer(newEq);
    } catch (error) {
      setErrorMsg(error.message);
      setValEq(false);

      console.warn('ERROR PARSING EQUATION');
      console.log(error);

      return;
    }

    setErrorMsg('');
    setValEq(true);

    let dfdx = nerdamer.diff(f, 'x', 1);
    let dfdy = nerdamer.diff(f, 'y', 1);
    let dfdz = nerdamer.diff(f, 'z', 1);
    let norm = nerdamer(`sqrt((${dfdx})^2 + (${dfdy})^2 + (${dfdz})^2)`);

    if (norm.toString() === '0') {
      setValEq(false);
      setErrorMsg("Norm can't be 0");
      return;
    }

    let sdf = nerdamer(`(${f})/(${norm})`);
    var x = nerdamer.tree(sdf.toString());

    setEqData({
      f: f,
      dx: dfdx,
      dy: dfdy,
      dz: dfdz,
      norm: norm,
      sdf: sdf,
      parsedSdf: traverseTree(x),
    });

  };

  const handleSave = () => {
    if (nameInput in storage) {
      return;
    } else {
      let newData = { ...storage };
      newData[nameInput.toLowerCase()] = {
        id: nameInput.toLowerCase(),
        name: nameInput,
        implicit: eqData.f.toString(),
        sdf: eqData.sdf.toString(),
        parsedSdf: eqData.parsedSdf,
        fHeader: `${nameInput.toLowerCase()}(vec3 p ${parametersInput.length>0?',':''}${(parametersInput.map(p=>`float ${p.symbol}`)).join(',')})`,
        parameters: parametersInput,
      };


      setStorage(newData);
      props.handleClose();
    }
  };

  useEffect(() => {
    
    if (props.savedData) {
      setNameInput(props.savedData.name);
      setEqInput(props.savedData.implicit);
      setParametersInput(props.savedData.parameters);
      handleNewEquation(props.savedData.implicit);
    } else {
      setNameInput('');
      setEqInput('');
      setParametersInput([]);
      setEqData(null);
    }
  }, [props.savedData]);

  useEffect(() => {
    setValidName(!(nameInput in storage));
  }, [nameInput]);

  return (
    <Dialog open={props.open} onClose={props.handleClose}>
      <DialogTitle>New Surface</DialogTitle>

      <DialogContent>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TextField
              value={nameInput}
              error={!validName || nameInput == ''}
              helperText={
                nameInput === '' ? '' : validName ? '' : 'Name already in use'
              }
              onChange={(e) => setNameInput(e.target.value)}
              id="name"
              label="Name"
            />
          </Grid>

          <Grid item xs={12}>
            <TextField
              sx={{ width: '100%' }}
              value={eqInput}
              defaultValue=""
              label="Implicit"
              onChange={(e) => handleNewEquation(e.target.value)}
              id="Implicit"
              error={!validEq || eqInput === ''}
              helperText={errorMsg}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end"> = 0</InputAdornment>
                ),
              }}
            />
          </Grid>
          <Grid item xs={6}>
            <MathJax.Provider>
              <MathJax.Node formula={latexInfo()} />
            </MathJax.Provider>
          </Grid>
          <Grid item xs={6}>
            <Shader
              sdf={'sphere(p, 1.0)'}
              uniforms={{ color: { type: '3fv', value: [1.0, 1.0, 0.0] } }}
              style={{ margin: '10px' }}
            />
          </Grid>
          <Grid item xs={12}>
            <CustomInputTable
              rows={parametersInput}
              handleNewParameters={(newParams) => setParametersInput(newParams)}
            />
          </Grid>
          
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={props.handleClose}>Cancel</Button>
        <Button
          onClick={handleSave}
          disabled={
            !validName || !validEq || nameInput === '' || eqInput === ''
          }
        >
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
}
