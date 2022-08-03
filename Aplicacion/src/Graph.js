import React from "react";
import { useCallback, useEffect } from "react";
import ReactFlow, {
  addEdge,
  Background,
  useNodesState,
  useEdgesState,
  MarkerType,
} from "react-flow-renderer";
import PrimitiveNode from "./PrimitiveNode.js";
import BooleanNode from "./BooleanNode.js";

import "./styles.css";
import { GraphProvider } from "./GraphContext.js";

const initialNodes = [
  {
    id: "node-0",
    type: "booleanNode",
    position: { x: 0, y: 0 },
    data: { sdf: "sphere(1.0)" },
  },
  {
    id: "node-1",
    type: "primitiveNode",
    position: { x: 250, y: 0 },
    data: { sdf: "box(1.0, 1.0, 1.0)" },
  },
  {
    id: "node-2",
    type: "primitiveNode",
    position: { x: 250, y: -300 },
    data: { sdf: "" },
  },
];

const initialEdges = [];

const nodeTypes = { primitiveNode: PrimitiveNode, booleanNode: BooleanNode };

const onInit = (reactFlowInstance) =>
  console.log("flow loaded:", reactFlowInstance);

export default function Graph() {
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [id, setId] = React.useState(0);

  const updateNodeSdf = (id, newSdf) => {
    console.log("ACTUALIZADO SDF");
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
  };

  const connectSdf = (sourceId, targetId, params) => {
    const sourceNode = nodes.find(n => n.id===sourceId);
    var newSdfs = nodes.find(n => n.id===targetId).data.sdfs;
    const index = parseInt(params.targetHandle, 10);
    console.log(index);
    newSdfs[index] = sourceNode.data.sdf;
    
    console.log(newSdfs);
    setNodes((nds) =>
      nds.map((node) => {
        if (node.id === targetId) {
          console.log("FOUND");
          node.data = {
            ...node.data,
            sdfs: newSdfs,
          };
        }

        onNodesChange([node]);
        return node;
      })
    );
  };

  const sharedFunctions = {
    updateNodeSdf,
    connectSdf,
  };

  const onConnect = useCallback((params) => {
    const sourceNode = nodes.find((n) => n.id === params.source);

    setEdges((eds) =>
      addEdge(
        {
          ...params,
          animated: true,
          markerEnd: { type: MarkerType.Arrow, color: "#000" },
          data: {},
        },
        eds
      )
    );
  }, []);

  useEffect(() => {
    console.log("NODOS ACTUALIZADOS");
    console.log(nodes);
  }, [nodes]);

  useEffect(() => {
    console.log("NUEVO EDGE:");
    console.log(edges);
  }, [edges]);

  const newPrimitiveNode = () => {
    setId(id + 1);
    return {
      id: `node-${id}`,
      type: "primitiveNode",
      position: { x: 0, y: 0 },
      data: {
        sdf: "sphere(p, 1.0)",
        onChangeSdf: updateNodeSdf,
        onConnectHandle: connectSdf,
      },
    };
  };

  const newBooleanNode = () => {
    setId(id + 1);
    return {
      id: `node-${id}`,
      type: "booleanNode",
      position: { x: 0, y: 0 },
      data: {
        sdfs: ["0", "0"],
      },
    };
  };

  const handleKey = (e) => {
    // SPACE BAR
    if (e.key === "p") {
      const node = newPrimitiveNode();
      nodes.push(node);

      onNodesChange([node]); // Para actualizar
    } else if (e.key === "b") {
      const node = newBooleanNode();
      nodes.push(node);

      onNodesChange([node]); // Para actualizar
    }
  };

  return (
    <div style={{ height: "100vh" }} tabIndex="0" onKeyDown={handleKey}>
      <GraphProvider value={sharedFunctions}>
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          // onDisconnect={onDisconnect}

          nodeTypes={nodeTypes}
          onInit={onInit}
          onEdgeClick={(ev, edge) =>
            setEdges(edges.filter((e) => e.id != edge.id))
          }
          snapToGrid={true}
          fitView
        >
          <Background color="#aaa" gap={10} />
        </ReactFlow>
      </GraphProvider>
    </div>
  );
}
