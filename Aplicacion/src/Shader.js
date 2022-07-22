import React from "react";

import { useEffect } from "react";
import Ratio from "react-ratio";
import ShadertoyReact from "shadertoy-react";

export default function Shader(props) {
  useEffect(() => {}, [props.shader, props.uniforms]);

  return (
    <div style={props.style}>
      <Ratio ratio={1}>
        <ShadertoyReact
          fs={props.shader}
          key={props.shader}
          uniforms={props.uniforms}
        />
      </Ratio>
    </div>
  );
}
