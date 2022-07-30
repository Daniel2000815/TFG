import React from "react";
import {Handle} from "react-flow-renderer";

function InputHandle(){
    return ( 
     <Handle
         type="target"
         position="left"
         id="a"
         className="custom-handle"
         isConnectable={true}
         onConnect={(params) => console.log('handle onConnect', params)}
     />
    );
 }
 
function OutputHandle(){
     return ( 
      <Handle
          type="source"
          position="right"
          id="a"
          className="custom-handle"
          isConnectable={true}
      />
     );
 }

 export{InputHandle, OutputHandle};