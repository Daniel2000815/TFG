import React from 'react';
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import newId from '../uniqueIdHook';

export default function FloatInput(props) {
  return (

    <TextField
      id={newId(`${props.label}_floatInput`)}
      value={props.val}
      type="number"
      onChange={(ev) => props.handleChange(parseFloat(ev.target.value))}
      placeholder={props.label}
      
      sx={{
        '& .MuiOutlinedInput-root': {
          paddingLeft: 0,
          m: 1,
          height: "30px"
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
