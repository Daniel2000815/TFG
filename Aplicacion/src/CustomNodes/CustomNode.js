import React, { useEffect, useContext } from "react";
import Shader from "../CustomComponents/Shader";
import { useTheme } from '@mui/material/styles';

import { fs } from "../ShaderStuff/fragmentShaderMovable";
import Dropdown from "../CustomComponents/Dropdown";
import CustomHandle from "./CustomHandle";
import GraphContext from "../GraphContext.js";
import Button from "@mui/material/Button";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";


export default function CustomNode(props) {
  const [showMore, setShowMore] = React.useState(true);

  const sharedFunctions = useContext(GraphContext);
  const theme = useTheme();

  useEffect(() => {
    console.log(`SDF DE ${props.id} MODIFICADO`);
    sharedFunctions.updateNodeSdf(props.id, props.sdf);
    console.log(props.dropdownOptions[0]);
  }, [props.sdf]);

  return (
    <div className={`custom-node custom-node-${props.styleClass}`}>
      <div className={`custom-node-header custom-node-header-${props.styleClass}`}>{props.title}</div>
      

      
      {props.dropdownOptions ? (
        <Dropdown
          defaultValue={props.dropdownOptions[0]}
          onChange={props.onChangeOption}
          items={props.dropdownOptions}
          label={props.title}
        />
      ) : null}
      <CustomHandle
        id={"0"}
        type="target"
        onConnect={(params) => console.log("handle ss", params)}
        style={{ top: "45%" }}
      />
      <CustomHandle
        id={"1"}
        type="target"
        onConnect={(params) =>
          props.data.updateBooleanPrimitive(params.source, params.target)
        }
        style={{ top: "55%" }}
      />
      <CustomHandle
        id={"2"}
        type="source"
        onConnect={(params) => console.log("handle onsConnect", params)}
        style={{ top: "50%" }}
      />

        
      {showMore ? (
        <>
        <p>{`ID: ${props.id}`}</p>
      <p>
        CHILDREN:{" "}
        {Object.keys(props.data.children)
          .map((key) => `${props.data.children[key]}`)
          .join(", ")}
      </p>
      <p>{`SDF: ${props.sdf}`}</p>
      
      
      
        {props.body}
        <Shader
          shader={fs(props.sdf)}
          uniforms={{ 
            color:    { type: "3fv" , value: [1.0, 1.0, 0.0] },
            
           }}
          style={{ margin: "10px", height:"100%" }}
        />
        </>
      ) : null}

      <Button
        onClick={() => setShowMore(!showMore)}
        variant="contained"
        size="small"
        style={{width: "100%", borderRadius: "0 0 5px 5px", height: "15px", backgroundColor: theme.palette[props.styleClass] }}
        endIcon={
          showMore ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />
        }
      >
      </Button>
    </div>
  );
}
