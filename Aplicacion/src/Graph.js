import React, { useState } from 'react';
import { useEffect, useRef } from 'react';
import ReactFlow, {
  addEdge,
  Background,
  useNodesState,
  useEdgesState,
  MarkerType,
  project,
  useReactFlow
} from 'react-flow-renderer';
import PrimitiveNode from './CustomNodes/PrimitiveNode.js';
import BooleanNode from './CustomNodes/BooleanNode.js';
import DeformNode from './CustomNodes/DeformNode.js';
import TransformNode from './CustomNodes/TransformNode.js';

import ButtonEdge from './CustomNodes/ButtonEdge';
import CustomControls from './CustomComponents/CustomControls.js';
import './styles.css';
import { GraphProvider } from './GraphContext.js';
import CustomContextMenu from './CustomComponents/CustomContextMenu.js';
import CustomContextMenu2 from './CustomComponents/CustomContextMenu copy.js';

import { ContextMenu, MenuItem, ContextMenuTrigger } from 'react-contextmenu';


const flowKey = 'savedGraph';
const graphNodeTypes = { primitiveNode: PrimitiveNode, booleanNode: BooleanNode, deformNode: DeformNode, transformNode: TransformNode };
const edgeTypes = { buttonEdge: ButtonEdge };

const initialNodes = [
  {
    id: 'prim-0',
    type: 'primitiveNode',
    position: { x: -50, y: -350 },
    dragHandle: ' .nodeHeader',
    data: { default: 'Cube', inputs: {}, sdf: '', children: [] },
  },
  {
    id: 'prim-1',
    type: 'primitiveNode',
    dragHandle: '.nodeHeader',
    position: { x: -50, y: 125 },
    data: { inputs: {}, sdf: '', children: [] },
  },
  {
    id: 'prim-2',
    type: 'primitiveNode',
    position: { x: -50, y: 600 },
    dragHandle: '.nodeHeader',
    data: { inputs: {}, sdf: '', children: [] },
  },
  {
    id: 'deform-0',
    type: 'deformNode',
    dragHandle: '.nodeHeader',
    position: { x: 200, y: -125 },
    data: { inputs: {}, sdf: '', children: [] },
  },
  {
    id: 'transform-0',
    type: 'transformNode',
    dragHandle: '.nodeHeader',
    position: { x: 450, y: 150 },
    data: { inputs: {}, sdf: '', children: [] },
  },
  {
    id: 'bool-2',
    type: 'booleanNode',
    dragHandle: '.nodeHeader',
    position: { x: 200, y: 375 },
    data: { inputs: {}, sdf: '', children: [] },
  },
];

const onInit = (reactFlowInstance) =>
  console.log('flow loaded:', reactFlowInstance);

export default function Graph() {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [rfInstance, setRfInstance] = useState(null);
  const [id, setId] = React.useState(3);
  const [mouseCoor, setMouseCoor] = useState([0, 0]);

  const reactFlowRef = useRef(null);

  const updateNodeSdf = (id, newSdf, parent) => {
    console.log('ACTUALIZADONDO SDF DE ' + id);
    var nodesCopy = [...nodes];
    var parent = nodesCopy.find((node) => node.id === id);
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
          newChildren = newChildren.filter(function (c) {
            return c.id != child;
          });

          node.data = {
            ...node.data,
            children: newChildren,
          };
        }
        if (node.id === child) {
          console.log(`ACTUALIZANDO ${child}`);
          var newInputs = node.data.inputs;
          newInputs[`${parent}`] = '';
          node.data = {
            ...node.data,
            inputs: newInputs,
          };
        }

        onNodesChange([node]);
        return node;
      })
    );
  };

  const removeEdge = (edgeId) => {
    console.log('WDGES: ');
    console.log(edges);
    const edge = edges.find((e) => e.id === edgeId);

    var newEdges = edges.filter((edge) => {
      console.log(edge.source);
      return edge.id != edgeId;
    });

    setEdges(newEdges);
    removeChild(edge.source, edge.target);
  };

  const sharedFunctions = {
    updateNodeSdf,
    removeEdge,
  };

  const onConnect = (params) => {
    const sourceNode = nodes.find((n) => n.id === params.source);

    // CREAMOS EDGE
    setEdges((eds) =>
      addEdge(
        {
          ...params,
          type: 'buttonEdge',
          animated: true,
          markerEnd: { type: MarkerType.Arrow, color: '#000' },
        },
        eds
      )
    );

    // AÑADIMOS HIJO AL PADRE
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

        onNodesChange([node]);
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
    console.log('NUEVO EDGE:');
    console.log(edges);
  }, [edges]);

  const onSave = () => {
    if (rfInstance) {
      const flow = rfInstance.toObject();
      console.log('FLOW SAVED:');
      console.log(flow);
      localStorage.setItem(flowKey, JSON.stringify(flow));
    }
  };

  const onLoad = async () => {
    const flow = JSON.parse(localStorage.getItem(flowKey));

    if (flow) {
      console.log('FLOW LOADED:');
      console.log(flow);
      const { x = 0, y = 0, zoom = 1 } = flow.viewport;
      setNodes(flow.nodes || []);
      setEdges(flow.edges || []);
    }
  };

  const newNode = (nodeType, xPos = 0, yPos = 0) => {
    console.log('CREANDO ' + nodeType);
    setId(id + 1);
    const nodeId = `node-${id}`;
    return {
      id: nodeId,
      type: nodeType,
      dragHandle: '.nodeHeader',
      position: { x: xPos, y: yPos },
      data: {
        inputs: {},
        sdf: '',
        children: [],
      },
    };
  };

  const createAddNodeMousePos = (nodeType) => {
    const { x, y } = rfInstance.project({ x: mouseCoor[0], y: mouseCoor[1] });
    let node = newNode(nodeType, x, y);
    nodes.push(node);
    onNodesChange([node]);
  };

  const handleKey = (e) => {
    let node = null;

    const { x, y } = rfInstance.project({ x: mouseCoor[0], y: mouseCoor[1] });


    if (e.key.toLowerCase() === 'p') node = newNode('primitiveNode', x, y);
    else if (e.key.toLowerCase() === 'b') node = newNode('booleanNode', x, y);
    else if (e.key.toLowerCase() === 'd') node = newNode('deformNode', x, y);
    else if (e.key.toLowerCase() === 't') node = newNode('transformNode', x, y);

    if (node) {
      nodes.push(node);
      onNodesChange([node]); // Para actualizar
    }

  };

  const handleMouse = (e) => {
    const bounds = reactFlowRef.current.getBoundingClientRect();
    setMouseCoor([e.clientX - bounds.left, e.clientY - bounds.top]);
  };

  return (
    <>
      <ContextMenuTrigger id='contextmenu'>
        <div style={{ height: '100vh' }} tabIndex='0' onKeyDown={handleKey} onMouseMove={handleMouse}>

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
              <Background variant='lines' color='#aaa' gap={10} />
              <CustomControls save={onSave} load={onLoad} />
            </ReactFlow>
          </GraphProvider>




        </div>
      </ContextMenuTrigger>
      <CustomContextMenu2 newNode={createAddNodeMousePos} />

    </>
  );
}
