import React from "react";

import { useEffect } from "react";
import Ratio from "react-ratio";
import ShadertoyReact from "shadertoy-react";
import { defaultShader } from "./defaultShader";

export default function Shader(props) {
  useEffect(() => {}, [props.shader, props.uniforms]);

  return (
    <div style={props.style}>
      <Ratio ratio={1}>
        <ShadertoyReact
          fs={props.shader ? props.shader : defaultShader()}
          key={props.shader}
          uniforms={props.uniforms}
        />
      </Ratio>
    </div>
  );
}
