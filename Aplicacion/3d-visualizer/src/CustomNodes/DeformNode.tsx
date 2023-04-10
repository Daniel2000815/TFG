import React, { memo, useEffect } from "react";
import CustomNode from "./CustomNode";
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

function DeformNode(props: {data:NodeSDFData, id: string }) {
  const [operation, setOperation] = React.useState(DeformOperations.Bend);
  const [k, setK] = React.useState("0.0");
  const [sdf, setSdf] = React.useState("");

  useEffect(() => {
    
    let input = props.data.inputs[Object.keys(props.data.inputs)[0]];
    if(input){
      setSdf(input.replace("p,", `sdf${operation}(p, ${k}),`));
    }
    else{
      setSdf("");
    }
  }, [props.data, operation, k]);

  const handleChange = (ev: any, val: string) => {
    setK(parseFloat(val).toFixed(4));
  }

  return (
    <ThemeProvider theme={theme}>
    <CustomNode
      title={"Deform"}
      id={props.id}
      dropdownOptions={Object.values(DeformOperations)}
      onChangeOption={setOperation}
      sdf={sdf}
      currOption={operation}
      nInputs={1}
      body={
        <div style={{ margin: 10 }}>
            Amount
            <FloatSlider
              handleChange={handleChange}
              range={[0, 5]}
            />
        </div>
      }
    />
    </ThemeProvider>
  );
}

export default memo(DeformNode);