import React, { useEffect } from "react";
import { Handle } from "react-flow-renderer";
import Shader from "./Shader";
import { fs } from "./fragmentShader";
import Dropdown from "./Dropdown";
import CustomHandle from "./CustomHandle";

const BooleanOperations = {
  Union: "Union",
  Difference: "Difference",
  Intersection: "Intersection",
};

export default function BooleanNode({ data, id }) {
  const [operation, setOperation] = React.useState(BooleanOperations.Union);
  const [operationSdf, setOperationSdf] = React.useState("");

  useEffect(() => {
    console.log(`SE HAN MODIFICADO LOS SDF EN NODO BOOLEANO. AHORA HAY ${data.sdfs.length}`);
    const inputs = `${Object.keys(data.sdfs).map(key => `${data.sdfs[key]}`).join(', ')}`;

    if(operation===BooleanOperations.Union)
      setOperationSdf(`min(${inputs})`)
    else if(operation===BooleanOperations.Intersection)
      setOperationSdf(`max(${inputs})`)
    else if(operation===BooleanOperations.Difference)
      setOperationSdf(`max(-${inputs})`)

  }, [data, operation]);

  return (
    <div className="custom-node">
      <div className="custom-node-header">Boolean</div>
      <p>{`ID: ${id}`}</p>
      <p>CHILDREN: {data.children}</p>
      <p>SDF: {operationSdf}</p>

      <Dropdown
        value={operation}
        onChange={setOperation}
        items={Object.values(BooleanOperations)}
        label="Operation"
      />

      <CustomHandle id={"0"} type="target" onConnect={(params) => console.log("handle ss", params)} style={{ left: "30%" }}/>
      <CustomHandle id={"1"} type="target" onConnect={(params) => data.updateBooleanPrimitive(params.source, params.target)} style={{ left: "60%" }}/>
      <CustomHandle id={"2"} type="source" onConnect={(params) => console.log("handle onsConnect", params)} style={{ left: "50%" }}/>

      <Shader
        shader={fs(`${operationSdf}`)}
        uniforms={{ color: { type: "3fv", value: [1.0, 1.0, 0.0] } }}
        style={{ margin: "10px" }}
      />
    </div>
  );
}
