import React from "react";
import { Handle } from "react-flow-renderer";
import { useTheme } from '@mui/material/styles';

export default function CustomHandle(props) {
  const theme = useTheme();
  const radius = "10px";
  const margin = "-2px"

  const style = {
    ...props.style, width: `${radius}`, height: `${radius}`,
    background: `${theme.palette.primary.light}`,
    border: `1px solid ${theme.palette.primary.main}`
  }



  return (
    <>
      {props.type === "source" ?
        <Handle
          type="source"
          id={props.id}
          style={{
            ...style, marginRight: `${margin}`
          }}
          position="right"
        />
        :
        <Handle
          type="target"
          id={props.id ? props.id : "0"}
          style={{
            ...style, marginLeft: `${margin}`
          }}
          position="left"
        />
      }
    </>
  );
}
