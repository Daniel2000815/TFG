import React, { useState } from 'react';

import { useEffect } from 'react';
import Ratio from 'react-ratio';
import ShadertoyReact from 'shadertoy-react';
import { defaultShader } from '../ShaderStuff/defaultShader';
import ReactScrollWheelHandler from 'react-scroll-wheel-handler';
import { fs } from '../ShaderStuff/sdfShader';
import usePrimitivesHook from '../primitivesHook';
import { ErrorBoundary } from 'react-error-boundary';
import { borderColor } from '@mui/system';


function ErrorFallback({ error, resetErrorBoundary }) {
  return (
    <div role="alert">
      <p>Something went wrong:</p>
      <pre>{error.message}</pre>
      <button onClick={resetErrorBoundary}>Try again</button>
    </div>
  );
}

const myErrorHandler = (error, info) => {
  // Do something with the error
  // E.g. log to an error logging client here
  console.log("ERROR");
}


function Shader(props) {
  const [primitivesCode] = usePrimitivesHook();
  const [zoom, setZoom] = useState(1.5);
  const [explode, setExplode] = React.useState(false);
  const zoomIncrement = 0.5;

  const [dragging, setDragging] = useState(false);
  const [draggingLastPos, setDraggingLastPos] = useState([0,0]);
  const [mousePos, setMousePos] = useState([0,0]);
  const [mouseDrag, setMouseDrag] = useState([0.0,0.0]);
  const [angle, setAngle] = useState([10,0]);

  useEffect(() => {}, [props.shader, props.uniforms, primitivesCode]);

  const handleMouseMove = (e) => {
    let rect = e.currentTarget.getBoundingClientRect();
    let x = (e.clientX - rect.left) / rect.width;
    let y = (e.clientY - rect.top) / rect.height;

    setMousePos([x,y]);

    if(dragging){
      let difX = x-draggingLastPos[0];
      let difY = y-draggingLastPos[1];

      setAngle([angle[0]+difX, angle[1]+difY]);
      setDraggingLastPos(mousePos);
      console.log("ANGLE: ", [angle[0]+difX, angle[1]+difY]);
    }
  };

  const handleMouseDown = (e) => {
    setDragging(true);
    setDraggingLastPos(mousePos);
  };

  const handleMouseUp = (e) => {
    setDragging(false);
  };

  const handleMouseLeave = (e) => {
    setDragging(false);
  };

  return (
    <div style={{...props.style, borderColor:"red"}} onMouseMove={handleMouseMove} onMouseDown={handleMouseDown} onMouseUp={handleMouseUp} onMouseLeave={handleMouseLeave}>
      <ReactScrollWheelHandler
        timeout="0"
        wheelConfig={[100, 1000, 0.05]}
        preventScroll="true"
        upHandler={(e) => setZoom(zoom + zoomIncrement)}
        downHandler={(e) => setZoom(zoom - zoomIncrement)}
      >
          <ErrorBoundary
        FallbackComponent={ErrorFallback}
        onReset={() => setExplode(false)}
        resetKeys={[explode]}
      >
        {mouseDrag}
        {angle[0]}, {angle[1]}
            <ShadertoyReact
              fs={props.sdf ? fs(props.sdf, primitivesCode) : defaultShader()}
              key={props.sdf+primitivesCode}
              uniforms={{
                ...props.uniforms,
                u_zoom: { type: '1f', value: zoom },
                u_specular: { type: '3fv', value: [1.0, 0.0, 1.0] },
                u_diffuse: { type: '3fv', value: [1.0, 0.0, 0.0] },
                u_ambient: { type: '3fv', value: [0.2, 0.2, 0.2] },
                u_smoothness: { type: '1f', value: 10.0 },
                u_cameraAng: {type: '2fv', value: angle}
              }}
            />
            </ErrorBoundary>
      </ReactScrollWheelHandler>
    </div>
  );
}

export default React.memo(Shader);