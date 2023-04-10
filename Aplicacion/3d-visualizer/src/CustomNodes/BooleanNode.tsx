import React, { useEffect, memo } from "react";
import CustomNode from "../CustomNodes/CustomNode";
import FloatSlider from "../CustomComponents/FloatSlider";
import { createTheme, ThemeProvider } from '@mui/material/styles';
// import { NextUIProvider, useTheme,createTheme } from '@nextui-org/react';

const theme = createTheme({
  palette: {
    primary: {
      light: '#ff8787',
      main: '#ff5858',
      dark: '#ff2323',
      contrastText: 'white',
    },
  },
});


const BooleanOperations = {
  Union: "Union",
  Difference: "Difference",
  Intersection: "Intersection",
};

function BooleanNode(props: { data: NodeSDFData, id: string }) {
  const [operation, setOperation] = React.useState(BooleanOperations.Union);
  const [smooth] = React.useState(true);
  const [k, setK] = React.useState(0.0);
  const [sdf, setSdf] = React.useState("");

  useEffect(() => {
    console.log(
      `SE HAN MODIFICADO LOS SDF EN NODO BOOLEANO ${props.id}. AHORA HAY ${Object.keys(props.data.inputs).length
      }`
    );

    // minimum of 2 inputs
    const keys = Object.keys(props.data.inputs);
    if(keys.length < 2){
      setSdf("");
      return;
    }

    let newSdf = `sdfSmooth${operation}(${props.data.inputs[keys[0]]}, ${props.data.inputs[keys[1]]}, ${k.toFixed(4)})`;

    // Add the rest of inputs
    for (let i = 0; i < keys.length - 2; i++) {
      console.log(props.data.inputs[keys[i + 2]]);
      newSdf = `sdfSmooth${operation}(${props.data.inputs[keys[i + 2]]}, ${newSdf}, ${k.toFixed(4)})`;
    };

    setSdf(newSdf);
  }, [props.data, operation, smooth, k]);



  const handleChange = (ev: any, val: string) => {
    setK(parseFloat(val));
  }

  

  return (
    <ThemeProvider theme={theme}>
      <CustomNode
        title={"Boolean"}
        id={props.id}
        dropdownOptions={Object.values(BooleanOperations)}
        onChangeOption={setOperation}
        sdf={sdf}
        currOption={operation}
        nInputs={Math.max(2, Object.values(props.data.inputs).filter((val: string) => val!=="").length + 1)}
        body={
          <div style={{ margin: 10 }}>
            Smoothness

            <FloatSlider
              handleChange={handleChange}
              range={[0, 10]}
            />

          </div>
        }
      />
    </ThemeProvider>
  );
}

export default memo(BooleanNode);