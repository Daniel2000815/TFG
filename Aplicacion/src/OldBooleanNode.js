// import React, { useEffect, useContext } from "react";
// import { Handle } from "react-flow-renderer";
// import Shader from "./Shader";
// import { fs } from "./fragmentShader";
// import Dropdown from "./Dropdown";
// import CustomHandle from "./CustomHandle";
// import GraphContext from "./GraphContext.js";
// import Button from "@mui/material/Button";
// import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
// import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";

// const BooleanOperations = {
//   Union: "Union",
//   Difference: "Difference",
//   Intersection: "Intersection",
// };



// export default function OldBooleanNode({ data, id }) {
//   const [operation, setOperation] = React.useState(BooleanOperations.Union);
//   const [sdf, setSdf] = React.useState(data.sdf);
//   const [showCanvas, setShowCanvas] = React.useState(false);

//   const sharedFunctions = useContext(GraphContext);
  
//   useEffect(() => {
//     console.log(`${id} HA RECIBIDO NUEVOS DATOS:`);
//     console.log(JSON.stringify(data));
//   }, [data]);

//   useEffect(() => {
//     console.log(`SDF DE ${id} MODIFICADO`);
//     sharedFunctions.updateNodeSdf(id, sdf);
//   }, [sdf]);

//   useEffect(() => {
//     console.log(`SE HAN MODIFICADO LOS SDF EN NODO BOOLEANO. AHORA HAY ${Object.keys(data.inputs).length}`);
//     const inputs = `${Object.keys(data.inputs).map(key => `${data.inputs[key]}`).join(', ')}`;
//     console.log(inputs);
//     if(operation===BooleanOperations.Union)
//       setSdf(`min(${inputs})`)
//     else if(operation===BooleanOperations.Intersection)
//       setSdf(`max(${inputs})`)
//     else if(operation===BooleanOperations.Difference)
//       setSdf(`max(-${inputs})`)

//   }, [data, operation]);

//   return (
//     <div className="custom-node">
//       <div className="custom-node-header">Boolean</div>
//       <p>{`ID: ${id}`}</p>
//       <p>CHILDREN: {Object.keys(data.children).map(key => `${data.children[key]}`).join(', ')}</p>
//       <p>SDF: {sdf}</p>

//       <Dropdown
//         value={operation}
//         onChange={setOperation}
//         items={Object.values(BooleanOperations)}
//         label="Operation"
//       />

//       <CustomHandle id={"0"} type="target" onConnect={(params) => console.log("handle ss", params)} style={{ top: "45%" }}/>
//       <CustomHandle id={"1"} type="target" onConnect={(params) => data.updateBooleanPrimitive(params.source, params.target)} style={{ top: "55%" }}/>
//       <CustomHandle id={"2"} type="source" onConnect={(params) => console.log("handle onsConnect", params)} style={{ top: "50%" }}/>

//       {showCanvas ? (
//         <Shader
//           shader={fs(sdf)}
//           uniforms={{ color: { type: "3fv", value: [1.0, 1.0, 0.0] } }}
//           style={{ margin: "10px" }}
//         />
//       ) : null}

//       <Button
//         onClick={() => setShowCanvas(!showCanvas)}
//         variant="contained"
//         className="custom-node-creater"
//         size="small"
//         endIcon={
//           showCanvas ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />
//         }
//       >
//         {showCanvas ? "Hide canvas" : "Show canvas"}
//       </Button>
//     </div>
//   );
// }
