import React from "react";
import Slider from '@mui/material/Slider';
import { styled } from '@mui/material/styles';

const CustomSlider = styled(Slider)(({ theme }) => ({
    color: theme.palette.primary,
    "& .MuiSlider-thumb": {
        backgroundColor: theme.palette.primary
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
        />
    );
}