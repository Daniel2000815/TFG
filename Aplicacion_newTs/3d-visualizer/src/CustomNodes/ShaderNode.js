// import React, { useState, useContext, useEffect } from "react";
// import GraphContext from "./GraphContext.js";

// import Shader from "./Shader.js";
// import Button from "@mui/material/Button";
// import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
// import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";


// export default function ShaderNode({ data, id, computeSdf, content }) {
//   const [sdf, setSdf] = React.useState("sphere(p, 1.0)");
//   const [showCanvas, setShowCanvas] = useState(true);

//   const sharedFunctions = useContext(GraphContext);
//   useEffect(() => {
//     console.log("HA");
//     console.log(data);
//   }, [data]);

//   useEffect(() => {
//     sharedFunctions.updateNodeSdf(id, sdf);
//   }, [sdf]);

//   useEffect(() => {
//     console.log("STRAT");
//     computeSdf();
//   }, [sdf]);

//   return (
//     <div className="custom-node">
//       <div className="custom-node-header">Ejemplo:</div>

//       <p>{`ID: ${id}`}</p>
//       <p>CHaILDREN: {data.children}</p>
//       <p>SDF: {sdf}</p>

//       {content}

//       {showCanvas ? (
//         <Shader
//           shader={sdf}
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
