import React, { useState } from "react";
import { Shaders, Node, GLSL, Visitor, ShaderIdentifier } from "gl-react";
import { Surface } from "gl-react-dom";
// import { useResizeDetector } from 'react-resize-detector';

import { useEffect } from "react";
import { defaultShader } from "../ShaderStuff/defaultShader";
import { fs2 } from "../ShaderStuff/sdfShader";
import usePrimitivesHook from "../Utils/primitivesHook";
import { ErrorBoundary } from "react-error-boundary";
import { borderColor } from "@mui/system";
import { defaultMaterial } from "../Defaults/defaultMaterial";



export default function ShaderGL(props: {sdf: string, primitives: string, width: number|null, height: number|null, onError?: (e:string)=>void, uniforms?: any[], material: Material; style: any }) {
  
  const [zoom, setZoom] = useState(1.5);
  const [explode, setExplode] = React.useState(false);
  const zoomIncrement = 0.5;

  const [dragging, setDragging] = useState(false);
  const [draggingLastPos, setDraggingLastPos] = useState([0, 0]);
  const [mousePos, setMousePos] = useState([0, 0]);
  const [mouseDrag, setMouseDrag] = useState([0.0, 0.0]);
  const [angle, setAngle] = useState([10, 0]);
  const [material, setMaterial] = useState(defaultMaterial);
  const [primitivesCode] = usePrimitivesHook();
  const [compileError, setCompileError] = useState(false);
  const [shader, setShader] = useState<ShaderIdentifier>(CreateShader(props.sdf, props.primitives).helloGL);

  // const { width, height, ref } = useResizeDetector();
  useEffect(() => {
    if (props.material) setMaterial(props.material);
  }, [props.material]);

  useEffect(() => {
    setCompileError(false);
    setShader(CreateShader(props.sdf, props.primitives).helloGL);
  }, [props.sdf, primitivesCode, props.primitives]);

  function CreateShader(sdf: string,primitives: string){
    
  
    return  Shaders.create({
      helloGL: {
        // This is our first fragment shader in GLSL language (OpenGL Shading Language)
        // (GLSL code gets compiled and run on the GPU)
        frag: GLSL`${fs2(sdf, (String)(primitivesCode).concat(primitives))}`,
        // the main() function is called FOR EACH PIXELS
        // the varying uv is a vec2 where x and y respectively varying from 0.0 to 1.0.
        // we set in output the pixel color using the vec4(r,g,b,a) format.
        // see GLSL_ES_Specification_1.0.17
      },
    });
  }

  const handleMouseMove = (e: any) => {
    const clamp = (num: number, min: number, max: number) => Math.min(Math.max(num, min), max);

    let rect = e.currentTarget.getBoundingClientRect();
    let x = (e.clientX - rect.left) / rect.width;
    let y = (e.clientY - rect.top) / rect.height;

    setMousePos([x, y]);

    if (dragging) {
      let difX = x - draggingLastPos[0];
      let difY = y - draggingLastPos[1];
      difX *= 2.0;

      const newAng = [angle[0] + difX, clamp(angle[1] + difY, -1.5,1.5)];
      setAngle(newAng);
      setDraggingLastPos(mousePos);
      console.log("ANGLE: ", [angle[0] + difX, angle[1] + difY]);
    }
  };

  const handleMouseDown = (e: any) => {
    console.log(e);

    if (e.button === 0) {
      //left click
      setDragging(true);
      setDraggingLastPos(mousePos);
    } else if (e.button === 2) {
      // right click
    }
  };

  const handleMouseUp = (e: any) => {
    setDragging(false);
  };

  const handleMouseLeave = (e: any) => {
    setDragging(false);
  };

  const handleScroll = (e: any) => {
    e.preventDefault();
    console.log("SCROLL", e.deltaY);
    if(e.deltaY > 0){
      setZoom(zoom + zoomIncrement);
    }
    else if(zoom > zoomIncrement){
      setZoom(zoom - zoomIncrement)
    }
  }

  const visitor = new Visitor();
  visitor.onSurfaceDrawError = (e: Error) => {
    if(props.onError)
      props.onError(e.message);
    console.log("LOL", e.message);
    setCompileError(true);
    return true;
  };

  visitor.onSurfaceDrawEnd = () => {
    setCompileError(false);
  }

  function Result() {
    if (compileError) {
      return <p>Error</p>;
    }
    return <div
    // ref={ref}
    style={{ ...props.style, height: "100%", width:"100%", borderColor: "red"}}
    onMouseMove={handleMouseMove}
    onMouseDown={handleMouseDown}
    onMouseUp={handleMouseUp}
    onMouseLeave={handleMouseLeave}
    onWheel={handleScroll}
  >
    <Surface visitor={visitor} width={props.width || 100 } height={props.height || 100}>
      <Node
        shader={shader}
        uniforms={{
          u_resolution: [props.width, props.height],
          u_mouse: [0, 0],
          u_specular: material.specular,
          u_diffuse: material.diffuse,
          u_ambient: material.ambient,
          u_smoothness: material.smoothness,
          u_cameraAng: angle,
          u_zoom: zoom
        }}
      />
    </Surface>
  </div>;
  }

  return (
    <Result/>
  );
}