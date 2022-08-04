import React from "react";
import { Handle } from "react-flow-renderer";

export default function CustomHandle(props) {
  return (
    <>
    {props.type === "source" ?
        <Handle
        type="source"
        id={props.id}
        style={{ ...props.style, width: "12px", height: "12px" }}
        position="bottom"
        onConnect={(params) => props.onConnect(params)}
        />
        :
        <Handle
        type="target"
        id={props.id ? props.id : "0"}
        style={{ ...props.style, width: "12px", height: "12px" }}
        position="top"
        onConnect={(params) => props.onConnect(params)}
        />
    }
    </>
  );
}
