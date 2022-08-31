import * as React from 'react';
import { useCallback, useEffect, useState, useRef } from "react";

import Divider from '@mui/material/Divider';
import Paper from '@mui/material/Paper';
import MenuList from '@mui/material/MenuList';
import MenuItem from '@mui/material/MenuItem';
import ListItemText from '@mui/material/ListItemText';
import ListItemIcon from '@mui/material/ListItemIcon';
import Typography from '@mui/material/Typography';
import ContentCut from '@mui/icons-material/ContentCut';
import ContentCopy from '@mui/icons-material/ContentCopy';
import ContentPaste from '@mui/icons-material/ContentPaste';
import Cloud from '@mui/icons-material/Cloud';
import { NodeTypes } from '../nodeTypes';

import PrimitiveIcon from '@mui/icons-material/ViewInAr';
import TransformIcon from '@mui/icons-material/Transform';
import BooleanIcon from '@mui/icons-material/JoinRight';
import DeformIcon from '@mui/icons-material/Storm';

import ContextMenu from "@agjs/react-right-click-menu";

const customStyles = {
  width: "250px",
  height: "250px",
  backgroundColor: "purple",
  color: "white",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  margin: "auto"
};

// https://blog.logrocket.com/creating-context-menu-react/#:~:text=Creating%20a%20custom%20right%2Dclick,the%20context%20menu%20keyboard%20shortcut.
export default function CustomContextMenu(props) {
  const icons = [<PrimitiveIcon />, <BooleanIcon />, <TransformIcon />, <DeformIcon />];

  const [anchorPoint, setAnchorPoint] = useState({ x: 0, y: 0 });
  const [show, setShow] = useState(false); // hide menu


  const [isMenuShown, setIsMenuShown] = useState(false);
  const ref = useRef();

  const Foo = () => <Paper variant="outlined" elevation={4} sx={{ width: 200, maxWidth: '100%' }} >
    <MenuList>
      {Object.values(NodeTypes).map((type, index) =>
        <MenuItem onClick={() => console.log("asasas")}>
          <ListItemIcon>{icons[index]}</ListItemIcon>
          <ListItemText>{type} </ListItemText>
          <Typography variant="body2" color="text.secondary">
            {type[0].toUpperCase()}
          </Typography>
        </MenuItem>)
      }
    </MenuList>
  </Paper >;


  return (
    <ContextMenu
      trigger={props.triggerRef}
      component={<Foo />}
      isOpen={isMenuShown}
      setIsOpen={setIsMenuShown}
    />
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
