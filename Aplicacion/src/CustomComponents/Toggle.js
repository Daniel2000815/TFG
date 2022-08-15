import React from 'react';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';

export default function Toogle(props) {

    return (
        <ToggleButtonGroup
          color="primary"
          value={props.value}
          exclusive
          onChange={props.onChange}
        >
          <ToggleButton value={true}>{props.label}</ToggleButton>
        </ToggleButtonGroup>
    );
}