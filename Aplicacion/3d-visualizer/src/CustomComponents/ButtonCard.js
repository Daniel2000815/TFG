import React from 'react';
import Slider from '@mui/material/Slider';
import { styled } from '@mui/material/styles';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import AddIcon from '@mui/icons-material/Add';
import Box from '@mui/material/Box';

import IconButton from '@mui/material/IconButton';


const CustomCard = styled(Card)(({ theme }) => ({
  color: theme.palette.primary,
  border: '2px grey dashed',
  backgroundColor: 'transparent',
  width: "100%",
  height: "100%",
  textAlign: "center",
  verticalAlign: "center",
  elevation: 10,
  '& .MuiCardHeader-root': {
    backgroundColor: 'transparent',
  },
  '& .MuiCardHeader-title': {
    //could also be placed inside header class
    backgroundColor: '#FCFCFC',
  },
  '& .MuiCardHeader-subheader	': {
    backgroundImage: 'linear-gradient(to bottom right, #090977, #00d4ff);',
  },
  '& .MuiCardContent-root': {
    backgroundColor: 'transparent',
  },
}));

const CustomButton = styled(IconButton)(({ theme }) => ({
    color: theme.palette.primary,
    border: '2px grey dashed',
    backgroundColor: 'transparent',
    width: "100%",
    height: "100%",

  }));

export default function ButtonCard(props) {
  return (
    <Box sx={{
        width: 200,
        height: 200,
        backgroundColor: 'transparent',
        '&:hover': {
          backgroundColor: 'primary.main',
          opacity: [0.9, 0.8, 0.7],
        },
      }}>

      <CustomButton color="primary" aria-label="upload picture" component="label">
        <input hidden accept="image/*" type="file" />
        <AddIcon />
      </CustomButton>
      <Button variant="outlined" startIcon={<AddIcon />}>
        Delete
        </Button>
    </Box>
  );
}
