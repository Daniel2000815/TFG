import React, {useContext} from "react";
import Shader from "./Shader.js";
import { Handle } from "react-flow-renderer";
import { fs } from "./fragmentShader.js";
import { useEffect } from "react";
import Button from "@mui/material/Button";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import FloatInput from "./FloatInput.js";
import Dropdown from "./Dropdown";
import GraphContext from "./GraphContext.js";

const Primitives = {
  Sphere: "Sphere",
  Box: "Box",
};

export default function PrimitiveNode({ data, id }) {
  const [primitive, setPrimitive] = React.useState(Primitives.Sphere);
  const [sdf, setSdf] = React.useState(data.sdf);
  const [showCanvas, setShowCanvas] = React.useState(true);
  const [input1, setInput1] = React.useState(1.0);
  const [input2, setInput2] = React.useState(1.0);
  const [input3, setInput3] = React.useState(1.0);

  const sharedFunctions = useContext(GraphContext);

  const handleChange = (newPrimitive, newSdf) => {
    if (newPrimitive == Primitives.Sphere) {
      console.log("YES");
    }
    setPrimitive(newPrimitive);
    setSdf(newSdf);
  };

  useEffect(() => {
    sharedFunctions.updateNodeSdf(id, sdf);
  }, [sdf]);

  useEffect(() => {
    console.log("ACTUALIZADO SDF");
    if (primitive == Primitives.Sphere) {
      setSdf(`sphere(p, ${input1.toFixed(4)})`);
    } else if (primitive == Primitives.Box) {
      setSdf(
        `box(p, vec3(${input1.toFixed(4)}, ${input2.toFixed(
          4
        )}, ${input3.toFixed(4)}))`
      );
    }
  }, [primitive, input1, input2, input3]);

  return (
    <div className="custom-node">
      <div className="custom-node-header">Primitive</div>

      <Dropdown value={primitive} onChange={setPrimitive} items={[Primitives.Sphere, Primitives.Box]} label="Primitives"/> 
      <FloatInput val={input1} handleChange={setInput1} label="Radius" />
      {input1}
      {id}
      {data.sdf}

      <Handle
        type="source"
        id={"0"}
        style={{left:"50%"}}
        position="bottom"
        onConnect={(params) => sharedFunctions.connectSdf(params.source, params.target, params)}
      />

      {showCanvas ? (
        <Shader
          shader={fs(sdf)}
          uniforms={{ color: { type: "3fv", value: [1.0, 1.0, 0.0] } }}
          style={{ margin: "10px" }}
        />
      ) : null}

      <Button
        onClick={() => setShowCanvas(!showCanvas)}
        variant="contained"
        className="custom-node-creater"
        size="small"
        endIcon={
          showCanvas ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />
        }
      >
        {showCanvas ? "Hide canvas" : "Show canvas"}
      </Button>
    </div>
  );
}
