import React, { useState, memo } from "react";
import { useEffect, useRef } from "react";
import ReactFlow, {
  addEdge,
  Background,
  useNodesState,
  useEdgesState,
  MarkerType,
  Connection,
  BackgroundVariant,
  ReactFlowInstance,
} from "react-flow-renderer";
import PrimitiveNode from "../CustomNodes/PrimitiveNode";
import BooleanNode from "../CustomNodes/BooleanNode";
import DeformNode from "../CustomNodes/DeformNode";
import TransformNode from "../CustomNodes/TransformNode";

import ButtonEdge from "../CustomNodes/ButtonEdge";
import CustomControls from "../CustomComponents/ShaderPage/CustomControls.js";
import "../styles.css";
import { GraphProvider } from "./GraphContext.js";
import CustomContextMenu from "../CustomComponents/ShaderPage/CustomContextMenu.js";
import useLocalStorage from "../Utils/storageHook";
import { Box, Tabs } from "@mui/material";
import { isMobile } from "react-device-detect";
import { ContextMenuTrigger } from "react-contextmenu";

const flowKey = "savedGraph";
const graphNodeTypes = {
  primitiveNode: PrimitiveNode,
  booleanNode: BooleanNode,
  deformNode: DeformNode,
  transformNode: TransformNode,
};
const edgeTypes = { buttonEdge: ButtonEdge };

const initialNodes: NodeData[] = [
  {
    id: "prim-0",
    type: "primitiveNode",
    position: { x: -50, y: -350 },
    dragHandle: " .nodeHeader",
    data: { default: "Cube", inputs: {}, sdf: "", children: [] },
  },
  {
    id: "prim-1",
    type: "primitiveNode",
    dragHandle: ".nodeHeader",
    position: { x: -50, y: 125 },
    data: { inputs: {}, sdf: "", children: [] },
  },
  {
    id: "prim-2",
    type: "primitiveNode",
    position: { x: -50, y: 600 },
    dragHandle: ".nodeHeader",
    data: { inputs: {}, sdf: "", children: [] },
  },
  {
    id: "deform-0",
    type: "deformNode",
    dragHandle: ".nodeHeader",
    position: { x: 200, y: -125 },
    data: { inputs: {}, sdf: "", children: [] },
  },
  {
    id: "transform-0",
    type: "transformNode",
    dragHandle: ".nodeHeader",
    position: { x: 450, y: 150 },
    data: { inputs: {}, sdf: "", children: [] },
  },
  {
    id: "bool-2",
    type: "booleanNode",
    dragHandle: ".nodeHeader",
    position: { x: 200, y: 375 },
    data: { inputs: {}, sdf: "", children: [] },
  },
];

function Graph() {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [rfInstance, setRfInstance] = useState<ReactFlowInstance>();
  const [id, setId] = React.useState(3);
  const [mouseCoor, setMouseCoor] = useState([0, 0]);
  const [storage] = useLocalStorage("user_implicits");
  const reactFlowRef = useRef<HTMLDivElement>(null);

  const updateNodeSdf = (id: string, newSdf: string) => {
    console.log("ACTUALIZADONDO SDF DE " + id);

    var nodesCopy = [...nodes];
    var parent = nodesCopy.find((node) => node.id === id);

    if (parent === undefined) {
      console.error("PARENT IS UNDEFINED");
      return;
    }

    parent.data = {
      ...parent.data,
      sdf: newSdf,
    };

    for (var child of parent.data.children) {
      for (var node of nodesCopy) {
        if (node.id === child) {
          var newInputs = node.data.inputs;
          newInputs[`${id}`] = newSdf;

          node.data = {
            ...node.data,
            inputs: newInputs,
          };
        }
      }
    }

    setNodes(nodesCopy);
  };

  const removeChild = (parent: string, child: string) => {
    setNodes((nds) =>
      nds.map((node) => {
        if (node.id === parent) {
          console.log(`ELIMINANDO HIJO ${child} DE ${parent}`);

          var newChildren = node.data.children;
          newChildren = newChildren.filter((c) => c !== child);

          node.data = {
            ...node.data,
            children: newChildren,
          };
        }
        if (node.id === child) {
          console.log(`ACTUALIZANDO ${child}`);
          var newInputs = node.data.inputs;
          newInputs[`${parent}`] = "";
          node.data = {
            ...node.data,
            inputs: newInputs,
          };
        }

        // onNodesChange([node]); ??
        return node;
      })
    );
  };

  const removeEdge = (edgeId: string) => {
    console.log("WDGES: ");
    console.log(edges);
    const edge = edges.find((e) => e.id === edgeId);

    if (edge === undefined) {
      console.error("TRYING TO DELETE UNEXISTING EDGE");
      return;
    }
    var newEdges = edges.filter((edge: any) => {
      console.log(edge.source);
      return edge.id !== edgeId;
    });

    setEdges(newEdges);
    removeChild(edge.source, edge.target);
  };

  const sharedFunctions = {
    updateNodeSdf,
    removeEdge,
  };

  const onConnect = (params: Connection) => {
    const sourceNode = nodes.find((n) => n.id === params.source);
    if (sourceNode === undefined) {
      console.error("CAN'T FIND CONNECTING NODE");
      return;
    }

    // CREAMOS EDGE
    setEdges((eds: any) =>
      addEdge(
        {
          ...params,
          type: "buttonEdge",
          animated: true,
          markerEnd: { type: MarkerType.Arrow, color: "#000" },
        },
        eds
      )
    );

    // AÑADIMOS HIJO AL PADRE
    if (params.target === null || params.source === null) {
      console.error(`ERROR FINDING SOURCE OR TARGET OF ${sourceNode.id}`);
      return;
    }

    var newChildren = sourceNode.data.children;
    newChildren.push(params.target);

    setNodes((nds) =>
      nds.map((node) => {
        if (node.id === params.source) {
          console.log(`AÑADIENDO HIJO ${params.target} A ${params.source}`);

          // var newChildren = node.data.children;
          // console.log(typeof newChildren);
          // console.log(newChildren);
          // newChildren.push(params.target);
          console.log(newChildren);
          node.data = {
            ...node.data,
            children: newChildren,
          };
        }
        if (node.id === params.target) {
          console.log(`INICIALIZANDO ${params.source}`);
          var newInputs = node.data.inputs;
          newInputs[`${params.source}`] = sourceNode.data.sdf;
          node.data = {
            ...node.data,
            inputs: newInputs,
          };
        }

        // onNodesChange([node]); ??
        return node;
      })
    );

    // INICIAMOS HIJO
  };

  // useEffect(() => {
  //   console.log('NODOS ACTUALIZADOS');
  //   console.log(nodes);
  // }, [nodes]);

  useEffect(() => {
    console.log("NUEVO EDGE:");
    console.log(edges);
  }, [edges]);

  useEffect(() => {
    console.log("ME VUELVO A CARGAR:");
  }, []);

  const onSave = () => {
    if (rfInstance) {
      const flow = rfInstance.toObject();
      console.log("FLOW SAVED:");
      console.log(flow);
      localStorage.setItem(flowKey, JSON.stringify(flow));
    }
  };

  const onLoad = async () => {
    const flow = JSON.parse(localStorage.getItem(flowKey) || "");

    if (flow && flow !== "") {
      console.log("FLOW LOADED:");
      console.log(flow);

      setNodes(flow.nodes || []);
      setEdges(flow.edges || []);
    }
  };

  const newNode = (nodeType: string, xPos = 0, yPos = 0): NodeData => {
    console.log("CREANDO " + nodeType);
    setId(id + 1);
    const nodeId = `node-${id}`;
    return {
      id: nodeId,
      type: nodeType,
      dragHandle: ".nodeHeader",
      position: { x: xPos, y: yPos },
      data: {
        inputs: {},
        sdf: "",
        children: [],
      },
    };
  };

  const createAddNodeMousePos = (nodeType: string) => {
    if (rfInstance === undefined) {
      console.log("RF INSTANCE UDNEFINED");
      return;
    }

    const { x, y } = rfInstance.project({ x: mouseCoor[0], y: mouseCoor[1] });
    let node = newNode(nodeType, x, y);
    nodes.push(node);
    // onNodesChange([node]); ??
  };

  const handleKey = (e: any) => {
    if (rfInstance === undefined) {
      console.log("RF INSTANCE UDNEFINED");
      return;
    }

    let node: NodeData;

    const { x, y } = rfInstance.project({ x: mouseCoor[0], y: mouseCoor[1] });

    if (e.key.toLowerCase() === "p") node = newNode("primitiveNode", x, y);
    else if (e.key.toLowerCase() === "b") node = newNode("booleanNode", x, y);
    else if (e.key.toLowerCase() === "d") node = newNode("deformNode", x, y);
    else if (e.key.toLowerCase() === "t") node = newNode("transformNode", x, y);
    else return;

    if (node) {
      setNodes((nds) => nds.concat(node));
      // nodes.push(node);
      // onNodesChange([node]); // Para actualizar
    }
  };

  const handleMouse = (e: any) => {
    if (reactFlowRef.current === undefined) {
      console.log("RF REF UDNEFINED");
      return;
    }

    const bounds = reactFlowRef?.current?.getBoundingClientRect();

    if (bounds === undefined) return;

    setMouseCoor([e.clientX - bounds.left, e.clientY - bounds.top]);
  };

  return (
    <>
        <Box
          sx={{ height: "100vh" }}
          tabIndex={0}
          onKeyDown={handleKey}
          onMouseMove={handleMouse}
        >
          <GraphProvider value={sharedFunctions}>
            <ReactFlow
              ref={reactFlowRef}
              nodes={nodes}
              edges={edges}
              onNodesChange={onNodesChange}
              onEdgesChange={onEdgesChange}
              onConnect={onConnect}
              // onDisconnect={onDisconnect}

              nodeTypes={graphNodeTypes}
              // edgeTypes={edgeTypes}
              onInit={setRfInstance}
              // onEdgeClick={(ev, edge) =>
              //   setEdges(edges.filter((e) => e.id != edge.id))
              // }
              snapToGrid={false}
              fitView
            >
              <Background
                variant={BackgroundVariant.Lines}
                color="#aaa"
                gap={10}
              />
              <CustomControls save={onSave} load={onLoad} />
            </ReactFlow>
          </GraphProvider>
        </Box>

    </>
  );
}

export default memo(Graph);
