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
import ButtonEdge from "./ButtonEdge";

import "./styles.css";
import { GraphProvider } from "./GraphContext.js";

const nodeTypes = { primitiveNode: PrimitiveNode, booleanNode: BooleanNode };
const edgeTypes = { buttonEdge: ButtonEdge };

const initialNodes = [
  
];

const initialEdges = [];

const onInit = (reactFlowInstance) =>
  console.log("flow loaded:", reactFlowInstance);

export default function Graph() {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [id, setId] = React.useState(3);

  const updateNodeSdf = (id, newSdf, parent) => {
    console.log("ACTUALIZADONDO SDF DE " + id);
   var foundNode = null;
  
  
   setNodes((nds) =>
      nds.map((node) => {
        if (node.id === id) {
          foundNode = node;
          console.log("!s");
          console.log(foundNode);
          var newSdfs = node.data.sdfs;
          newSdfs[`${parent}`] = newSdf;

          node.data = {
            ...node.data,
            sdfs: newSdfs,
          };


          console.log("HIJOS DE " + id + ": ");
          console.log(node.data.children);
          node.data.children.forEach((child) => {
            console.log("\tACTUALIZANDO HIJO " + child);
            if(child!=id)
              updateNodeSdf(child, newSdf, id);
          });
          
        }

        return node;
      })
    );

    console.log("enco");
    console.log(foundNode);
    
  };

  const connectSdf = (sourceId, targetId, params) => {
    const sourceNode = nodes.find((n) => n.id === sourceId);
    var newSdfs = nodes.find((n) => n.id === targetId).data.sdfs;
    newSdfs[`${sourceId}`] = sourceNode.data.sdf;

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

  const removeEdge = (edgeId) => {
    var newEdges = edges.filter((edge) => {
      console.log(edge.source);
      return edge.id != edgeId;
    });

    setEdges(newEdges);
  };

  const sharedFunctions = {
    updateNodeSdf,
    connectSdf,
  };

  const onConnect = (params) => {
    const sourceNode = nodes.find((n) => n.id === params.source);

    setEdges((eds) =>
      addEdge(
        {
          ...params,
          type: "buttonEdge",
          animated: true,
          markerEnd: { type: MarkerType.Arrow, color: "#000" },
          data: { onRemoveEdge: removeEdge },
        },
        eds
      )
    );

    console.log(params);
    var newChildren = nodes.find((n) => n.id === params.target).data.children;
    // var newChildren = nodes.find((n) => n.id === params.target);

    console.log(newChildren);
    newChildren.push(params.target);

    setNodes((nds) =>
      nds.map((node) => {
        if (node.id === params.source) {
          console.log(`AÑADIDO HIJO ${params.target} A ${params.source}`);
          node.data = {
            ...node.data,
            children: newChildren,
          };
        }

        onNodesChange([node]);
        return node;
      })
    );
  };

  useEffect(() => {
    console.log("NODOS ACTUALIZADOS");
    console.log(nodes);
  }, [nodes]);

  useEffect(() => {
    console.log("NUEVO EDGE:");
    console.log(edges);
  }, [edges]);

  const newPrimitiveNode = (xPos = 0, yPos = 0) => {
    setId(id + 1);
    const nodeId = `node-${id}`;
    return {
      id: nodeId,
      type: "primitiveNode",
      position: { x: xPos, y: yPos },
      data: {
        sdfs: { nodeId: "sphere(1.0)" },
        children: [],
      },
    };
  };

  const newBooleanNode = (xPos = 0, yPos = 0) => {
    setId(id + 1);
    return {
      id: `node-${id}`,
      type: "booleanNode",
      position: { x: xPos, y: yPos },
      data: { sdfs: {}, children: [] },
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
          edgeTypes={edgeTypes}
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
