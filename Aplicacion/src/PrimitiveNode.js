import React, {useContext} from "react";
import Shader from "./Shader.js";
import { fs } from "./fragmentShader.js";
import { useEffect } from "react";
import Button from "@mui/material/Button";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import FloatInput from "./FloatInput.js";
import Dropdown from "./Dropdown";
import GraphContext from "./GraphContext.js";
import CustomHandle from "./CustomHandle.js";

const Primitives = {
  Sphere: "Sphere",
  Box: "Box",
  Torus: "Torus",
  Cylinder: "Cylinder"
};

export default function PrimitiveNode({ data, id }) {
  const [primitive, setPrimitive] = React.useState(Primitives.Sphere);
  const [sdf, setSdf] = React.useState(data.sdf);
  const [showCanvas, setShowCanvas] = React.useState(true);
  const [inputs, setInputs] = React.useState([1.0, 1.0, 1.0]);
  const [inputLabels, setInputLabels] = React.useState(["Radius", "", ""]);
  const [inputsActive, setInputsActive] = React.useState([true, false, false]);

  const sharedFunctions = useContext(GraphContext);

  const handleChange = (newPrimitive, newSdf) => {
    if (newPrimitive == Primitives.Sphere) {
      console.log("YES");
    }
    setPrimitive(newPrimitive);
    setSdf(newSdf);
  };

  useEffect(() => {
  }, [data]);

  useEffect(() => {
    sharedFunctions.updateNodeSdf(id, sdf);
  }, [sdf]);

  useEffect(() => {
    console.log("ACTUALIZADO SDF");
    if (primitive == Primitives.Sphere) {
      setSdf(`sphere(p, ${inputs[0].toFixed(4)})`);
      prepareInputs("radius");
    } 
    else if (primitive == Primitives.Box) {
      setSdf(
        `box(p, vec3(
          ${inputs[0].toFixed(4)}, 
          ${inputs[1].toFixed(4)}, 
          ${inputs[2].toFixed(4)}
          )
        )`
      );
      prepareInputs("sx", "sy", "sz");
    }
    else if (primitive == Primitives.Torus) {
      setSdf(
        `torus(p, vec2(
          ${inputs[0].toFixed(4)}, 
          ${inputs[1].toFixed(4)}
          )
        )`
      );
      prepareInputs("hole", "thickness");
    }
    else if (primitive == Primitives.Cylinder) {
      setSdf(
        `cylinder(p, 
          ${inputs[0].toFixed(4)}, 
          ${inputs[1].toFixed(4)}
        )`
      );
      prepareInputs("height", "radius");
    }
  }, [primitive, inputs]);

  const prepareInputs = (label1, label2="", label3="") =>{
    setInputLabels([label1, label2, label3]);
    setInputsActive([label1, label2, label3]);
  }

  return (
    <div className="custom-node">
      <div className="custom-node-header">Primitive</div>

      <Dropdown value={primitive} onChange={setPrimitive} items={[Primitives.Sphere, Primitives.Box, Primitives.Torus, Primitives.Cylinder]} label="Primitives"/> 
      {inputsActive[0] ? <FloatInput val={inputs[0]} handleChange={(newVal) => setInputs([newVal, inputs[1], inputs[2]])} label={inputLabels[0]} /> : null}
      {inputsActive[1] ? <FloatInput val={inputs[1]} handleChange={(newVal) => setInputs([inputs[0], newVal, inputs[2]])} label={inputLabels[1]} /> : null}
      {inputsActive[2] ? <FloatInput val={inputs[2]} handleChange={(newVal) => setInputs([inputs[0], inputs[1], newVal])} label={inputLabels[2]} /> : null}

      {inputs[0]}
      {id}
      {data.sdf}
      {"CHILDREN: "}
      {data.children}

      <CustomHandle type="source" onConnect={(params) => sharedFunctions.connectSdf(params.source, params.target, params)}/>

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
