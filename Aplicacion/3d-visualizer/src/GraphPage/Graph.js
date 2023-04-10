import React, { useState, memo } from "react";
import { useEffect, useRef } from "react";

import ReactFlow, {
  addEdge,
  Background,
  useNodesState,
  useEdgesState,
  MarkerType,
} from "react-flow-renderer";
import { Container, Row, Col, Button, Modal, Text, Input } from "@nextui-org/react";
import PrimitiveNode from "../CustomNodes/PrimitiveNode.tsx";
import BooleanNode from "../CustomNodes/BooleanNode";
import DeformNode from "../CustomNodes/DeformNode";
import TransformNode from "../CustomNodes/TransformNode";
import { useResizeDetector } from "react-resize-detector";
import Shader from "../CustomComponents/ShaderGL";
import ButtonEdge from "../CustomNodes/ButtonEdge";
import CustomControls from "../CustomComponents/ShaderPage/CustomControls.js";
import "../styles.css";
import { GraphProvider } from "./GraphContext.js";
import CustomContextMenu from "../CustomComponents/ShaderPage/CustomContextMenu.js";
import useLocalStorage from "../Utils/storageHook";
import { Box, Tabs } from "@mui/material";
import { isMobile } from "react-device-detect";
import { SizeMe } from "react-sizeme";
import { CiDatabase } from "react-icons/ci";
import SaveSurfaceDialog from "../CustomComponents/ShaderPage/SaveSurfaceDialog";
import { ContextMenuTrigger } from "react-contextmenu";

var lodash = require("lodash");

const flowKey = "savedGraph";
const graphNodeTypes = {
  primitiveNode: PrimitiveNode,
  booleanNode: BooleanNode,
  deformNode: DeformNode,
  transformNode: TransformNode,
};
const edgeTypes = { buttonEdge: ButtonEdge };

const initialNodes = [
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
  const [rfInstance, setRfInstance] = useState(null);
  const [id, setId] = React.useState(3);
  const [mouseCoor, setMouseCoor] = useState([0, 0]);
  
  const reactFlowRef = useRef(null);
  const [finalSdf, setFinalSdf] = useState("");
  const [saveModalVisible, setSaveModalVisible] = useState(false);
  const updateNodeSdf = (id, newSdf) => {
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

  const removeChild = (parent, child) => {
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

  const removeEdge = (edgeId) => {
    console.log("WDGES: ");
    console.log(edges);
    const edge = edges.find((e) => e.id === edgeId);

    if (edge === undefined) {
      console.error("TRYING TO DELETE UNEXISTING EDGE");
      return;
    }

    var newEdges = [];
    
      let targetNode = nodes.find(n=>n.id === edge.target);
      
      setNodes((nds)=>nds.map((node)=>{
        // eliminar datos en el hijo
        if(node.id === targetNode.id){  
          console.log("OLD DATA: ", node.data.inputs);
          const {[edge.source]: removedEdge, ...newInput} = node.data.inputs;    
          node.data = {
            ...node.data,
            inputs: newInput
          };
          console.log("NEW DATA: ", newInput);
          
        }
        // eliminar datos en el padre
        else if(node.id === edge.source){
          var newChildren = node.data.children;
          newChildren = newChildren.filter((c) => c !== edge.target);

          node.data = {
            ...node.data,
            children: newChildren,
          };          
        }
        
        return node;
        
      }));

    if(edge.target.includes("bool")){
      let found = false;
      
      const otherInputEdges = edges.filter((e)=>e.target === edge.target);
      newEdges = edges.filter((e)=>e.target !== edge.target);

      let length = otherInputEdges.length;

      for(let i=0; i<length; i++){
        if(otherInputEdges[i].id === edgeId){
          found = true;
        }

        if(found){
          if(i<length-1){
            var newEdge = otherInputEdges[i];
            newEdge.source = otherInputEdges[i+1].source;
            newEdge.targetHandle = otherInputEdges[i].targetHandle;
            length--;
            newEdges.push(newEdge);
          }
        }
        else{
          newEdges.push(otherInputEdges[i]);
        }        
      }
    }
    else{
      console.log("ELIMINANDO EDGE ", edgeId, " DE ", edges);
      newEdges = edges.filter((edge) => {
        return edge.id !== edgeId;
      });
    }

    setEdges(newEdges);
    // removeChild(edge.source, edge.target);
  };

  const onChangeFinalSdf = (sdf) => {console.log("FINAL",sdf);setFinalSdf(sdf)};

  const sharedFunctions = {
    updateNodeSdf,
    removeEdge,
    onChangeFinalSdf,
  };

  const onConnect = (params) => {
    console.log(params);
    const sourceNode = nodes.find((n) => n.id === params.source);
    const parentNode = nodes.find((n) => n.id === params.target);

    if (sourceNode === undefined) {
      console.error("CAN'T FIND CONNECTING NODE");
      return;
    }

    if(params.source in parentNode.data.inputs && parentNode.data.inputs[params.source]!=="" ){
      console.log("INTENTAS CONECTAR A UN NODA YA CONECTADO");
      return;
    }

    // CREAMOS EDGE
    setEdges((eds) =>
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

  // useEffect(() => {
  //   console.log("NUEVO EDGE:");
  //   console.log(edges);
  // }, [edges]);

  // useEffect(() => {
  //   console.log("ME VUELVO A CARGAR:");
  // }, []);

  // useEffect(() => {
  //   console.log("NODOS ACTUALIZADOS:");
  // }, [nodes]);

  const onSave = () => {
    if (rfInstance) {
      const flow = rfInstance.toObject();
      console.log("FLOW SAVED:");
      console.log(flow);
      localStorage.setItem(flowKey, JSON.stringify(flow));
    }
  };

  const onLoad = async () => {
    const flow = JSON.parse(localStorage.getItem(flowKey));

    if (flow) {
      console.log("FLOW LOADED:");
      console.log(flow);

      setNodes(flow.nodes || []);
      setEdges(flow.edges || []);
    }
  };

  const newNode = (nodeType, xPos = 0, yPos = 0) => {
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

  const createAddNodeMousePos = (nodeType, e) => {
    // if (rfInstance === undefined) {
    //   console.log("RF INSTANCE UDNEFINED");
    //   return;
    // }

    const { x, y } = rfInstance.project({ x: e.clientX, y: e.clientY });
    let node = newNode(nodeType, x, y);
    setNodes((nds) => nds.concat(node));
    // onNodesChange([node]); ??
  };

  const handleKey = (e) => {
    if(saveModalVisible)
      return;
      
    console.log(e);

    let node;

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

  // const handleMouse = (e) => {
  //     // let rect = e.currentTarget.getBoundingClientRect(); muy lento -> resizeDetector
  //     // let x = (e.clientX - width) ;
  //     // let y = (e.clientY - height);

  //   setMouseCoor([e.clientX,e.clientY]);
  // };

  // const handleMouse = React.useCallback(
  //   lodash.throttle((e) => {
  //     const bounds = reactFlowRef.current.getBoundingClientRect();
  //     setMouseCoor([e.clientX - bounds.left, e.clientY - bounds.top]);
  //   }, 500),
  //   []
  // );

  // const handleMouse = (e) => {
  //   const bounds = reactFlowRef.current.getBoundingClientRect();
  //     setMouseCoor([e.clientX - bounds.left, e.clientY - bounds.top]);
  // }

  return (
    <Container fluid xl>
      <Row>
        <Col >
          <ContextMenuTrigger
            id="contextmenu"
            holdToDisplay={isMobile ? 1000 : -1}
          >
            <Box
              sx={{ height: "100vh" }}
              tabIndex={0}
              onKeyDown={handleKey}
              // onMouseMove={handleMouse}
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
                  edgeTypes={edgeTypes}
                  onInit={setRfInstance}
                  // onEdgeClick={(ev, edge) =>
                  //   setEdges(edges.filter((e) => e.id != edge.id))
                  // }
                  snapToGrid={false}
                  fitView
                >
                  <Background variant="lines" color="#aaa" gap={10} />
                  <CustomControls save={onSave} load={onLoad} />
                </ReactFlow>
              </GraphProvider>
            </Box>
          </ContextMenuTrigger>
          <CustomContextMenu newNode={createAddNodeMousePos} />
        </Col>
        <SizeMe >
        {({ size }) => (
        <Col span={4}>
        <Shader
              sdf={finalSdf}
              primitives=""
              style={{ margin: "10px", height: "100%" }}
              width={size.width}
              height={size.width}
              />
              <Button disabled={finalSdf === ""} onPress={()=>setSaveModalVisible(true)} icon={<CiDatabase size={24} fill="currentColor" />} >
        Save
      </Button>
      <SaveSurfaceDialog sdf={finalSdf} visible={saveModalVisible} onClose={()=>setSaveModalVisible(false)} onSubmit={()=>{}}/>
        </Col>)}
        </SizeMe>
      </Row>
    </Container>
  );
}

export default memo(Graph);
