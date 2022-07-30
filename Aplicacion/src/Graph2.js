import React, { createContext, useContext, useEffect, useState } from "react";
import ReactFlow, {
  getSmoothStepPath,
  getMarkerEnd,
  getEdgeCenter,
  removeElements,
  addEdge
} from "react-flow-renderer";

import "./styles.css";

let id = 2;

const getId = () => {
  return `addednode_${id++}`;
};
const CustomContext = createContext();

export default function Graph2() {
  const [reactFlowInstance, setReactFlowInstance] = useState(null);
  
  const onElementsRemove = (elementsToRemove) =>
    setElements((els) => {
        setElements(els.filter(x => !elementsToRemove.includes(x)));
    });
    
  const onConnect = (params) => {
    setElements((els) => addEdge(params, els));
  };

  const onAdd = (edgeId) => {
    console.log(elements);

    const edge = elements.find((element) => element.id === edgeId);
    if (!edge) return;
    const source = elements.find((element) => element.id === edge.source);
    const target = elements.find((element) => element.id === edge.target);
    const position = {
      x: (source.position.x + target.position.x) / 2,
      y: (source.position.y + target.position.y) / 2
    };
    const newNode = {
      id: getId(),
      data: { label: "Added node" },
      position
    };

    setElements((els) => els.concat(newNode));

    onElementsRemove([edge]);
    const sourceToNewNodeEdge = {
      id: `edge-${source.id}-${newNode.id}`,
      source: source.id,
      target: newNode.id,
      type: "buttonedge",
      data: {
        onEdgeClick: () => onAdd(`edge-${source.id}-${newNode.id}`)
      }
    };
    const newNodeToTargetEdge = {
      id: `edge-${newNode.id}-${target.id}`,
      source: newNode.id,
      target: target.id,
      type: "buttonedge",
      data: {
        onEdgeClick: () => onAdd(`edge-${newNode.id}-${target.id}`)
      }
    };

    onConnect(sourceToNewNodeEdge);
    onConnect(newNodeToTargetEdge);
  };

  const initialElements = [
    {
      id: "1",
      type: "input",
      data: { label: "Node 1" },
      position: { x: 250, y: 5 }
    },
    { id: "3", data: { label: "Node 3" }, position: { x: 250, y: 200 } },
    { id: "4", data: { label: "Node 4" }, position: { x: 250, y: 400 } },
    { id: "e1-3", source: "1", target: "3" },
    {
      id: "e3-4",
      source: "3",
      target: "4",
      type: "buttonedge",
      data: { onEdgeClick: () => onAdd("e3-4") }
    }
  ];
  const [elements, setElements] = useState();

  const onLoad = (rf) => {
    setReactFlowInstance(rf);
  };

  useEffect(() => {
    setElements(initialElements);
  }, []);
  
  useEffect(() => {
    if (reactFlowInstance && elements.length) {
      reactFlowInstance.fitView();
    }
  }, [reactFlowInstance, elements]);

  useEffect(() => {
    console.log("updated", elements);
  }, [elements]);

  return (
    <CustomContext.Provider value={onAdd}>
      <div style={{ height: "100vh", width: "100vw" }} className="App">
        <ReactFlow
          elements={elements}
          onLoad={onLoad}
          edgeTypes={{ buttonedge: CustomEdge }}
        />
      </div>
    </CustomContext.Provider>
  );
}

export function CustomEdge({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  style = {},
  data,
  arrowHeadType,
  markerEndId
}) {
  const edgePath = getSmoothStepPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition
  });
  const markerEnd = getMarkerEnd(arrowHeadType, markerEndId);
  const [edgeCenterX, edgeCenterY] = getEdgeCenter({
    sourceX,
    sourceY,
    targetX,
    targetY
  });
  const onAdd = useContext(CustomContext);
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
        width={40}
        height={40}
        x={edgeCenterX - 40 / 2}
        y={edgeCenterY - 40 / 2}
        className="edgebutton-foreignobject"
        requiredExtensions="http://www.w3.org/1999/xhtml"
      >
        <div className="edgebutton-wrapper flex justify-center items-center h-10 w-10">
          <button
            className="edgebutton rounded-full bg-primaryLight h-6 w-6"
            onClick={() => onAdd(id)}
          >
            +
          </button>
        </div>
      </foreignObject>
    </>
  );
}
