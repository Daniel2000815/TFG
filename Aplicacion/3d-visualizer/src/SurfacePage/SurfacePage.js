import React, { useState, useEffect } from 'react';
import Box from '@mui/material/Box';

import 'katex/dist/katex.min.css';
import Latex from 'react-latex-next';
import useLocalStorage from '../Utils/storageHook.ts';
import SurfaceDialog from './SurfaceDialog';
import SurfaceTable from './SurfaceTable';
import TestNode from '../CustomNodes/TestNode';
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
  const [editID, setEditID] = useState("");

  // useEffect(() => {
  //   let newRows = [];
  //   Object.keys(storage).forEach(function (key, index) {
  //     const item = storage[key];
  //     console.log("item ", item.input);

  //     let latex = "";
  //     if(item.inputMode!==InputMode.SDF) item.input.forEach(i => {latex += nerdamer.convertToLaTeX(i) + ', '; console.log(latex)});
  //     newRows.push({
  //       name: item.name,
  //       input: item.inputMode===InputMode.SDF ?item.input : latex,
  //       parameters: item.parameters.map(p => p.symbol),
  //       sdf: item.parsedInput,
        
  //       inputMode: item.inputMode
  //     });
  //   });

  //   setTableRows(newRows);
  // }, [storage]);

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

  const handleEdit = (id) => {
    setEditID(id); 
    setDialogOpen(true);
  }

  const handleNew = () => {
    setEditID("");
    setDialogOpen(true);
  }

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
      <SurfaceTable handleEdit={(id) => handleEdit(id)} handleNew={()=>handleNew()}/>
      <SurfaceDialog
        initialID={editID} 
        handleClose={() => setDialogOpen(false)}
        open={dialogOpen}
      />

    </Box>
  );
}
