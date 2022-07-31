import React from "react";

import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import InputLabel from "@mui/material/InputLabel";

export default function Dropdown(props) {
  const [open, setOpen] = React.useState(false);

  return (
    <FormControl onClick={() => setOpen(!open)} sx={{ m: 1, minWidth: 80 }}>
      <InputLabel>{props.label}</InputLabel>
      <Select
        value={props.value}
        onChange={(ev) => props.onChange(ev.target.value)}
        autoWidth
        open={open}
        label="Primitive"
      >
        {props.items.map((item) => (
          <MenuItem value={item}>{item}</MenuItem>
        ))}
      </Select>
    </FormControl>
  );
}
