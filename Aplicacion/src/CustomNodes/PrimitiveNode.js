import React, { useEffect } from "react";
import CustomNode from "../CustomNodes/CustomNode";
import FloatInput from "../CustomComponents/FloatInput.js";
import { createTheme, ThemeProvider } from '@mui/material/styles';
import useLocalStorage from "../storageHook";

const theme = createTheme({
  palette: {
    primary: {
      light: '#92bcff',
      main: '#609dff',
      dark: '#166cf5',
      contrastText: 'white',
    },
  },
});

const Primitives = {
  Sphere: "Sphere",
  Box: "Box",
  Torus: "Torus",
  Cylinder: "Cylinder",
};

export default function PrimitiveNode({ data, id }) {
  const [primitive, setPrimitive] = React.useState("sphere");
  const [sdf, setSdf] = React.useState("");
  const [inputs, setInputs] = React.useState([1.0, 1.0, 1.0]);
  const [inputLabels, setInputLabels] = React.useState(["Radius", "", ""]);
  const [inputsActive, setInputsActive] = React.useState([true, false, false]);

  const [storage, setStorage] = useLocalStorage('user_implicits', {});

  const prepareInputs = (label1, label2 = "", label3 = "") => {
    setInputLabels([label1, label2, label3]);
    setInputsActive([label1, label2, label3]);
  };

  const handleInputChange = (newVal, idx) => {
    const newInputs = [...inputs];
    newInputs[idx] = newVal;

    setInputs(newInputs);
  }

  useEffect(() => {
    /*
    console.log("ACTUALIZADO SDF");
    if (primitive == Primitives.Sphere) {
      setSdf(`sphere(p, ${inputs[0].toFixed(4)})`);
      prepareInputs("radius");
    } else if (primitive == Primitives.Box) {
      setSdf(
        `box(p, vec3(
          ${inputs[0].toFixed(4)}, 
          ${inputs[1].toFixed(4)}, 
          ${inputs[2].toFixed(4)}
          )
        )`
      );
      prepareInputs("sx", "sy", "sz");
    } else if (primitive == Primitives.Torus) {
      setSdf(
        `torus(p, vec2(
          ${inputs[0].toFixed(4)}, 
          ${inputs[1].toFixed(4)}
          )
        )`
      );
      prepareInputs("hole", "thickness");
    } else if (primitive == Primitives.Cylinder) {
      setSdf(
        `cylinder(p, 
          ${inputs[0].toFixed(4)}, 
          ${inputs[1].toFixed(4)}
        )`
      );
      prepareInputs("height", "radius");
    }

    console.log(storage);
    */
    const parameters = storage[primitive].parameters;
    
    console.log("TYPE: " + typeof(parameters[0].defaultVal));
    setInputs(Object.keys(parameters).map(function(k){return parameters[k].defaultVal.toFixed(4)}));
    setInputLabels(Object.keys(parameters).map(function(k){return parameters[k].label}));
    
    // setInputs(Array(parameters.length).fill().map((_, idx) => parameters[idx].defaultVal));
    console.log(parameters);
    console.log(primitive);
  }, [primitive]);

  useEffect(()=>{
    const parameters = storage[primitive].parameters;
    setSdf(`${primitive}(p ${parameters.length>0?',':''}${(parameters.map((p,idx)=>`${inputs[idx]}`)).join(',')})`);
  }, [inputs])

  return (
    <ThemeProvider theme={theme}>
      <CustomNode
        title={"Primitive"}
        id={id}
        data={data}
        dropdownOptions={Object.keys(storage)}
        body={
          <>
          {storage[primitive]?.parameters.map((param)=>{
            return(<p>{param.symbol}</p>)
          })}

          {inputs.map((input, idx) => {
            return(
            <FloatInput
              val={inputs[idx]}
              handleChange={(newVal) => handleInputChange(newVal, idx)}
              label={inputLabels[0]}
            />
            )
          })}
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
