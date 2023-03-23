import React, { memo, useEffect } from "react";
import CustomNode from "../CustomNodes/CustomNode";
import Slider from '@mui/material/Slider';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import FloatSlider from "../CustomComponents/FloatSlider";

const theme = createTheme({
  palette: {
    primary: {
      light: '#a8f798',
      main: '#3ec224',
      dark: '#1c9404',
      contrastText: 'white',
    },
  },
});

const DeformOperations = {
  Bend: "Bend",
  Twist: "Twist",
};

function DeformNode({ data, id }) {
  const [operation, setOperation] = React.useState(DeformOperations.Bend);
  const [k, setK] = React.useState(0.0);

  const [sdf, setSdf] = React.useState("");

  useEffect(() => {
    console.log(
      `SE HAN MODIFICADO LOS SDF EN NODO DEFORM ${id}. AHORA HAY ${Object.keys(data.inputs).length
      }`
    );
    
    let input = data.inputs[Object.keys(data.inputs)[0]];
    console.log("INPUTS: ", input);
    if(input){
      console.log("OLD: " + input);
      console.log(input.replace("p,", `sdf${operation}(p, ${k}),`));
      setSdf(input.replace("p,", `sdf${operation}(p, ${k}),`));

    }
  }, [data, operation, k]);

  const handleChange = (ev, val) => {
    setK(parseFloat(val).toFixed(4));
  }

  return (
    <ThemeProvider theme={theme}>
    <CustomNode
      title={"Deform"}
      id={id}
      data={data}
      dropdownOptions={Object.values(DeformOperations)}
      onChangeOption={setOperation}
      sdf={sdf}
      currOption={operation}
      body={
        <div style={{ margin: 10 }}>
            Amount
         
            <FloatSlider
              handleChange={handleChange}
              range={[0, 5]}
            />
            {/* <Slider
              size="small"
              value={k}
              label="k"
              onChange={(e, v) => setK(parseFloat(v))}
              min={0}
              max={5}
              step={0.1}
          />           */}
        </div>
      }
    />
    </ThemeProvider>
  );
}

export default memo(DeformNode);