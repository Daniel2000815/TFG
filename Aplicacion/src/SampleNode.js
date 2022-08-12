import React, { useState } from "react";
import { Button } from "rsuite";
import Shader from "./Shader.js";
import { fs } from "./fragmentShader.js";
import InputVector3 from "./InputVector3.js";
import {InputHandle, OutputHandle} from "./Handles.js";


export default function SampleNode({ data }) {
    const [color, setColor] = useState([1.0, 0.0, 0.0]);
  
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
          <InputVector3 classPrefix="input" onChange={(x,y,z) => console.log("NUEVOS VALORES: " + x + ", " + y + ", " + z)}/>
          <Button appearance="primary" block>
            a
          </Button>
      </div>
    );
  }