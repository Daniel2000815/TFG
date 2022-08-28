import React, { useEffect } from "react";
import CustomNode from "../CustomNodes/CustomNode";
import FloatSlider from "../CustomComponents/FloatSlider";
import { createTheme, ThemeProvider } from '@mui/material/styles';

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

export default function BooleanNode({ data, id }) {
  const [operation, setOperation] = React.useState(BooleanOperations.Union);
  const [smooth, setSmooth] = React.useState(true);
  const [k, setK] = React.useState(0.0.toFixed(4));
  const [sdf, setSdf] = React.useState("");

  useEffect(() => {
    console.log(
      `SE HAN MODIFICADO LOS SDF EN NODO BOOLEANO. AHORA HAY ${Object.keys(data.inputs).length
      }`
    );

    const keys = Object.keys(data.inputs);

    let newSdf  = `sdfSmooth${operation}(${data.inputs[keys[0]]}, ${data.inputs[keys[1]]}, ${k})`;

    for (let i=0; i < keys.length-2; i++) {
      console.log(data.inputs[keys[i+2]]);
      newSdf = `sdfSmooth${operation}(${data.inputs[keys[i+2]]}, ${newSdf}, ${k})`;
    };

    setSdf(newSdf);
  }, [data, operation, smooth, k]);



  const handleChange = (ev, val) => {
    setK(parseFloat(val).toFixed(4));
  }

  return (
    <ThemeProvider theme={theme}>
      <CustomNode
        title={"Boolean"}
        id={id}
        data={data}
        dropdownOptions={Object.values(BooleanOperations)}
        onChangeOption={setOperation}
        sdf={sdf}
        currOption={operation}
        nInputs={Math.max(2, Object.keys(data.inputs).length + 1)}
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