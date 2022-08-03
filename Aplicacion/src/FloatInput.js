import React from 'react';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import OutlinedInput from '@mui/material/OutlinedInput';

export default function FloatInput(props) {
  return (
    <FormControl sx={{ m: 1 }}size="small">
      <InputLabel>{props.label}</InputLabel>
      <OutlinedInput
        value={props.val}
        type="number"
        onChange={(ev) => props.handleChange(parseFloat(ev.target.value))}
        label={props.label}
      />
    </FormControl>
  );
}
