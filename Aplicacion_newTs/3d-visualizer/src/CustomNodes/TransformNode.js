import React, {memo, useEffect } from "react";
import CustomNode from "../CustomNodes/CustomNode";
import { createTheme, ThemeProvider } from '@mui/material/styles';
import Vector3Input from "../CustomComponents/Vector3Input";

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
  Rotate: "Rotate"
};

function TransformNode({ data, id }) {
  const [operation, setOperation] = React.useState(TransformOperations.Translate);
  const [sdf, setSdf] = React.useState("");
  const [transformVal, setTransformVal] = React.useState([0,0,0]);

  useEffect(() => {
    console.log(
      `SE HAN MODIFICADO LOS SDF EN NODO TRANSFORM ${id}. AHORA HAY ${Object.keys(data.inputs).length
      }`
    );

    let input = data.inputs[Object.keys(data.inputs)[0]];

    if (input) {
      if(operation !== TransformOperations.Scale)
        setSdf(input.replace("p,", `sdf${operation}(p, vec3(${transformVal[0]},${transformVal[1]},${transformVal[2]}) ),`));
      else{
        const s = `vec3(${transformVal[0]},${transformVal[1]},${transformVal[2]})`;
        setSdf(input.replace("p,", `(p/${s}) * ${s},`));
      }

    }

  }, [data, operation, transformVal]);

  return (
    <ThemeProvider theme={theme}>
      <CustomNode
        title={"Transform"}
        id={id}
        data={data}
        dropdownOptions={Object.values(TransformOperations)}
        onChangeOption={setOperation}
        sdf={sdf}
        currOption={operation}
        body={
          <div style={{ margin: 10 }}>
            Amount
            <Vector3Input handleChange={setTransformVal}/>
          </div>
        }
      />
    </ThemeProvider>
  );
}

export default memo(TransformNode);