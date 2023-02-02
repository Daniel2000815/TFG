import React, { useState, useEffect } from "react";
import Grid from '@mui/material/Unstable_Grid2';
import InputAdornment from "@mui/material/InputAdornment";
import ButtonGroup from "@mui/material/ButtonGroup";
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import Box from "@mui/material/Box";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import Button from "@mui/material/Button";
import MathJax from "react-mathjax";
import "katex/dist/katex.min.css";
import useLocalStorage from "../storageHook.js";
import Shader from '../CustomComponents/Shader';
import CustomInputTable from "../CustomComponents/CustomInputTable";

import Polynomial, {Ideal} from "../Polynomial";

const InputMode = {
  Implicit: "implicit",
  Parametric: "Parametric",
  SDF: "SDF",
};

export default function SurfaceDialog(props) {
  var nerdamer = require("nerdamer");
  require("nerdamer/Calculus");

  const [eqData, setEqData] = useState(props.eqData ? props.eqData : null);
  const [eqInput, setEqInput] = useState(["5*t^2 + 2*s^2 - 10","t","s"]);
  const [nameInput, setNameInput] = useState("");
  const [parametersInput, setParametersInput] = useState([]);
  const [storage, setStorage] = useLocalStorage("user_implicits", {});
  const [errorMsg, setErrorMsg] = useState(["","",""]);
  const [validEq, setValEq] = useState(false);
  const [validName, setValidName] = useState(false);
  const [eqInputMode, setEqInputMode] = useState(InputMode.Implicit);
  
  const latexInfo = () => {
    const implicit =
      eqData && validEq ? nerdamer.convertToLaTeX(eqData.f.toString()) : "";
    const dx =
      eqData && validEq ? nerdamer.convertToLaTeX(eqData.dx.toString()) : "";
    const dy =
      eqData && validEq ? nerdamer.convertToLaTeX(eqData.dy.toString()) : "";
    const dz =
      eqData && validEq ? nerdamer.convertToLaTeX(eqData.dz.toString()) : "";
    const norm =
      eqData && validEq ? nerdamer.convertToLaTeX(eqData.norm.toString()) : "";
    const sdf =
      eqData && validEq ? nerdamer.convertToLaTeX(eqData.sdf.toString()) : "";

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

  const equationInput = (idx, val, label, setVal, validEq, errorMsg, adornmentPos, adornment) => {
    return (
      <TextField
        sx={{ width: "100%" }}
        value={val[idx]}
        defaultValue=""
        label={label}
        onChange={(e) => setVal(e.target.value, idx)}
        id={label}
        error={!validEq || val[idx] === ""}
        helperText={errorMsg[idx]}
        InputProps={{
          endAdornment: (
            <InputAdornment position={adornmentPos}>
              {adornment}
            </InputAdornment>
          ),
        }}
      />
    );
  }
  const traverseTree = (node) => {
    console.log("wh");
    console.log(parametersInput);
    const parametersSymbols = Object.keys(parametersInput).map(
      (val, key) => parametersInput[key].symbol
    );

    if (node) {
      console.log("ES NO LO SE");
      console.log(node);
      if (node.type === "VARIABLE_OR_LITERAL") {
        const isVariable = [...parametersSymbols, "x", "y", "z"].includes(
          node.value
        );
        console.log("ES LITERAL");
        console.log("SYMBOLS");
        console.log(parametersSymbols);
        console.log(isVariable);
        console.log(node.value);
        return isVariable ? node.value : parseFloat(node.value).toFixed(4);
      }
      if (node.type === "OPERATOR") {
        let left = traverseTree(node.left);
        let right = traverseTree(node.right);
        console.log("RIGHT, LEFT");
        console.log(right);
        console.log(left);

        if (node.value === "^") {
          console.log("ES OPERATOR");
          console.log(node);
          return `pow(${left}, ${right})`;
        } else {
          if (right && left) return `(${left})${node.value}(${right})`;
          else if (left) return `${node.value}(${left})`;
          else return "????";
        }

        // return node.toString();
      }
      if (node.type === "FUNCTION") {
        let left = traverseTree(node.left);
        let right = traverseTree(node.right);

        if (node.value === "^") {
          console.log("ES F");
          console.log(node);
          return `pow(${left}, ${right})`;
        } else {
          if (right) return `${node.value}(${right})`;
          else return "????";
        }
      }
    }
  };

  const handleNewEquation = (newEq, eqIndex) => {
    let f = null;

    let newEqInput = [...eqInput];
    newEqInput[eqIndex] = newEq;

    setEqInput(newEqInput);

    try {
      f = nerdamer(newEq);
    } catch (error) {
      let newErrorMsg = [...errorMsg];
       newErrorMsg[eqIndex] = error.message.split('at ')[0];
       
      setErrorMsg(newErrorMsg);
      console.log(errorMsg);
      setValEq(false);

      console.warn("ERROR PARSING EQUATION");
      console.log(error);

      return;
    }

    setErrorMsg(["","",""]);
    setValEq(true);

    let dfdx = nerdamer.diff(f, "x", 1);
    let dfdy = nerdamer.diff(f, "y", 1);
    let dfdz = nerdamer.diff(f, "z", 1);
    let norm = nerdamer(`sqrt((${dfdx})^2 + (${dfdy})^2 + (${dfdz})^2)`);

    if(eqInputMode==="IMPLICIT"){
      if ( norm.toString() === "0") {
        setValEq(false);
        let newErrorMsg = [...errorMsg];
        newErrorMsg[eqIndex] = "Norm can't be 0";
        setErrorMsg(newErrorMsg);
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
        parsedSdf: `return ${traverseTree(x)}`,
      });
    }

    console.log("IMPLIC: " + Ideal.implicit( new Polynomial(eqInput[0]), new Polynomial(eqInput[1]), new Polynomial(eqInput[2])) );


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
        fHeader: `${nameInput.toLowerCase()}(vec3 p ${
          parametersInput.length > 0 ? "," : ""
        }${parametersInput.map((p) => `float ${p.symbol}`).join(",")})`,
        parameters: parametersInput,
      };

      setStorage(newData);
      props.handleClose();
    }
  };

  useEffect(() => {
    if (props.savedData) {
      setNameInput(props.savedData.name);
      setEqInput([props.savedData.implicit,"",""]);
      setParametersInput(props.savedData.parameters);
      handleNewEquation(props.savedData.implicit);
    } else {
      setNameInput("");
      setEqInput(["","",""]);
      setParametersInput([]);
      setEqData(null);
    }
  }, [props.savedData]);

  useEffect(() => {
    setValidName(!(nameInput.toLowerCase() in storage));
  }, [nameInput]);

  const chooseInput = () => {
    return (
      <ButtonGroup variant="outlined" aria-label="outlined button group">
        <Button onClick={() => setEqInputMode(InputMode.Implicit)}>
          Implicit
        </Button>
        <Button onClick={() => setEqInputMode(InputMode.Parametric)}>
          Parametric
        </Button>
        <Button onClick={() => setEqInputMode(InputMode.SDF)}>SDF</Button>
      </ButtonGroup>
    );
  };

  const displayInput = () => {
    switch (eqInputMode) {
      case InputMode.Implicit:
        return (
          equationInput(0, eqInput, "Implicit", handleNewEquation, validEq, errorMsg, "end", " = 0")
        );

      case InputMode.Parametric:
        return (

          <Grid container spacing={{ xs: 3}} columns={{ xs: 1}}>
            <Grid xs={12}>{equationInput(0, eqInput, "Equation x", handleNewEquation, validEq, errorMsg, "start", "= x")}</Grid>
            <Grid xs={12}>{equationInput(1, eqInput, "Equation y", handleNewEquation, validEq, errorMsg, "start", "= y")}</Grid>
            <Grid xs={12}>{equationInput(2, eqInput, "Equation z", handleNewEquation, validEq, errorMsg, "start", "= z")}</Grid>
          </Grid>
          

        );

        case InputMode.SDF:
        return (
          equationInput(0, eqInput, "Surface SDF", handleNewEquation, validEq, errorMsg, "start", "")
        );

      default:
        break;
    }
  };

  const nameInputText = () => {
    return <TextField
    value={nameInput}
    error={!validName || nameInput === ""}
    helperText={
      nameInput === "" ? "" : validName ? "" : "Name already in use"
    }
    onChange={(e) => setNameInput(e.target.value)}
    id="name"
    label="Name"
  />
  }
  return (
    <Dialog open={props.open} onClose={props.handleClose}>
      <DialogTitle>New Surface</DialogTitle>

      <DialogContent>
        <Grid container spacing={2}>
          {parametersInput.toString()}
          <Grid item xs={12}>
            {nameInputText()}
          </Grid>
          <Grid item xs={12}>
            <Box textAlign="center">{chooseInput()}</Box>
          </Grid>
          <Grid item xs={12}>
            {displayInput()}
          </Grid>
          <Grid item xs={6}>
            <MathJax.Provider>
              <MathJax.Node formula={latexInfo()} />
            </MathJax.Provider>
          </Grid>
          <Grid item xs={6}>
          <Shader
                sdf={eqInput}
                style={{ margin: '10px', height: '100%' }}
              />
          </Grid>
          <Grid item xs={12}>
            <CustomInputTable
              rows={parametersInput}
              handleNewParameters={(newParams) => {
                setParametersInput(newParams);
                console.log(newParams);
              }}
            />
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={props.handleClose}>Cancel</Button>
        <Button
          onClick={handleSave}
          disabled={
            !validName || !validEq || nameInput === "" || eqInput === ""
          }
        >
          Save
        </Button>
      </DialogActions>
      
    </Dialog>
  );
}
