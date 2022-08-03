import React, { useEffect } from "react";
import { Handle } from "react-flow-renderer";
import Shader from "./Shader";
import { fs } from "./fragmentShader";
import Dropdown from "./Dropdown";

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
    if(operation===BooleanOperations.Union)
      setOperationSdf(`min(${data.sdfs[0]},${data.sdfs[1]})`)
  }, [data]);

  return (
    <div className="custom-node">
      <div className="custom-node-header">Boolean</div>
      {operationSdf}
      <Dropdown
        value={operation}
        onChange={setOperation}
        items={[
          BooleanOperations.Union,
          BooleanOperations.Difference,
          BooleanOperations.Intersection,
        ]}
        label="Operation"
      />

      <Handle
        type="target"
        id={"0"}
        style={{ left: "30%" }}
        position="top"
        onConnect={(params) => console.log("handle ss", params)}
      />
      <Handle
        type="target"
        id={"1"}
        style={{ left: "60%" }}
        position="top"
        onConnect={(params) =>
          data.updateBooleanPrimitive(params.source, params.target)
        }
      />
      <Handle
        type="source"
        id={2}
        style={{ left: "50%" }}
        position="bottom"
        onConnect={(params) => console.log("handle onsConnect", params)}
      />

      <Shader
        shader={fs(`${operationSdf}`)}
        uniforms={{ color: { type: "3fv", value: [1.0, 1.0, 0.0] } }}
        style={{ margin: "10px" }}
      />
    </div>
  );
}
