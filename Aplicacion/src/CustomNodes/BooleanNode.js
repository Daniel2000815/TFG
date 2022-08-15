import React, { useEffect } from "react";
import CustomNode from "../CustomNodes/CustomNode";
import Toggle from "../CustomComponents/Toggle";
import Slider from '@mui/material/Slider';
import Stack from '@mui/material/Stack';

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

  return (
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
         
            <Slider
            size="small"
            value={k}
            valueLabelDisplay="k"
            onChange={(e, v) => setK(parseFloat(v).toFixed(4))}
            min={0}
            max={10}
            step={0.1}
          />


          
          {/* <Toggle label="Smooth" fullWidth={true} value={smooth} onChange={() => setSmooth(!smooth)} /> */}
        </div>
      }
    />
  );
}