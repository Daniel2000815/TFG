import React, {useContext} from 'react';
import { getBezierPath, getEdgeCenter } from 'react-flow-renderer';
import GraphContext from "../GraphPage/GraphContext";

import '../styles.css';

const foreignObjectSize = 40;

export default function CustomEdge({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  style = {},
  data,
}) {
  const edgePath = getBezierPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
  });
  const [edgeCenterX, edgeCenterY] = getEdgeCenter({
    sourceX,
    sourceY,
    targetX,
    targetY,
  });

  const [showButton, setShowButton] = React.useState(false);
  const sharedFunctions = useContext(GraphContext);

  return (
    <>
      <path
        id={id}
        style={style}
        className="react-flow__edge-path"
        d={edgePath}
        
      />
      <foreignObject
        width={foreignObjectSize}
        height={foreignObjectSize}
        x={edgeCenterX - foreignObjectSize / 2}
        y={edgeCenterY - foreignObjectSize / 2}
        
        className="edgebutton-foreignobject"
        requiredExtensions="http://www.w3.org/1999/xhtml"
      >
        {true ?
          <body>
            <button className="edgebutton" onClick={() => {console.log("SI: " + id); sharedFunctions.removeEdge(id)}}>
              ×
            </button>
          </body> 
          : 
          null
        }
      </foreignObject>
    </>
  );
}
