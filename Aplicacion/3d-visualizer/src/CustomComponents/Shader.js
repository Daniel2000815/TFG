import React, { useState } from 'react';

import { useEffect } from 'react';
import Ratio from 'react-ratio';
import ShadertoyReact from 'shadertoy-react';
import { defaultShader } from '../ShaderStuff/defaultShader';
import ReactScrollWheelHandler from 'react-scroll-wheel-handler';
import { fs } from '../ShaderStuff/sdfShader';
import usePrimitivesHook from '../Utils/primitivesHook';
import { ErrorBoundary } from 'react-error-boundary';
import { borderColor } from '@mui/system';
import { defaultMaterial } from '../Defaults/defaultMaterial';


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
  const [draggingLastPos, setDraggingLastPos] = useState([0, 0]);
  const [mousePos, setMousePos] = useState([0, 0]);
  const [mouseDrag, setMouseDrag] = useState([0.0, 0.0]);
  const [angle, setAngle] = useState([10, 0]);
  const [material, setMaterial] = useState(defaultMaterial);

  const [oldProps, setOldProps] = useState();
  useEffect(() => { }, [props.shader, props.uniforms, primitivesCode]);
  
  useEffect(()=>{
    if(props.material)
      setMaterial(props.material);
  }, [props.material])

  useEffect(()=>{
    console.log("SHADER RE-RENDER!!");
    console.log("NEW", props);
    console.log("OLD", oldProps);
    setOldProps(props);
  }, [props])

  const handleMouseMove = (e) => {
    let rect = e.currentTarget.getBoundingClientRect();
    let x = (e.clientX - rect.left) / rect.width;
    let y = (e.clientY - rect.top) / rect.height;

    setMousePos([x, y]);

    if (dragging) {
      let difX = x - draggingLastPos[0];
      let difY = y - draggingLastPos[1];

      setAngle([angle[0] + difX, angle[1] + difY]);
      setDraggingLastPos(mousePos);
      console.log("ANGLE: ", [angle[0] + difX, angle[1] + difY]);
    }
  };

  const handleMouseDown = (e) => {
    console.log(e);

    if (e.button === 0) { //left click
      setDragging(true);
      setDraggingLastPos(mousePos);
    }
    else if (e.button === 2) {  // right click


    }
  };

  const handleMouseUp = (e) => {
    setDragging(false);
  };

  const handleMouseLeave = (e) => {
    setDragging(false);
  };

  return (
    <div style={{ ...props.style, borderColor: "red" }} onMouseMove={handleMouseMove} onMouseDown={handleMouseDown} onMouseUp={handleMouseUp} onMouseLeave={handleMouseLeave}>
      <ReactScrollWheelHandler
        timeout={0}
        wheelConfig={[100, 1000, 0.05]}
        preventScroll="true"
        upHandler={(e) => setZoom(zoom + zoomIncrement)}
        downHandler={(e) => setZoom(zoom - zoomIncrement)}
        disableSwipeWithMouse={true}
      >
        <ErrorBoundary
          FallbackComponent={ErrorFallback}
          onReset={() => setExplode(false)}
          resetKeys={[explode]}
        >
          <ShadertoyReact
            fs={props.sdf ? fs(props.sdf, primitivesCode.concat(props.primitives)) : defaultShader()}
            key={props.sdf + primitivesCode + props.primitives}
            uniforms={{
              ...props.uniforms,
              u_zoom: { type: '1f', value: zoom },
              u_specular: { type: '3fv', value: material.specular },
              u_diffuse: { type: '3fv', value: material.diffuse },
              u_ambient: { type: '3fv', value: material.ambient },
              u_smoothness: { type: '1f', value: material.smoothness },
              u_cameraAng: { type: '2fv', value: angle },
            }}
          />
        </ErrorBoundary>
      </ReactScrollWheelHandler>
    </div>);


}

export default React.memo(Shader);