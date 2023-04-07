import React, { memo, useEffect } from "react";
import CustomNode from "./CustomNode";
import FloatInput from "../CustomComponents/FloatInput";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import useLocalStorage from "../Utils/storageHook";
import {
  Grid,

} from "@nextui-org/react";
const theme = createTheme({
  palette: {
    primary: {
      light: "#92bcff",
      main: "#609dff",
      dark: "#166cf5",
      contrastText: "white",
    },
  },
});

function PrimitiveNode(props: { id: string }) {
  const [primitive, setPrimitive] = React.useState("sphere");
  const [sdf, setSdf] = React.useState("");
  const [inputs, setInputs] = React.useState([1.0, 1.0, 1.0]);
  const [inputLabels, setInputLabels] = React.useState(["Radius", "", ""]);
  const [storage] = useLocalStorage("user_implicits");

  const handleInputChange = (newVal: number, idx: number) => {
    const newInputs = [...inputs];
    newInputs[idx] = newVal;

    setInputs(newInputs);
  };

  useEffect(() => {
    if (!storage[primitive]) return;

    const parameters = storage[primitive].parameters;
    console.log(parameters);
    setInputs(
      Object.keys(parameters).map(function (k) {
        return parameters[k].defaultVal;
      })
    );
    setInputLabels(
      Object.keys(parameters).map(function (k) {
        return parameters[k].label;
      })
    );

    // setInputs(Array(parameters.length).fill().map((_, idx) => parameters[idx].defaultVal));
    console.log(parameters);
    console.log(primitive);
  }, [primitive]);

  useEffect(() => {
    if (!storage[primitive]) return;

    const parameters : Parameter[] = storage[primitive].parameters;
    console.log(inputs);
    setSdf(
      `${primitive}(p${parameters.length > 0 ? "," : ""}${parameters
        .map((p, idx) => `${inputs[idx].toFixed(4)}`)
        .join(",")})`
    );
  }, [inputs]);

  return (
    <ThemeProvider theme={theme}>
      <CustomNode
        title={"Primitive"}
        id={props.id}
        dropdownOptions={Object.keys(storage)}
        body={
          <>
            <Grid.Container gap={1}>
              {inputs.map((input, idx) => (
                
                  <Grid key={`${props.id}_input_${idx}`} xs={12}>
                    <FloatInput
                      initialVal={inputs[idx]}
                      onChange={(newVal) => handleInputChange(newVal, idx)}
                      label={inputLabels[idx]}
                      adornment={inputLabels[idx]}
                      adornmentPos="left"
                    />
                  </Grid>
                
              ))}
            </Grid.Container>
          </>
        }
        onChangeOption={setPrimitive}
        sdf={sdf}
        currOption={primitive}
        nInputs={0}
      />
    </ThemeProvider>
  );
}

export default memo(PrimitiveNode);
