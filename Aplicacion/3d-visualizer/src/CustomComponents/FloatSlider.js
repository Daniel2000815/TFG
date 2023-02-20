import React from "react";
import Slider from '@mui/material/Slider';
import { styled } from '@mui/material/styles';

const CustomSlider = styled(Slider)(({ theme }) => ({
    color: theme.palette.primary,
    "& .MuiSlider-thumb": {
        backgroundColor: theme.palette.primary,
        '&:focus, &:hover, &.Mui-active': {
            boxShadow:
              '0 3px 1px rgba(0,0,0,0.1),0 4px 8px rgba(0,0,0,0.3),0 0 0 1px rgba(0,0,0,0.02)',
            // Reset on touch devices, it doesn't add specificity
            '@media (hover: none)': {
              boxShadow: '0 3px 1px rgba(0,0,0,0.1),0 4px 8px rgba(0,0,0,0.13),0 0 0 1px rgba(0,0,0,0.02)',
            },
          },
    },
    "& .MuiSlider-rail": {
        opacity: 0.5,
        backgroundColor: theme.palette.primary
    }
}));

export default function FloatSlider(props) {
    return (
        <CustomSlider
            size="small"
            valueLabelDisplay="auto"
            onChange={props.handleChange}
            min={props.range[0]}
            max={props.range[1]}
            step={0.1}
            style={{width:"90%", margin:"10px"}}
        />
    );
}