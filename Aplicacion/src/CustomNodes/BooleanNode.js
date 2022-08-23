import React, { useEffect } from "react";
import CustomNode from "../CustomNodes/CustomNode";
import FloatSlider from "../CustomComponents/FloatSlider";
import { createTheme, ThemeProvider, styled } from '@mui/material/styles';

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
    const inputs = `${Object.keys(data.inputs)
      .map((key) => `${data.inputs[key]}`)
      .join(", ")}`;

    setSdf(`sdf${smooth ? "Smooth" : ""}${operation}( ${inputs}${smooth ? `,${k}` : ""} )`);
  }, [data, operation, smooth, k]);



  const handleChange = (ev, val) => {
    setK(parseFloat(val).toFixed(4));
  }

  return (
    <ThemeProvider theme={theme}>
      <CustomNode
        title={"!Boolean Operator"}
        id={id}
        data={data}
        dropdownOptions={Object.values(BooleanOperations)}
        onChangeOption={setOperation}
        sdf={sdf}
        styleClass="boolean"
        body={
          <div style={{ margin: 10 }}>
            Smoothness

            <FloatSlider
              handleChange={handleChange}
              range={[0, 10]}
            />


            {/* <Toggle label="Smooth" fullWidth={true} value={smooth} onChange={() => setSmooth(!smooth)} /> */}
          </div>
        }
      />
    </ThemeProvider>
  );
}