import React, { useEffect, useContext } from "react";
import Shader from "../CustomComponents/Shader";
import { useTheme } from '@mui/material/styles';

import { fs } from "../ShaderStuff/fragmentShaderMovable";
import Dropdown from "../CustomComponents/Dropdown";
import CustomHandle from "./CustomHandle";
import GraphContext from "../GraphContext.js";
import Button from "@mui/material/Button";

import ToggleButton from "../CustomComponents/ToggleButton";

export default function CustomNode(props) {
  const [showMore, setShowMore] = React.useState(true);
  const [isHover, setIsHover] = React.useState(false);

  const sharedFunctions = useContext(GraphContext);
  const theme = useTheme();

  const nodeStyle = {
    position: "relative",
    width: "200px",
    display: "flex",
    flexDirection: "column",
    transition: "border 300ms ease",
    boxShadow: "0 3px 6px rgba(0, 0, 0, 0.16), 0 3px 6px rgba(0, 0, 0, 0.23)",
    borderRadius: "7px 7px 7px 7px",
    borderBottomWidth: "10px solid #000",
    backgroundColor: "#fff",

    boxShadow: isHover ?
      "0 6px 12px rgba(0, 0, 0, 0.25), 0 6px 12px rgba(0, 0, 0, 0.25)" :
      "0 3px 6px rgba(0, 0, 0, 0.16), 0 3px 6px rgba(0, 0, 0, 0.23)",

    border: isHover ?
      `1px solid ${theme.palette.primary.dark}` :
      `1px solid ${theme.palette.primary.main}`,

    "&:hover": {
      transition: "box-shadow 200ms ease",
      boxShadow: "0 6px 12px rgba(0, 0, 0, 0.25), 0 6px 12px rgba(0, 0, 0, 0.25)",
      border: `1px solid ${theme.palette.primary.dark}`
    },
  }


  const headerStyle = {
    flexGrow: "1",
    marginBottom: "16px",
    height: "20px",
    width: "100%",
    color: "#EFF7FF",
    borderRadius: "5px 5px 0px 0px",
    borderBottomWidth: "10px solid #000",
    textAlign: "center",
    fontWeight: "600",
    fontSize: "14px",
    letterSpacing: "0.1px",
    justifyContent: "flex-start",
    backgroundColor: `${theme.palette.primary.main}`
  }

  const handleMouseEnter = () => {
    setIsHover(true);
  };

  const handleMouseLeave = () => {
    setIsHover(false);
  };

  useEffect(() => {
    console.log(`SDF DE ${props.id} MODIFICADO`);
    sharedFunctions.updateNodeSdf(props.id, props.sdf);
    console.log(props.dropdownOptions[0]);
  }, [props.sdf]);

  return (
    <div onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave} style={nodeStyle}>
      <div className="nodeHeader" style={headerStyle}>{props.title}</div>
      
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
              color: { type: "3fv", value: [1.0, 1.0, 0.0] },

            }}
            style={{ margin: "10px", height: "100%" }}
          />
        </>
      ) : null}


      <ToggleButton value={showMore} onClick={() => setShowMore(!showMore)} />
      
    </div>
  );
}
