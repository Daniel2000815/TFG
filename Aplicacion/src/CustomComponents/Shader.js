import React, { useState } from 'react';

import { useEffect } from 'react';
import Ratio from 'react-ratio';
import ShadertoyReact from 'shadertoy-react';
import { defaultShader } from '../ShaderStuff/defaultShader';
import ReactScrollWheelHandler from 'react-scroll-wheel-handler';
import {fs} from '../ShaderStuff/sdfShader';
import usePrimitivesHook
 from '../primitivesHook';
export default function Shader(props) {
  const [primitivesCode, setPrimitivesCode] = usePrimitivesHook();

  useEffect(() => {}, [props.shader, props.uniforms]);

  const [zoom, setZoom] = useState(10.0);
  const zoomIncrement = 0.5;
  return (
    <div style={props.style}>
      <ReactScrollWheelHandler
        timeout="0"
        wheelConfig={[100, 1000, 0.05]}
        preventScroll="true "
        upHandler={(e) => setZoom(zoom + zoomIncrement)}
        downHandler={(e) => setZoom(zoom - zoomIncrement)}
      >
        <Ratio ratio={1} onWheel={(e) => console.log(e)}>
          {primitivesCode}
          <ShadertoyReact
            fs={props.sdf ? fs(props.sdf, primitivesCode) : defaultShader()}
            key={props.sdf}
            uniforms={{
              ...props.uniforms,
              u_zoom:   { type: '1f', value: zoom },
              u_specular: { type: "3fv", value: [1.0, 0.0, 1.0] },
              u_diffuse:  { type: "3fv", value: [1.0, 0.0, 0.0] },
              u_ambient:  { type: "3fv", value: [0.2, 0.2, 0.2] },
              u_smoothness: { type: "1f", value: 10.0 }
            }}
          />
        </Ratio>
      </ReactScrollWheelHandler>
    </div>
  );
}
