import React from "react";
import Slider from '@mui/material/Slider';
import { styled } from '@mui/material/styles';

const CustomSlider = styled(Slider)(({ theme }) => ({
    color: theme.palette.boolean,
    "& .MuiSlider-thumb": {
        backgroundColor: theme.palette.boolean //color of thumbs
    },
    "& .MuiSlider-rail": {
        color: theme.palette.boolean ////color of the slider outside  teh area between thumbs
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