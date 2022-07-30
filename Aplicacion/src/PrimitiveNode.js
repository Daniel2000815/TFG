import React from "react";
import Shader from "./Shader.js";
import { Dropdown } from "rsuite";

import {
  Handle
} from "react-flow-renderer";
import { fs } from "./fragmentShader.js";
import { useEffect } from "react";
import { IconButton } from 'rsuite';
import ArrowDownLineIcon from '@rsuite/icons/ArrowDownLine';


const Primitives = {
	Sphere: "Sphere",
	Box:   "Box"
}

export default function PrimitiveNode({ data, id }) {
  const [primitive, setPrimitive] = React.useState(Primitives.Sphere);
  const [sdf, setSdf] = React.useState(data.sdf);
  const [showCanvas, setShowCanvas] = React.useState(true);

  const handleChange = (newPrimitive, newSdf) => {
    setPrimitive(newPrimitive);
    setSdf(newSdf);
  }

  useEffect(() => {
    console.log("EFE");
    data.onChangeSdf(id, sdf);
  }, [sdf]);

  return (
    <div className="custom-node">
      <div className="custom-node-header">Primitive</div>
      <Dropdown style={{width:"100%"}} title={primitive}>
        <Dropdown.Item onSelect={()=>handleChange(Primitives.Sphere, "sphere(p, 1.0)")}>Sphere</Dropdown.Item>
        <Dropdown.Item onSelect={()=>handleChange(Primitives.Box, "box(p, vec3(1.0, 1.0, 1.0))")}>Box</Dropdown.Item>
      </Dropdown>
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
            onConnect={(params) => console.log('handle onConnect', params)}
          />
        </div>
      </div>

      {/* OUTPUT */}
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

    {showCanvas ?
      <Shader
        shader={fs(sdf)}
        uniforms={{ color: { type: "3fv", value: [1.0, 1.0, 0.0] } }}
        style={{ margin: "10px" }}
      />
      :
      null
    }

      <div className="custom-node-creater">
        <IconButton onClick={()=>setShowCanvas(!showCanvas)} placement='right' icon={<ArrowDownLineIcon/>} block />
        </div>
      

      
    </div>
  );
}
