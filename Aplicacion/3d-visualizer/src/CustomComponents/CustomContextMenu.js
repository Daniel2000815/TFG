import * as React from 'react';
import { ContextMenu, MenuItem } from "react-contextmenu";

import { NodeTypes } from '../GraphPage/nodeTypes';
import Typography from '@mui/material/Typography';

import PrimitiveIcon from '@mui/icons-material/ViewInAr';
import TransformIcon from '@mui/icons-material/Transform';
import BooleanIcon from '@mui/icons-material/JoinRight';
import DeformIcon from '@mui/icons-material/Storm';

// const customStyles = {
//   width: "250px",
//   height: "250px",
//   backgroundColor: "purple",
//   color: "white",
//   display: "flex",
//   alignItems: "center",
//   justifyContent: "center",
//   margin: "auto"
// };

// https://codesandbox.io/s/tq8r3?file=/src/components/coupon.css:969-2051
export default function CustomContextMenu(props) {
  const icons = [<PrimitiveIcon />, <BooleanIcon />, <TransformIcon />, <DeformIcon />];

  return (

    <ContextMenu id="contextmenu">
      {Object.keys(NodeTypes).map((type, index) =>
        <MenuItem key={index} onClick={()=>props.newNode(Object.values(NodeTypes)[index],0,0)}>
          {icons[index]}
          <Typography align="left" style={{marginLeft: "10px"}} variant="body1" color="text.primary">
            {type}
          </Typography>
          <Typography  align="right" style={{marginLeft: "10px"}} variant="body2" color="text.secondary">
            {type[0].toUpperCase()}
          </Typography>
        </MenuItem>
      )}
    </ContextMenu>

  );

  // const handleContextMenu = useCallback(
  //     (event) => {
  //         event.preventDefault();
  //         setAnchorPoint({ x: event.pageX, y: event.pageY });
  //         setShow(true);
  //         console.log("ANCHOR: " + event.pageX);
  //     },
  //     [setAnchorPoint]
  // );

  // const handleClick = useCallback(() => (show ? setShow(false) : null), [show]);

  // useEffect(() => {
  //     document.addEventListener("click", handleClick);
  //     document.addEventListener("contextmenu", handleContextMenu);
  //     return () => {
  //         document.removeEventListener("click", handleClick);
  //         document.removeEventListener("contextmenu", handleContextMenu);
  //     };
  // }, [show]);


  // return (
  //     <div style={{
  //         top: `${anchorPoint.y}px`,
  //         left: `${anchorPoint.x}px`
  //       }}>
  //         {show ? <Paper sx = {{ width: 200, maxWidth: '100%' }} >
  //         <MenuList>
  //         {Object.values(NodeTypes).map((type, index) =>
  //             <MenuItem onClick={() => console.log("asasas")}>
  //                 <ListItemIcon>{icons[index]}</ListItemIcon>
  //                 <ListItemText>{type} </ListItemText>
  //                 <Typography variant="body2" color="text.secondary">
  //                     {type[0].toUpperCase()}
  //                 </Typography>
  //             </MenuItem>)
  //         }
  //     </MenuList>
  //     </Paper > 
  //     : null}
  //     </div>

  // );
}
