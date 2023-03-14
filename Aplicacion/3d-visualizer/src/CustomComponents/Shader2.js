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

  useEffect(() => {}, [props.shader, props.uniforms, primitivesCode]);

  const [zoom, setZoom] = useState(1.5);
  const [explode, setExplode] = React.useState(false)

  const zoomIncrement = 0.5;
  return (
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
              }}
            />
  );
}

export default React.memo(Shader);