import InputAdornment from "@mui/material/InputAdornment";
import TextField from "@mui/material/TextField";
import Grid from "@mui/material/Unstable_Grid2";

import { Input } from "@nextui-org/react";

// export default function EquationInput(idx: number, val: string, label: string, setVal: Function, validEq: boolean, errorMsg: string, adornmentPos: "end"|"start", adornment: string) {
//   return <Input onChange={(e) => setVal(e.target.value, idx)} placeholder="Next UI" />;
// }

export default function EquationInput(val: string,
  label: string,
  setVal: Function,
  errorMsg: string,
  adornmentPos: "right" | "left",
  adornment: string){
  return (<Input 
    value={val}
    defaultValue=""
    onChange={(e) => setVal(e.target.value)}
      id={label}
      status={errorMsg!=="" ? "error" : "default"}
      color={errorMsg!=="" ? "error" : "default"}
      helperText={errorMsg}
    labelRight={adornmentPos==="right" ? adornment : null} 
    helperColor={errorMsg!=="" ? "error" : "default"}
    labelLeft={adornmentPos==="left" ? adornment : null} 
    placeholder={label}
    fullWidth
    aria-label={label}
  />)
}
// export default function EquationInput(
//   val: string,
//   label: string,
//   setVal: Function,
//   errorMsg: string,
//   adornmentPos: "left" | "right",
//   adornment: string
// ) {
//   return (
//     <TextField
//       sx={{ width: "100%" }}
//       value={val}
//       defaultValue=""
//       label={label}
//       onChange={(e) => setVal(e.target.value)}
//       id={label}
//       error={errorMsg!==""}
//       helperText={errorMsg}
//       InputProps={{
//         endAdornment: (
//           <InputAdornment position={"start"}>{adornment}</InputAdornment>
//         ),
//       }}
//     />
//   );
// }

export function ImplicitInput(
  value: string,
  handleNewEquation: Function,
  errorMsg: string
) {
  return EquationInput(
    value,
    "Implicit",
    (e:string) => handleNewEquation(e,0),
    errorMsg,
    "right",
    "=0"
  );
}

export function SDFInput(
  value: string,
  handleNewEquation: Function,
  errorMsg: string
) {
  return EquationInput(
    value,
    "Surface SDF",
    (e:string) => handleNewEquation(e,0),
    errorMsg,
    "left",
    ""
  );
}

export function ParametricInput(
  value: string[],
  handleNewEquation: Function,
  errorMsg: string[]
) {
  return (
    <Grid container gap={1}>
      <Grid xs={12}>
        {EquationInput(
          value[0],
          "Equation x",
          (e: string)=>handleNewEquation(e,0),
          errorMsg[0],
          "left",
          "x="
        )}
      </Grid>
      <Grid xs={12}>
        {EquationInput(
          value[1],
          "Equation y",
          (e: string)=>handleNewEquation(e,1),
          errorMsg[1],
          "left",
          "y="
        )}
      </Grid>
      <Grid xs={12}>
        {EquationInput(
          value[2],
          "Equation z",
          (e: string)=>handleNewEquation(e,2),
          errorMsg[2],
          "left",
          "z="
        )}
      </Grid>
    </Grid>
  );
}
