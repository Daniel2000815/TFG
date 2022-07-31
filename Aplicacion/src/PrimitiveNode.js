import React from "react";
import Shader from "./Shader.js";
import { InputNumber, InputGroup } from "rsuite";
import Box from "@mui/material/Box";
import FilledInput from "@mui/material/FilledInput";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import FormHelperText from "@mui/material/FormHelperText";
import Input from "@mui/material/Input";
import InputLabel from "@mui/material/InputLabel";
import OutlinedInput from "@mui/material/OutlinedInput";
import { Handle } from "react-flow-renderer";
import { fs } from "./fragmentShader.js";
import { useEffect } from "react";
import Button from "@mui/material/Button";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import FloatInput from "./FloatInput.js";

const Primitives = {
  Sphere: "Sphere",
  Box: "Box",
};

function Dropdown(props) {
  const [open, setOpen] = React.useState(false);

  return (
    <FormControl onClick={() => setOpen(!open)} sx={{ m: 1, minWidth: 80 }}>
      <InputLabel id="demo-simple-select-autowidth-label">Primitive</InputLabel>
      <Select
        value={props.primitive}
        onChange={(ev) => props.onChange(ev.target.value)}
        autoWidth
        open={open}
        label="Primitive"
      >
        <MenuItem value={Primitives.Sphere}>Sphere</MenuItem>
        <MenuItem value={Primitives.Box}>Box</MenuItem>
      </Select>
    </FormControl>
  );
}
export default function PrimitiveNode({ data, id }) {
  const [primitive, setPrimitive] = React.useState(Primitives.Sphere);
  const [sdf, setSdf] = React.useState(data.sdf);
  const [showCanvas, setShowCanvas] = React.useState(true);
  const [input1, setInput1] = React.useState(1.0);
  const [input2, setInput2] = React.useState(1.0);
  const [input3, setInput3] = React.useState(1.0);

  const handleChange = (newPrimitive, newSdf) => {
    if (newPrimitive == Primitives.Sphere) {
      console.log("YES");
    }
    setPrimitive(newPrimitive);
    setSdf(newSdf);
  };

  useEffect(() => {
    setPrimitive(Primitives.Box);
  }, []);

  useEffect(() => {
    console.log("EFE");
    data.onChangeSdf(id, sdf);
  }, [sdf]);

  useEffect(() => {
    console.log("ASASAS1212");
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

      <Dropdown value={primitive} onChange={setPrimitive} items={["sphere", "box"]} label="Primitives"/> 
      <FloatInput val={input1} handleChange={setInput1} label="Radius" />
      {input1}
      {id}
      {data.sdf}

      {/* INPUT */}
      <div className="custom-node-subheader custom-node-subheader__inputs">
        <div className="custom-node-port-in">{"Inputs"}</div>
        <div className="custom-node-port custom-node-port-in">
          label
          <Handle
            className="circle-port circle-port-left"
            type="target"
            target="0"
            id={0}
            position="left"
            onConnect={(params) => console.log("handle onConnect", params)}
          />
        </div>
      </div>

      {/* OUTPUT */}
      
      <div style={{display:"flex"}}>
        <div style={{textAlign:"left", flexGrow:"1"}}>
          <div style={{display:"flex", flexDirection:"column"}}>
            <div style={{flexGrow:"1"}}>inputs</div>
            <div style={{flexGrow:"1"}}>i1</div>
            <div style={{flexGrow:"1"}}>i2</div>
            <div style={{flexGrow:"1"}}>i3</div>
          </div>
        </div>

        <div style={{textAlign:"right", flexGrow:"1"}}>
          <div style={{display:"flex", flexDirection:"column"}}>
            <div style={{flexGrow:"1"}}>out</div>
            <div style={{flexGrow:"1"}}>
            <Handle
            className="circle-port"
            type="source"
            id={0}
            position="right"
          />
            </div>
          </div>
        </div>
      </div>

      <div className="custom-node-subheader custom-node-subheader__output">
      
        <div className="custom-node-port-out">{"Outputs"}</div>
        <div className="custom-node-port custom-node-port-out">
          label
          <Handle
            className="circle-port circle-port-right"
            type="source"
            id={0}
            position="right"
          />
        </div>
      </div>

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
