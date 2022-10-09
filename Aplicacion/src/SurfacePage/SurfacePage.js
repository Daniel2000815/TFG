import React, { useState, useEffect } from 'react';
import Box from '@mui/material/Box';
import CustomTable from '../CustomComponents/CustomTable';
import nerdamer from 'nerdamer';
import 'katex/dist/katex.min.css';
import Latex from 'react-latex-next';
import useLocalStorage from '../storageHook.js';
import SurfaceDialog from './SurfaceDialog';

const latexEq = (eq) => {
  return <Latex>{`$ ${eq} $`}</Latex>;
};
const tableCols = [
  { id: 'name', label: 'Name', minWidth: 170 },
  { id: 'implicit', label: 'Implicit', minWidth: 350 },
  { id: 'sdf', label: 'SDF', minWidth: 10 },
];

export default function SurfacePage() {
  const [storage, setStorage] = useLocalStorage('user_implicits', {});
  const [dialogOpen, setDialogOpen] = useState(false);
  const [tableRows, setTableRows] = useState([]);
  const [editedRow, setEditedRow] = useState('');

  useEffect(() => {
    let newRows = [];

    Object.keys(storage).forEach(function (key, index) {
      const item = storage[key];

      newRows.push({
        id: item.id,
        name: item.name,
        implicit: latexEq(nerdamer.convertToLaTeX(item.implicit)),
        sdf: item.sdf,
      });
    });

    setTableRows(newRows);
  }, [storage]);

  const handleDelete = (selectedList) => {
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

      <CustomTable
        rows={tableRows}
        columns={tableCols}
        handleDelete={handleDelete}
        handleCreateRow={() => { setEditedRow(""); setDialogOpen(true) }}
        handleRowClick={(name) => { setEditedRow(name); setDialogOpen(true) }}
      />

      <SurfaceDialog
        savedData={editedRow ? storage[editedRow] : null}
        open={dialogOpen}
        handleClose={() => setDialogOpen(false)}
      />

    </Box>
  );
}
