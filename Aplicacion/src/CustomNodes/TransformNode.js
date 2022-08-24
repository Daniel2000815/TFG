import React, { useEffect } from "react";
import CustomNode from "../CustomNodes/CustomNode";
import FloatSlider from "../CustomComponents/FloatSlider";
import { createTheme, ThemeProvider } from '@mui/material/styles';

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

export default function TransformNode({ data, id }) {
  const [operation, setOperation] = React.useState(TransformOperations.Translate);
  const [k, setK] = React.useState(0.0.toFixed(4));

  const [sdf, setSdf] = React.useState("");

  useEffect(() => {
    console.log(
      `SE HAN MODIFICADO LOS SDF EN NODO TRANSFORM. AHORA HAY ${Object.keys(data.inputs).length
      }`
    );

    let input = data.inputs[Object.keys(data.inputs)[0]];

    if (input) {
      setSdf(input.replace("p,", `sdf${operation}(p, ${k}),`));

    }

  }, [data, operation, k]);

  const handleChange = (ev, val) => {
    setK(parseFloat(val).toFixed(4));
  }

  return (
    <ThemeProvider theme={theme}>
      <CustomNode
        title={"Transform"}
        id={id}
        data={data}
        dropdownOptions={Object.values(TransformOperations)}
        onChangeOption={setOperation}
        sdf={sdf}
        styleClass="transform"
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