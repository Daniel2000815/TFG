import React from "react";
import ShaderNode from "./ShaderNode";

export default function TestNode({ data, id }) {
    function Content(){
        return(<p>CONTENIDO</p>);
    };

    return (
        <ShaderNode data={data} id={id} computeSdf={()=>console.log("compute")} content={<Content/>}/>
    );
}