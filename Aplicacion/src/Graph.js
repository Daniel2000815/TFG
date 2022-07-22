import React from "react";
import { useCallback, useState } from "react";
import ReactFlow, {
  addEdge,
  applyEdgeChanges,
  applyNodeChanges,
  MarkerType
} from "react-flow-renderer";
import ArrowEdge from "./ArrowEdge.js";
import ShaderNode from "./ShaderNode.js";

import "./styles.css";

const initialNodes = [
  {
    id: "node-1",
    type: "shaderNode",
    position: { x: 0, y: 0 },
    data: { value: 123 }
  },
  {
    id: "node-2",
    type: "shaderNode",
    position: { x: 250, y: 0 },
    data: { value: 1 }
  },
  {
    id: "node-3",
    type: "shaderNode",
    position: { x: 250, y: -300},
    data: { value: 1 }
  }
];

const initialEdges = [
  {
    id: "e1-2",
    type: "arrowEdge",
    source: "node-1",
    target: "node-2",
    markerEnd:{
      type: MarkerType.ArrowClosed,
    },
    animated: true

  }
];

const nodeTypes = { shaderNode: ShaderNode };
// const edgeTypes = { arrowEdge: ArrowEdge };

export default function Graph() {
  const [nodes, setNodes] = useState(initialNodes);
  const [edges, setEdges] = useState(initialEdges);

  const onNodesChange = useCallback(
    (changes) => setNodes((nds) => applyNodeChanges(changes, nds)),
    [setNodes]
  );
  const onEdgesChange = useCallback(
    (changes) => setEdges((eds) => applyEdgeChanges(changes, eds)),
    [setEdges]
  );
  const onConnect = useCallback(
    (connection) => {
      console.log(connection);
      setEdges((eds) => addEdge({...connection, animated: true, markerEnd:{
        type: MarkerType.ArrowClosed,
      }}, eds))
    },
    [setEdges]
  );

  return (
    <div style={{height: "100vh"}}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        nodeTypes={nodeTypes}
        fitView
      />
    </div>
  );
}
