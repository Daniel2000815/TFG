import React from 'react';
import FilledInput from '@mui/material/FilledInput';
import FormControl from '@mui/material/FormControl';
import FormHelperText from '@mui/material/FormHelperText';
import Input from '@mui/material/Input';
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
