import React, { useEffect } from "react";
import CustomNode from "./CustomNode";

const BooleanOperations = {
    Union: "Union",
    Difference: "Difference",
    Intersection: "Intersection",
  };
  
  export default function BooleanNode({ data, id }) {
    const [operation, setOperation] = React.useState(BooleanOperations.Union);
    const [sdf, setSdf] = React.useState("");
  
    useEffect(() => {
      console.log(
        `SE HAN MODIFICADO LOS SDF EN NODO BOOLEANO. AHORA HAY ${
          Object.keys(data.inputs).length
        }`
      );
      const inputs = `${Object.keys(data.inputs)
        .map((key) => `${data.inputs[key]}`)
        .join(", ")}`;
      console.log(inputs);
      if (operation === BooleanOperations.Union) setSdf(`min(${inputs})`);
      else if (operation === BooleanOperations.Intersection)
        setSdf(`max(${inputs})`);
      else if (operation === BooleanOperations.Difference)
        setSdf(`max(-${inputs})`);
    }, [data, operation]);
  
    return (
      <CustomNode
      title={"!Boolean Operator"}
        id={id}
        data={data}
        dropdownOptions={Object.values(BooleanOperations)}
        onChangeOption={setOperation}
        sdf={sdf}
      />
    );
  }