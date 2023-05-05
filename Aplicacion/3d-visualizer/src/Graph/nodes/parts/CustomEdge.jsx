import React from "react";
import { getBezierPath } from "reactflow";
import { shallow } from "zustand/shallow";
import { tw } from "twind";
import { useStore } from "../../../store";
import "./edgeStyles.css";

const foreignObjectSize = 40;

const selector = (id) => (store) => ({
  deleteEdge: (source, target) => store.deleteEdge(id, source, target),
});

export function CustomEdge({
  id,
  source,
  target,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  style = {},
  markerEnd,
}) {
  const [edgePath, labelX, labelY] = getBezierPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
  });

  const { deleteEdge } = useStore(selector(id), shallow);

  return (
    <>
      <path
        id={id}
        style={style}
        className="react-flow__edge-path"
        d={edgePath}
        markerEnd={markerEnd}
      />
      <foreignObject
        width={foreignObjectSize}
        height={foreignObjectSize}
        x={labelX - foreignObjectSize / 2}
        y={labelY - foreignObjectSize / 2}
        className="edgebutton-foreignobject"
        requiredExtensions="http://www.w3.org/1999/xhtml"
      >
        <div>
          <button
            className="edgebutton"
            onClick={(e) => {
              e.stopPropagation();
              deleteEdge(source, target);
            }}
          >
            ×
          </button>
        </div>
      </foreignObject>
    </>
  );
}
