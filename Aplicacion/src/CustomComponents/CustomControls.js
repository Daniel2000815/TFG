import React from 'react';
import { Controls, ControlButton } from 'react-flow-renderer';
import SaveIcon from '@mui/icons-material/Save';
import FileOpenIcon from '@mui/icons-material/FileOpen';

export default function CustomControls(props) {
  return (
    <Controls>
      <ControlButton onClick={() => props.save()}>
        <SaveIcon />
      </ControlButton>
      <ControlButton onClick={() => props.load()}>
        <FileOpenIcon />
      </ControlButton>
    </Controls>
  );
}