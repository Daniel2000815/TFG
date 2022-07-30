import React, {useState, useEffect} from "react";
import { InputNumber, InputGroup } from 'rsuite';

export default function InputVector3(props) {
    const [x, setX] = useState(0);
    const [y, setY] = useState(0);
    const [z, setZ] = useState(0);

    useEffect(() => {
        props.onChange(x,y,z);
    }, [x,y,z]);

    return (
      <div style={{width: "100%"}}>
          <InputNumber prefix="x" defaultValue="0" value={x} onChange={setX}/>
          <InputNumber prefix="y" defaultValue="0" value={y} onChange={setY}/>
          <InputNumber prefix="z" defaultValue="0" value={z} onChange={setZ}/>
      </div>
    );
  };