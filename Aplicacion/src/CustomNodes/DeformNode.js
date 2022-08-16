import React, { useEffect } from "react";
import CustomNode from "../CustomNodes/CustomNode";
import Toggle from "../CustomComponents/Toggle";
import Slider from '@mui/material/Slider';
import Stack from '@mui/material/Stack';

const DeformOperations = {
  Bend: "Bend",
  Twist: "Twist",
};

export default function DeformNode({ data, id }) {
  const [operation, setOperation] = React.useState(DeformOperations.Bend);
  const [k, setK] = React.useState(0.0.toFixed(4));

  const [sdf, setSdf] = React.useState("");

  useEffect(() => {
    console.log(
      `SE HAN MODIFICADO LOS SDF EN NODO DEFORM. AHORA HAY ${Object.keys(data.inputs).length
      }`
    );
    
    let input = data.inputs[Object.keys(data.inputs)[0]];

    if(input){
      console.log("OLD: " + input);
      console.log(typeof(input));
      setSdf(input.replace("p,", `sdf${operation}(p, ${k}),`));

    }
  }, [data, operation, k]);

  return (
    <CustomNode
      title={"Deform Operator"}
      id={id}
      data={data}
      dropdownOptions={Object.values(DeformOperations)}
      onChangeOption={setOperation}
      sdf={sdf}
      styleClass="deform"
      body={
        <div style={{ margin: 10 }}>
            Amount
         
            <Slider
              size="small"
              value={k}
              valueLabelDisplay="k"
              onChange={(e, v) => setK(parseFloat(v).toFixed(4))}
              min={0}
              max={5}
              step={0.1}
          />          
        </div>
      }
    />
  );
}