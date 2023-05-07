import { applyNodeChanges, applyEdgeChanges } from "reactflow";
import { nanoid } from "nanoid";
import { create } from "zustand";
import { InputMode } from "./Types/InputMode";
import {
  BooleanOperations,
  DeformOperations,
  TransformOperations,
} from "./Types/NodeOperations";

// import {
//   isRunning,
//   toggleAudio,
//   createAudioNode,
//   updateAudioNode,
//   removeAudioNode,
//   connect,
//   disconnect,
// } from "./Graph/audio";

const defaultNodes = [
  {
    id: "primitive",
    type: "primitive",
    position: { x: -150, y: 200 },
    data: { sdf: "cube(p,1.0)", inputs: {}, children: [] },
  },
  {
    id: "primitive2",
    type: "primitive",
    position: { x: -150, y: -200 },
    data: { sdf: "cube(p,1.0)", inputs: new Map(), children: [] },
  },
  {
    id: "deform",
    type: "deform",
    position: { x: 150, y: 200 },
    data: { sdf: "", inputs: new Map(), children: [] },
  },
  {
    id: "boolean",
    type: "boolean",
    position: { x: 150, y: -100 },
    data: { sdf: "", inputs: new Map(), children: [] },
  },
  {
    id: "transform",
    type: "transform",
    position: { x: 150, y: -400 },
    data: { sdf: "", inputs: new Map(), children: [] },
  },
];

const defaultPrimitives = [
  {
    id: "sphere",
    name: "Sphere",
    inputMode: InputMode.Implicit,
    input: ["x^2 + y^2 + z^2 - r", "", ""],
    parsedInput: "length(p)-r",
    parameters: [{ symbol: "r", label: "Radius", defaultVal: 1.0 }],
    fHeader: "sphere(vec3 p, float r)",
  },
  {
    id: "torus",
    name: "Torus",
    inputMode: InputMode.SDF,
    input: ["length(vec2(length(p.xz)-R,p.y)) - r", "", ""],
    parsedInput: "length(vec2(length(p.xz)-R,p.y)) - r",
    parameters: [
      { symbol: "R", label: "Radius 1", defaultVal: 2.0 },
      { symbol: "r", label: "Radius 2", defaultVal: 1.0 },
    ],
    fHeader: "torus(vec3 p, float R, float r)",
  },
  {
    id: "cube",
    name: "Cube",
    inputMode: InputMode.SDF,
    input: [
      "length(max(abs(p) - vec3(l),0.0)) + min(max(abs(p.x) - l,max(abs(p.y) - l,abs(p.z) - l)),0.0)",
      "",
      "",
    ],
    parsedInput:
      "length(max(abs(p) - vec3(l),0.0)) + min(max(abs(p.x) - l,max(abs(p.y) - l,abs(p.z) - l)),0.0)",
    parameters: [{ symbol: "l", label: "side", defaultVal: 1.0 }],
    fHeader: "cube(vec3 p, float l)",
  },
  {
    id: "ellipsoid",
    name: "Ellipsoid",
    inputMode: InputMode.Parametric,
    input: ["s", "t", "s^2+t^2"],
    parsedInput:
      "(-z + pow(x, 2.0000) + pow(y, 2.0000)) * pow(sqrt(1.0000 + 4.0000 * pow(x, 2.0000) + 4.0000 * pow(y, 2.0000)), -1.0000)",
    parameters: [],
    fHeader: "ellipsoid(vec3 p)",
  },
];

const getInitialLoggedIn = () => {
  // localStorage.clear();
  if(localStorage.getItem("graph_storage") !==null){
    console.log("ALGO HAY: ", JSON.parse(localStorage.getItem("graph_storage")));
    
    return JSON.parse(localStorage.getItem("graph_storage"));
  }

  return defaultNodes;
};

export const useStore = create((set, get) => ({
  nodes: getInitialLoggedIn() ,
  edges: [],
  needsToUpdate: { primitive: false, deform: false, boolean: false, primitive2: false, transform: false },
  primitives: defaultPrimitives,

  onNodesChange(changes) {
    set({
      nodes: applyNodeChanges(changes, get().nodes),
    });
  },

  createNode(type, x, y) {
    const id = nanoid();
    const data = { sdf: "", inputs: new Map(), children: [] }
    const position = { x: x, y: y };

    set({ nodes: [...get().nodes, { id, type, data, position }] });
    set({ needsToUpdate: {...get().needsToUpdate, id: false}});
    // switch (type) {
    //   case "osc": {
    //     const data = { frequency: 440, type: "sine" };
    //     const position = { x: 0, y: 0 };

    //     set({ nodes: [...get().nodes, { id, type, data, position }] });

    //     break;
    //   }

    //   case "amp": {
    //     const data = { gain: 0.5 };
    //     const position = { x: 0, y: 0 };

    //     set({ nodes: [...get().nodes, { id, type, data, position }] });

    //     break;
    //   }

      
    // }
  },

  saveToLocalStorage(){
    localStorage.setItem("graph_storage", JSON.stringify(get().nodes));
  },


  updateNode(id, data) {
    // update node logic -> update data
    var sourceNode = null;

    // Update and find source
    set({
      nodes: get().nodes.map((node) => {
        if (node.id === id) {
          sourceNode = node;
          return { ...node, data: Object.assign(node.data, data) };
        } else {
          return node;
        }
      }),
    });

    // Update its children
    set({
      nodes: get().nodes.map((node) => {
        if (sourceNode.data.children.includes(node.id)) {
          
          var newInputs = node.data.inputs;
          newInputs.set(sourceNode.id,  sourceNode.data.sdf);
          // newInputs[`${sourceNode.id}`] = sourceNode.data.sdf;
          // console.log("ACTUALIZANDO ",  node.id, " INPUTS: ", newInputs);
          get().setNeedsUpdate(node.id, true);
          return {
            ...node,
            data: Object.assign(node.data, {
              inputs: newInputs,
            }),
          };
        } else {
          return node;
        }
      }),
    });

    // const node = get().nodes.find(n => n.id === id);
    // node.data.children.forEach(c => {
    //   const child = get().nodes.find(n => n.id === child);
    //     switch(child.type){
    //       case "primitive":
    //         // imposible
    //         break;

    //       case "boolean":
    //         break;

    //       case "deform":

    //         break;

    //       case "transform":
    //         break;
    //     }
    // });
  },

  onNodesDelete(deleted) {
    for (const { id, data } of deleted) {
      console.log("DATA:", data.children);
      data.children.forEach(c => get().removeChild(id, c));
      
      
    //   // Update its children
    // set({
    //   nodes: get().nodes.map((node) => {
    //     if (data.children.includes(node.id)) {
    //       var newInputs = node.data.inputs;
    //       newInputs[`${sourceNode.id}`] = sourceNode.data.sdf;
    //       console.log("ACTUALIZANDO ",  node.id, " INPUTS: ", newInputs);
    //       get().setNeedsUpdate(node.id, true);
    //       return {
    //         ...node,
    //         data: Object.assign(node.data, {
    //           inputs: newInputs,
    //         }),
    //       };
    //     } else {
    //       return node;
    //     }
    //   }),
    // });
    }
  },

  onEdgesChange(changes) {
    set({
      edges: applyEdgeChanges(changes, get().edges),
    });
  },

  addEdge(data) {
    const id = nanoid(6);
    const edge = { id, type: "custom", ...data };

    const { source, target } = data;

    // connect logic
    set({ edges: [edge, ...get().edges] });

    // añadir hijo al padre
    const sourceNode = get().nodes.find((n) => n.id === source);
    const targetNode = get().nodes.find((n) => n.id === target);

    get().updateNode(source, {
      children: sourceNode.data.children.concat(target),
    });

    // actualizar inputs del hijo
    var newInputs = targetNode.data.inputs;
    // newInputs[`${source}`] = sourceNode.data.sdf;
    newInputs.set(source, sourceNode.data.sdf);
    get().updateNode(target, { inputs: newInputs });
    get().setNeedsUpdate(target, true);
  },

  setNeedsUpdate(id, val) {
    set({ needsToUpdate: { ...get().needsToUpdate, [id]: val } });
  },

  /*
  var newInputs = node.data.inputs;
  newInputs[`${sourceNode.id}`] = sourceNode.data.sdf;
  console.log("ACTUALIZANDO ",  node.id, " INPUTS: ", newInputs);
  get().setNeedsUpdate(node.id, true);
  return {
    ...node,
    data: Object.assign(node.data, {
      inputs: newInputs,
    }),
  };

  ----

  get().updateNode(source, {
      children: sourceNode.data.children.concat(target),
    });

  */

  removeChild (parent, child) {
    set({
      nodes: get().nodes.filter((node) => {
        if(node.id === parent){
          return {
            ...node,
            data: Object.assign(node.data, {
              children: node.data.children.filter(c => c!==child),
            }),
          };
        }
        else if(node.id === child){
          var newInputs = node.data.inputs;
          newInputs.delete(parent);
          // newInputs[`${parent}`] = "";
          // console.log("ACTUALIZANDO ",  node.id, " INPUTS: ", newInputs);
          get().setNeedsUpdate(node.id, true);
          return {
            ...node,
            data: Object.assign(node.data, {
              inputs: newInputs,
            }),
          };
        }
        else{
          return node;
        }
      }),
    });
  },

  deleteEdge(id, source, target){
    set({
      edges: get().edges.filter((e) => e.id !== id),
    });

    console.log("new edges: ", get().edges);
    get().removeChild(source, target);
  },
  updatePrimitive(id, data) {

    // Update and find source
    set({
      primitives: get().primitives.map((p) => {
        if (p.id === id) {
          return { ...p, data: Object.assign(p.data, data) };
        } else {
          return p;
        }
      }),
    });
  },

  deletePrimitive(id){
    set({primitives: get().primitives.filter((p) => p.id !== id)});
  },

  restorePrimitives(){
    set({primitives: defaultPrimitives});
  },

  onEdgesDelete(deleted) {
    for (const { source, target } of deleted) {
      get().removeChild(source, target);
    }

    console.log("se han borrado edges:", get().edges);
  },
}));
