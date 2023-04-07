import React, { memo } from "react";
import { Handle, Position } from "react-flow-renderer";
import { useTheme } from "@mui/material/styles";

function CustomHandle(props: {
  nodeId: string;
  inputNumber: string;
  type: "source" | "target";
  style: any;
}) {
  const theme = useTheme();
  const radius = "10px";
  const margin = "-2px";

  const style = {
    ...props.style,
    width: `${radius}`,
    height: `${radius}`,
    background: `${theme.palette.primary.light}`,
    border: `1px solid ${theme.palette.primary.main}`,
  };

  // const id = newId('handle');

  return (
    <>
      <Handle
        id={`${props.nodeId}_${props.type}_${props.inputNumber}`}
        type={props.type}
        style={
          props.type === "source"
            ? {
                ...style,
                marginRight: `${margin}`,
              }
            : {
                ...style,
                marginLeft: `${margin}`,
              }
        }
        position={props.type === "source" ? Position.Right : Position.Left}
      />
    </>

    // <>
    //   {props.type === "source" ?

    //     :
    //     <Handle

    //       type="target"
    //       id={id+"_target"}
    //       key={id+"_target"}
    //       style={{
    //         ...style, marginLeft: `${margin}`
    //       }}
    //       position={Position.Left}
    //     />
    //   }
    // </>
  );
}

export default memo(CustomHandle);
