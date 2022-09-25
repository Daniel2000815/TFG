import React from 'react';
import { createTheme, ThemeProvider, styled } from '@mui/material/styles';

import {
  Header,
  Content,
  Footer,
  Navbar,
  Nav,
  Icon,
  Panel,
  Grid,
  Row,
  Col,
} from 'rsuite';

import AppBar from '@mui/material/AppBar';
import Graph from './GraphPage/Graph';
import MaterialsPage from './MaterialPage/MaterialsPage';
import SurfacePage from './SurfacePage/SurfacePage';
import 'rsuite/dist/styles/rsuite-default.css';
import { Box, Tab, Tabs, Typography } from '@mui/material';

import './styles.css';
import Shader from './CustomComponents/Shader';
import { fs } from './ShaderStuff/fragmentShaderMovable';

const theme = createTheme({
  palette: {
    main: '#0076DF',
    primitive: '#609dff',
    boolean: '#ff5858',
    deform: '#3ec224',
    transform: '#ffbb62',
  },
});

function MainContent() {
  return (
    <>
      <Grid fluid>
        <Row>
          <Col xs={6}>
            <Shader
              style={{ height: '100vh' }}
              shader={fs('box(p, vec3(1.0))')}
              uniforms={{ color: { type: '3fv', value: [1.0, 1.0, 0.0] } }}
            />
          </Col>
          <Col xs={1}>
            <div style={{ borderRight: '2px solid grey', height: '100vh' }} />
          </Col>
          <Col xs={17}>
            {/* <ContextMenu/> */}

            <Graph />
          </Col>
        </Row>
      </Grid>
    </>
  );
}

const layoutStyles = {
  display: 'flex',
  flexDirection: 'column',
  height: '100vh',
};

export default function App() {
  const [tabVal, setTabVal] = React.useState(2);

  return (
    <div style={layoutStyles}>
      <ThemeProvider theme={theme}>
        <Box>
          <Box>
            <Tabs value={tabVal} onChange={(e, v) => setTabVal(v)}>
              <Tab label="Graph" />
              <Tab label="Materials" />
              <Tab label="Surfaces" />
            </Tabs>
          </Box>
          <Box sx={{ padding: 2 }}>
            {tabVal === 0 && <MainContent />}
            {tabVal === 1 && <MaterialsPage />}
            {tabVal === 2 && <SurfacePage />}
          </Box>
        </Box>

        <Content style={{ flexGrow: 1 }}></Content>
        <Footer>
          <Panel bordered>
            <p>Daniel Zufrí Quesada</p>
          </Panel>
        </Footer>
      </ThemeProvider>
    </div>
  );
}
