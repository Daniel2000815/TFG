import React, { useState, useEffect } from 'react';
import Box from '@mui/material/Box';
import CustomTable from '../CustomComponents/CustomTable';
import nerdamer from 'nerdamer';
import 'katex/dist/katex.min.css';
import Latex from 'react-latex-next';
import useLocalStorage from '../storageHook.ts';
import SurfaceDialog from '../Components/SurfaceDialog';
import SurfaceTable from './SurfaceTable';
import { InputMode } from '../Types/InputMode';
import TestNode from '../GraphPage/TestNode';
import Shader from '../CustomComponents/Shader';
const latexEq = (eq) => {
  return <Latex>{`$ ${eq} $`}</Latex>;
};
const tableCols = [
  { id: 'name', label: 'Name', minWidth: 170 },
  { id: 'input', label: 'Input', minWidth: 350 },
  { id: 'parameters', label: 'Parameters', minWidth: 30 },
  { id: 'sdf', label: 'SDF', minWidth: 10 },
];

export default function SurfacePage() {
  const [storage, setStorage] = useLocalStorage('user_implicits', {});
  const [dialogOpen, setDialogOpen] = useState(false);
  const [tableRows, setTableRows] = useState([]);
  const [editedRow, setEditedRow] = useState('');
  const [sdf, setSdf] = useState("sphere(p, 1.5000)");
  
  useEffect(() => {
    let newRows = [];
    Object.keys(storage).forEach(function (key, index) {
      const item = storage[key];

      newRows.push({
        name: item.name,
        input: item.inputMode===InputMode.SDF ?item.input : nerdamer.convertToLaTeX(item.input),
        parameters: item.parameters.map(p => p.symbol),
        sdf: item.parsedInput,
        
        inputMode: item.inputMode
      });
    });

    setTableRows(newRows);
  }, [storage]);

  const handleDelete = (selectedList) => {
    console.log("TRYING TO DELETE");
    console.log(selectedList);
    const asArray = Object.entries(storage);
    const filtered = asArray.filter(
      ([key, value]) => !selectedList.includes(key)
    );

    // Convert the key/value array back to an object:
    // `{ name: 'Luke Skywalker', title: 'Jedi Knight' }`
    const newStorage = Object.fromEntries(filtered);
    setStorage(newStorage);
  };

  return (
    <Box>
      {/* <CustomTable
        rows={tableRows}
        columns={tableCols}
        handleDelete={handleDelete}
        handleCreateRow={() => { setEditedRow(""); setDialogOpen(true) }}
        handleRowClick={(name) => {console.log("click"); setEditedRow(name); setDialogOpen(true) }}
      /> */}
      {/* <TestNode/> */}
      {/* <Shader style={{ width: "1000px", margin: "10px" }} sdf={"length(max(abs(p) - vec3(1.0),0.0)) + min(max(abs(p.x) - 1.0,max(abs(p.y) - 1.0,abs(p.z) - 1.0)),0.0)"}/> */}
      <SurfaceTable handleNew={()=>setDialogOpen(true)}/>

      <SurfaceDialog
        data={null} 
        handleClose={() => setDialogOpen(false)}
        open={dialogOpen}
      />

    </Box>
  );
}
