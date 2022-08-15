import React, {useState} from "react";

import { useEffect } from "react";
import Ratio from "react-ratio";
import ShadertoyReact from "shadertoy-react";
import { defaultShader } from "../ShaderStuff/defaultShader";
import ReactScrollWheelHandler from "react-scroll-wheel-handler";

export default function Shader(props) {
  useEffect(() => {}, [props.shader, props.uniforms]);

  const [zoom, setZoom] = useState(10.0);
  const zoomIncrement = 0.5;
  return (
    <div style={props.style}  >
      <ReactScrollWheelHandler
      timeout="0"
      wheelConfig= {[100, 1000, 0.05]}
      preventScroll="true "
  upHandler={(e) => setZoom(zoom + zoomIncrement)}
  downHandler={(e) => setZoom(zoom - zoomIncrement)}
>
      <Ratio ratio={1} onWheel={(e) => console.log(e)}>
        <ShadertoyReact
          fs={props.shader ? props.shader : defaultShader()}
          key={props.shader}
          uniforms={{
            ...props.uniforms, 
            distance: { type: "1f"  , value: zoom}
          }}
        />
      </Ratio>
      </ReactScrollWheelHandler>
    </div>
  );
}
