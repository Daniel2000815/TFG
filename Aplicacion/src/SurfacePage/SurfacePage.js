import React, { useState, useEffect } from 'react';
import SurfaceCard from './SurfaceCard';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Fab from '@mui/material/Fab';
import AddIcon from '@mui/icons-material/Add';
import Typography from '@mui/material/Typography';
import InputAdornment from '@mui/material/InputAdornment';

import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Button from '@mui/material/Button';
import EquationEditor from 'equation-editor-react';
import evaluatex from '../../node_modules/evaluatex/dist/evaluatex';
import MathJax from 'react-mathjax';
import ButtonCard from '../CustomComponents/ButtonCard';
import CustomTable from '../CustomComponents/CustomTable';
import { evaluate, create, all } from 'mathjs';
import nerdamer from 'nerdamer';
import { isImportEqualsDeclaration } from 'typescript';
import 'katex/dist/katex.min.css';
import Latex from 'react-latex-next';
import useLocalStorage from '../storageHook.js';
import usePrimitivesHook from '../primitivesHook';
import SurfaceDialog from './SurfaceDialog';

const latexEq = (eq) => {
  return <Latex>{`\$ ${eq} \$`}</Latex>;
};
const tableCols = [
  { id: 'name', label: 'Name', minWidth: 170 },
  { id: 'implicit', label: 'Implicit', minWidth: 350 },
  { id: 'sdf', label: 'SDF', minWidth: 10 },
];

const tableRows2 = [
  { name: 'ej1', implicit: latexEq(localStorage.getItem('ej')) },
];



export default function SurfacePage() {
  const [storage, setStorage] = useLocalStorage('user_implicits', {});
  const [dialogOpen, setDialogOpen] = useState(false);
  const [tableRows, setTableRows] = useState([]);
  const [editedRow, setEditedRow] = useState('');
  const makeRow = (item) => {
    return { name: 'ej1', implicit: latexEq(localStorage.getItem('ej')) };
  };

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
    // Convert `obj` to a key/value array
    // `[['name', 'Luke Skywalker'], ['title', 'Jedi Knight'], ...]`
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
        handleCreateRow={() => {setEditedRow(""); setDialogOpen(true)}}
        handleRowClick={(name)=>{setEditedRow(name); setDialogOpen(true)}}
      />

      <SurfaceDialog
        savedData={editedRow ? storage[editedRow] : null}
        open={dialogOpen}
        handleClose={() => setDialogOpen(false)}
      />
      
    </Box>
  );
}
