import React from "react";
import { useCallback, useEffect } from "react";
import ReactFlow, {
  addEdge,
  Background,
  useNodesState,
  useEdgesState,
  MarkerType
} from "react-flow-renderer";
import ButtonEdge from './ButtonEdge.js';
import PrimitiveNode from "./PrimitiveNode.js";
import BooleanNode from "./BooleanNode.js";

import "./styles.css";

const initialNodes = [
  {
    id: "node-0",
    type: "booleanNode",
    position: { x: 0, y: 0 },
    data: { sdf: "sphere(1.0)" }
  },
  {
    id: "node-1",
    type: "primitiveNode",
    position: { x: 250, y: 0 },
    data: { sdf: "box(1.0, 1.0, 1.0)" }
  },
  {
    id: "node-2",
    type: "primitiveNode",
    position: { x: 250, y: -300},
    data: { sdf: "" }
  }
];

const initialEdges = [

];

const nodeTypes = { primitiveNode: PrimitiveNode, booleanNode: BooleanNode };

const onInit = (reactFlowInstance) => console.log('flow loaded:', reactFlowInstance);

export default function Graph() {
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  // no funciona: borra todos
  const onRemoveEdge = (id) =>{
    console.log(edges);
    setEdges(edges.filter(edge => edge.id == id));
    onEdgesChange(edges);
  }

  const updateNodeSdf = (id, newSdf) =>{
    console.log("ALO");
    setNodes((nds) =>
      nds.map((node) => {
        if (node.id === id) {
          node.data = {
            ...node.data,
            sdf: newSdf,
          };
        }

        return node;
      })
    );
  }

  const onConnect = useCallback(
    
    (params) => setEdges(
      (eds) => addEdge(
        { 
          ...params, 
          animated:true, 
          markerEnd: { type: MarkerType.Arrow, color: '#000' }, 
          data: {} 
        }, 
        eds)
      ),
    []
  );

  useEffect(() => {
    console.log("ASASA");
    console.log(edges);
  }, [edges]);

  const newNode = () =>{
    return {
      id: `node-${nodes.length}`,
      type: "primitiveNode",
      position: { x: 0, y: 0 },
      data: { 
        sdf: "sphere(p, 1.0)",
        onChangeSdf: updateNodeSdf
      }
    }
  }

  const handleKey= (e) => {
    // SPACE BAR
    if (e.key === " ") {
      const node = newNode();
      nodes.push(node);

      onNodesChange([node]);  // Para actualizar
    }

  };

  return (
    <div style={{height: "100vh"}} tabIndex="0" onKeyDown={handleKey}>
      <ReactFlow
        nodes={nodes}
        edges={edges}

        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        // onDisconnect={onDisconnect}

        nodeTypes={nodeTypes}

        onInit={onInit}
        onEdgeClick={(ev, edge)=>setEdges(edges.filter(e => e.id != edge.id))}

        snapToGrid={true}
        fitView
      >
        <Background color="#aaa" gap={10} />
        </ReactFlow>
    </div>
  );
}
