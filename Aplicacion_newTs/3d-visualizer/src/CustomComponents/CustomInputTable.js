import React, { useState, useEffect } from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import { styled } from '@mui/material/styles';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Delete';

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: '#DDDDDD',
    color: 'black',
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
  },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  '&:nth-of-type(odd)': {
    backgroundColor: theme.palette.action.hover,
  },
  // hide last border
  '&:last-child td, &:last-child th': {
    border: 0,
  },
}));

const columns = [
  { id: 'symbol', label: 'Symbol', minWidth: 70 },
  { id: 'label', label: 'Label', minWidth: 70 },
  { id: 'defaultVal', label: 'Default Value', minWidth: 70 },
];

function EnhancedTableHead(props) {
  return (
    <TableHead>
      
      <StyledTableRow>
      <StyledTableCell/>
        {props.columns.map((headCell) => (
          <StyledTableCell
            sx={{ minWidth: headCell.minWidth }}
            key={headCell.id}
            align={headCell.numeric ? 'right' : 'left'}
          >
            <Typography variant="subtitle1">
              <b>{headCell.label}</b>
            </Typography>
          </StyledTableCell>
        ))}
      </StyledTableRow>
    </TableHead>
  );
}

function createParameter(symbol = '', label = '', defaultVal = '') {
  return {
    symbol: symbol,
    label: label,
    defaultVal: defaultVal,
  };
}

export default function CustomInputTable(props) {
  const [rows, setRows] = useState(props.rows);

  useEffect(() => {
    console.log(rows);
  }, [rows]);

  const handleRowChange = (row, column, value) => {
    let newRows = [...rows];
    console.log("HANDLEANDO: " + column);
    newRows[row][column] = column==='defaultVal' ? parseFloat(value,10) : value;

    // TODO: check if valid

    setRows(newRows);
    props.handleNewParameters(rows);
  };

  const handleAdd = () => {
    setRows(rows.concat(createParameter()));
  };

  const handleDelete = (index) => {
    setRows([
      ...rows.slice(0, index)]);
  }

  return (
    <Paper sx={{ width: '100%', overflow: 'hidden' }}>
      <TableContainer
        style={{ border: '1px solid grey' }}
        sx={{ maxHeight: 440 }}
      >
        <Table stickyHeader size="small" aria-label="sticky table">
          <EnhancedTableHead columns={columns} />
          <TableBody>
            {rows.map((row, index) => {
              return (
                <StyledTableRow hover tabIndex={-1} key={row.id}>
                  <StyledTableCell padding="checkbox">
                  <IconButton onClick={()=>handleDelete(index)} aria-label="delete">
                <DeleteIcon />
              </IconButton>
                  </StyledTableCell>

                  {columns.map((column) => {
                    const value = row[column.id];
                    return (
                      <StyledTableCell key={column.id} align={column.align}>
                        <TextField
                          defaultValue={value}
                          id="standard-basic"
                          variant="standard"
                          error={value === ''}
                          onChange={(e) =>
                            handleRowChange(index, column.id, e.target.value)
                          }
                        />
                      </StyledTableCell>
                    );
                  })}
                </StyledTableRow>
              );
            })}
          </TableBody>
        </Table>
        <Button onClick={handleAdd} style={{ width: '100%' }}>
          +
        </Button>
      </TableContainer>
    </Paper>
  );
}
