import React from "react";
import { Handle } from "react-flow-renderer";

export default function CustomHandle(props) {
  return (
    <>
    {props.type === "source" ?
        <Handle
        type="source"
        id={props.id}
        style={{ ...props.style, width: "12px", height: "12px", marginRight: "-3px" }}
        position="right"
        />
        :
        <Handle
        type="target"
        id={props.id ? props.id : "0"}
        style={{ ...props.style, width: "12px", height: "12px", marginLeft: "-3px" }}
        position="left"
        />
    }
    </>
  );
}
