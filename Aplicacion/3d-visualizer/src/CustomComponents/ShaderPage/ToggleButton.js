import React from "react";
import { styled } from '@mui/material/styles';
import Button from '@mui/material/Button';
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";

const CustomButton = styled(Button)(({ theme }) => ({
    color: theme.palette.contrastText,
    backgroundColor: theme.palette.primary,
    '&:hover': {
      backgroundColor: theme.palette.accent,
    },
  }));

export default function ToggleButton(props) {
    return (
        <CustomButton
        onClick={props.onClick}
        variant="contained"
        size="small"
        style={{ width: "100%", borderRadius: "0 0 5px 5px", height: "15px"}}
        endIcon={
          props.value ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />
        }
      >
      </CustomButton>
    );
}