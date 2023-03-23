// import React, { useState, useEffect } from "react";
// import Grid from "@mui/material/Unstable_Grid2";
// import InputAdornment from "@mui/material/InputAdornment";
// import ButtonGroup from "@mui/material/ButtonGroup";
// import TextField from "@mui/material/TextField";
// import Dialog from "@mui/material/Dialog";
// import DialogActions from "@mui/material/DialogActions";
// import Box from "@mui/material/Box";
// import DialogContent from "@mui/material/DialogContent";
// import DialogTitle from "@mui/material/DialogTitle";
// import Button from "@mui/material/Button";
// import "katex/dist/katex.min.css";
// import useLocalStorage from "../storageHook";
// import Shader from "../CustomComponents/Shader";
// import CustomInputTable from "../CustomComponents/CustomInputTable";
// import { Polynomial } from "../multivariate-polynomial/Polynomial";

// import  {SDFInput, ParametricInput, ImplicitInput} from "../Components/EquationInput";
// import ImplicitToSDF from "../Components/StringToSDF";
// import nerdamerTS from "nerdamer-ts";
// import nerdamer, { ExpressionParam } from "nerdamer";
// import { InputMode } from "../Types/InputMode";
// import { Expression } from "nerdamer-ts/dist/Parser/Expression";
// import ParameterTable from "../Components/ParameterTable";
// import { err } from "nerdamer-ts/dist/Core/Errors";
// require("nerdamer/Calculus");

export default function App(){
  <></>
}
// export default function SurfaceDialog(props : {
//   data: EquationData,
//   handleClose: Function,
//   open: boolean
// }
// ) {
//   const [eqData, setEqData] = useState({
//     id: "",
//     name: "",
//     inputMode: InputMode.Implicit,
//     input: "",
//     parsedInput: "",
//     parameters: [""],
//     fHeader: ""
//   });

//   const [storage, setStorage] = useLocalStorage("user_implicits");

//   // INPUT FROM DIALOG
//   const [inputMath1, setInputMath1] = useState("5*t^2 + 2*s^2 - 10");
//   const [inputMath2, setInputMath2] = useState("t");
//   const [inputMath3, setInputMath3] = useState("s");
//   const [inputName, setInputName] = useState("");
//   const [inputParameters, setInputParameters] = useState<Parameter[]>([]);

//   // VALIDATION OS INPUT FROM DIALOG
//   const [validName, setValidName] = useState(false);
//   const [mathErrorMsg, setMathErrorMsg] = useState(["", "", ""]);
//   const [nameErrorMsg, setNameErrorMsg] = useState("");

//   const [eqInputMode, setEqInputMode] = useState(InputMode.Implicit);

//   // const latexInfo = () => {
//   //   const implicit =
//   //     eqData && validEq ? nerdamer.convertToLaTeX(eqData.f.toString()) : "";
//   //   const dx =
//   //     eqData && validEq ? nerdamer.convertToLaTeX(eqData.dx.toString()) : "";
//   //   const dy =
//   //     eqData && validEq ? nerdamer.convertToLaTeX(eqData.dy.toString()) : "";
//   //   const dz =
//   //     eqData && validEq ? nerdamer.convertToLaTeX(eqData.dz.toString()) : "";
//   //   const norm =
//   //     eqData && validEq ? nerdamer.convertToLaTeX(eqData.norm.toString()) : "";
//   //   const sdf =
//   //     eqData && validEq ? nerdamer.convertToLaTeX(eqData.sdf.toString()) : "";

//   //   return `\\begin{align*}
//   //         f(x,y,z) &=  ${implicit} \\\\[10pt]
//   //         \\nabla f(x,y,z) &= \\left(
//   //           ${dx},
//   //           ${dy},
//   //           ${dz}
//   //         \\right) \\\\[10pt]
//   //         \\Vert \\nabla f(x,y,z) \\Vert &= ${norm} \\\\[10pt]
//   //         \\text{sdf}(x,y,z) &= ${sdf}
//   //       \\end{align*}`;
//   // };

//   const handleNewEquation = (newEq: string, eqIndex: number) => {
//     let f: string | null = null; // Parsed string by nerdamer
//     let newErrorMsg = [...mathErrorMsg];
//     newErrorMsg[eqIndex] = newEq==="" ? "Introduce equation":"";

//     let res: string | null = null;

//     // Modificamos el texto que se ve en el campo de texto correspondiente
//     if(eqIndex === 0) setInputMath1(newEq);
//     else if(eqIndex === 1) setInputMath2(newEq);
//     else if(eqIndex === 2) setInputMath3(newEq);
//     else  throw new Error("EQUATION INDEX OUT OF RANGE");

//     // Si es un SDF no hace falta parsear
//     if (eqInputMode === InputMode.SDF) {
//       res = newEq;
//     } else {
//       let implicit = newEq;

//       if (eqInputMode === InputMode.Parametric) {
//         const fx = new Polynomial(inputMath1, ["s","t"]);
//         const fy = new Polynomial(inputMath2, ["s","t"]);
//         const fz = new Polynomial(inputMath3, ["s","t"]);
//         implicit = Polynomial.implicitateR3(fx,fy,fz).toString();
//         console.log("IMPLICIT: ", implicit);
//       }

//       // try {
//       //   res = ImplicitToSDF(implicit, inputParameters);
//       //   console.log("SDF: ", res);
//       // } catch (error: any) {
//       //   console.log("ERRORES:" + error.msg);
//       //   newErrorMsg[eqIndex] = error.msg;
//       // }
//       res = ImplicitToSDF(implicit, inputParameters);
     
//     }

//     if (res !== null) setEqData({ ...eqData, parsedInput: res });
//     console.log(res);
//     setMathErrorMsg(newErrorMsg);
//     console.log("ERRORS ", newErrorMsg);
//   };


//   const handleSave = () => {
//     // const id = inputName.toLowerCase();

//     // if (id in storage) {
//     //   return;
//     // } else {
//     //   let newData = { ...storage };

//     //   const e: EquationData = {
//     //     id: id,
//     //     name: inputName,
//     //     inputMode: eqInputMode,
//     //     implicit: eqData.f.toString(),
//     //     sdf: eqData.sdf.toString(),
//     //     parsedSdf: eqData.parsedSdf,
//     //     fHeader: `${nameInput.toLowerCase()}(vec3 p ${
//     //       parametersInput.length > 0 ? "," : ""
//     //     }${parametersInput.map((p) => `float ${p.symbol}`).join(",")})`,
//     //     parameters: parametersInput,
//     //   };

//     //   newData[id] = e;

//     //   setStorage(newData);
//     //   handleClose();
//     // }
//   };

//   useEffect(() => {
    
//     if(!props.data)
//       return;
    
//     setEqInputMode(props.data.inputMode);
//     setInputMath1(props.data.parsedInput);
//     setInputParameters(props.data.parameters);

//     if(props.data.inputMode === InputMode.Parametric){
//       handleNewEquation(props.data.input[0], 0);
//       handleNewEquation(props.data.input[1], 1);
//       handleNewEquation(props.data.input[2], 2);
//     }
//     else
//       handleNewEquation(props.data.input, 0);

//     handleNewName(props.data.name);
    
//   }, [props.data]);

//   const chooseInput = () => {
//     return (
//       <ButtonGroup variant="outlined" aria-label="outlined button group">
//         <Button onClick={() => setEqInputMode(InputMode.Implicit)}>
//           Implicit
//         </Button>
//         <Button onClick={() => setEqInputMode(InputMode.Parametric)}>
//           Parametric
//         </Button>
//         <Button onClick={() => setEqInputMode(InputMode.SDF)}>SDF</Button>
//       </ButtonGroup>
//     );
//   };

//   const displayInput = () => {
//     switch (eqInputMode) {
//       case InputMode.Implicit:
//         return ImplicitInput([inputMath1], (inputs: string[],)=>handleNewEquation(inputs[0],0), mathErrorMsg[0]);

//       case InputMode.Parametric:
//         return ParametricInput([inputMath1, inputMath2, inputMath3], (inputs: string[],)=>{handleNewEquation(inputs[0],0); handleNewEquation(inputs[1],1); handleNewEquation(inputs[2],2);}, mathErrorMsg)

//       case InputMode.SDF:
//         return SDFInput([inputMath1], (inputs: string[],)=>handleNewEquation(inputs[0],0), mathErrorMsg[0])

//       default:
//         break;
//     }
//   };

//   function handleNewName(name: string){
//     setInputName(name);

//     if(name === "") setNameErrorMsg("Introduce a name");
//     else if((name.toLowerCase() in storage)){
//       setNameErrorMsg("Name already in use");
//     }
//     else{
//       setNameErrorMsg("");
//     }

//   }
//   const nameInputText = () => {
//     return (
//       <TextField
//         value={inputName}
//         error={nameErrorMsg !== ""}
//         helperText={nameErrorMsg}
//         onChange={(e) => handleNewName(e.target.value)}
//         id="name"
//         label="Name"
//       />
//     );
//   };

//   return (
//     <Dialog open={props.open} onClose={() => props.handleClose()}>
      
//       <DialogTitle>New Surface</DialogTitle>

//       <DialogContent>
//       {eqData.parsedInput}
//         <Grid container spacing={2}>
//           {inputParameters.toString()}
//           <Grid xs={12}>
//             {nameInputText()}
//           </Grid>
//           <Grid xs={12}>
//             <Box textAlign="center">{chooseInput()}</Box>
//           </Grid>
//           <Grid xs={12}>
//             {displayInput()}
//           </Grid>
//           {/* <Grid xs={6}>
//             <MathJax.Provider>
//               <MathJax.Node formula={latexInfo()} />
//             </MathJax.Provider>
//           </Grid> */}
//           <Grid xs={12}>
//             {/* <CustomInputTable
//               rows={inputParameters}
//               handleNewParameters={(newParams: Parameter[]) => {
//                 setInputParameters(newParams);
//                 console.log(newParams);
//               }}
//             /> */}
//             <ParameterTable params={inputParameters} onEditParams={(newParams: Parameter[]) => {
//                 setInputParameters(newParams);
//                 console.log(newParams);
//               }}/>
//           </Grid>
//           <Grid xs={6}>
//             <Shader sdf={eqData.parsedInput} style={{ margin: "10px", height: "100px" }} />
//           </Grid>
          
//         </Grid>
//       </DialogContent>
//       <DialogActions>
//         <Button onClick={()=>props.handleClose()}>Cancel</Button>
//         <Button
//           onClick={handleSave}
//           disabled={
//             !validName || mathErrorMsg.some(m => m!=="") || inputName === ""
//           }
//         >
//           Save
//         </Button>
//       </DialogActions>
//     </Dialog>
//   );
// }
