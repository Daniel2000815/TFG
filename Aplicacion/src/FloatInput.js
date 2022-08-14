import React from 'react';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import OutlinedInput from '@mui/material/OutlinedInput';
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import Visibility from '@mui/icons-material/Visibility';

export default function FloatInput(props) {
  return (
    
    <TextField
      value={props.val}
        type="number"
        onChange={(ev) => props.handleChange(parseFloat(ev.target.value))}
          placeholder={props.label}
          sx={{
            '& .MuiOutlinedInput-root': {
              paddingLeft: 0,
              m:1,
              height:"30px"
            },
          }}
          InputProps={{
            startAdornment: (
              <InputAdornment
                sx={{
                  backgroundColor: props.labelColor ? props.labelColor : "gray",
                  padding: '15px 14px',
                  borderTopLeftRadius: (theme) => theme.shape.borderRadius + 'px',
                  borderBottomLeftRadius: (theme) => theme.shape.borderRadius + 'px',
                }}
                position="start"
              >
                {props.label}
              </InputAdornment>
            ),
          }}
        />
  );
}
