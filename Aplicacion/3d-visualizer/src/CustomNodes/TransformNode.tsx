import React, {memo, useEffect } from "react";
import CustomNode from "./CustomNode";
import { createTheme, ThemeProvider } from '@mui/material/styles';
import Vector3Input from "../CustomComponents/Vector3InputTS";
import { TransformOptions } from "stream";
import FloatInput from "../CustomComponents/FloatInput";

const theme = createTheme({
  palette: {
    primary: {
      light: '#ffd7a2',
      main: '#ffbb62',
      dark: '#fa9c21',
      contrastText: 'white',
    },
  },
});

const TransformOperations = {
  Translate: "Translate",
  Scale: "Scale",
  RotateXYZ: "Rotate",
  RotateX: "RotateX",
  RotateY: "RotateY",
  RotateZ: "RotateZ",
};

function TransformNode(props: { data: NodeSDFData, id: string }) {
  const [operation, setOperation] = React.useState<string>(TransformOperations.Translate);
  const [sdf, setSdf] = React.useState("");
  const [transformVal, setTransformVal] = React.useState(["0","0","0"]);

  useEffect(() => {
    console.log(
      `SE HAN MODIFICADO LOS SDF EN NODO TRANSFORM ${props.id}. AHORA HAY ${Object.keys(props.data.inputs).length
      }`
    );

    let input = props.data.inputs[Object.keys(props.data.inputs)[0]];

    if (input) {
      if(operation !== TransformOperations.Scale){
        if(operation === TransformOperations.RotateXYZ || operation === TransformOperations.Translate){
        setSdf(input.replace("p,", `sdf${operation}(p, vec3(${transformVal[0]},${transformVal[1]}, ${transformVal[2]}) ),`));
        }
        else{
          setSdf(input.replace("p,", `sdf${operation}(p, ${transformVal[0]}),`));
        }
      }
      else{
        const s = `vec3(${transformVal.join(",")})`;
        setSdf(input.replace("p,", `(p/${s}) * ${s},`));
      }

    }

  }, [props.data, operation, transformVal]);

  return (
    <ThemeProvider theme={theme}>
      {sdf}
      <CustomNode
        title={"Transform"}
        id={props.id}
        dropdownOptions={Object.values(TransformOperations)}
        onChangeOption={setOperation}
        sdf={sdf}
        currOption={operation}
        nInputs={1}
        body={
          <div style={{ margin: 10 }}>
            {[TransformOperations.Translate, TransformOperations.RotateXYZ, TransformOperations.Scale].includes(operation) ?
            <Vector3Input handleChange={setTransformVal}/> : <FloatInput initialVal={"0.0"} onChange={(e)=>setTransformVal([e.toFixed(4), "0.0", "0.0"])} label="Angle" adornment="Angle" adornmentPos="left"/>}
          </div>
        }
      />
    </ThemeProvider>
  );
}

export default memo(TransformNode);