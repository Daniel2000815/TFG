import React, { useCallback, useState } from "react";
import {Handle} from "react-flow-renderer";
import { Button } from "rsuite";
import Shader from "./Shader.js";
import { fs } from "./fragmentShader.js";

function InputHandle(){
   return ( 
    <Handle
        type="target"
        position="left"
        id="a"
        className="custom-handle"
        isConnectable={true}
        onConnect={(params) => console.log('handle onConnect', params)}
    />
   );
}

function OutputHandle(){
    return ( 
     <Handle
         type="source"
         position="right"
         id="a"
         className="custom-handle"
         isConnectable={true}
     />
    );
}

export default function ShaderNode({ data }) {
    const [color, setColor] = useState([1.0, 0.0, 0.0]);
  
    const onChange = useCallback((evt) => {
      console.log(evt.target.value);
    }, []);
  
    return (
      <div className="custom-node">
        <div className="custom-node-header">Ejemplo:</div>
        <div>
          <InputHandle/>
        </div>
        <div>
          <OutputHandle/>
        </div>
        <Button
          onClick={() => setColor([Math.random(), Math.random(), Math.random()])}
          appearance="primary"
        >
          Change Color
        </Button>
        <Shader
          shader={fs()}
          uniforms={{ color: { type: "3fv", value: color } }}
          style={{ margin: "10px" }}
        />
      </div>
    );
  }