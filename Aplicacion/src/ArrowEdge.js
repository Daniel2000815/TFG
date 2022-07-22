import React from "react";
import {getBezierPath, MarkerType} from "react-flow-renderer";

export default function ArrowEdge({
    id,
    sourceX,
    sourceY,
    targetX,
    targetY,
    sourcePosition,
    targetPosition,
    style = {},
  }) {
    const edgePath = getBezierPath({
      sourceX,
      sourceY,
      sourcePosition,
      targetX,
      targetY,
      targetPosition,
    });
  
    return (
      <>
        <path
          id={id}
          style={style}
          className="react-flow__edge-path"
          d={edgePath}
          markerEnd={{
            type: MarkerType.ArrowClosed,
          }}
          animated= {true}
        />
        
      </>
    );
  }