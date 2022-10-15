import React, { memo } from 'react';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import Tab from '@mui/material/Tab';
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';
import Graph from './GraphPage/Graph';
import Grid from '@mui/material/Grid';
import Container from '@mui/material/Container';

import MaterialsPage from './MaterialPage/MaterialsPage';
import SurfacePage from './SurfacePage/SurfacePage';
import GrobnerPage from './GrobnerPage/GrobnerPage';
import 'rsuite/dist/styles/rsuite-default.css';
import { Box, Tabs } from '@mui/material';
import './styles.css';
import Shader from './CustomComponents/Shader';
import { fs } from './ShaderStuff/fragmentShaderMovable';
import newId from './uniqueIdHook';

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
    <Box sx={{height: "100%"}}>
      <Grid container spacing={2}>
        <Grid item xs={3}>
          <Shader
            shader={fs('box(p, vec3(1.0))')}
            uniforms={{ color: { type: '3fv', value: [1.0, 1.0, 0.0] } }}
          />
        </Grid>
        <Grid item xs={9}>
          {/* <ContextMenu/> */}
          <Graph />
        </Grid>
      </Grid>
    </Box>
  );
}

const layoutStyles = {
  display: 'flex',
  flexDirection: 'column',
  height: '100%',
};

const getVisibilityStyle = (hiddenCondition) => {
  if (hiddenCondition) {
    return {
      height: 0,
    };
  }
  return {
    height: 'inherit',
  };
};

function Footer() {
  return(
  <Box sx={{width: '100%', typography: 'body1' }}>
    Daniel Zufrí Quesada
  </Box>)
}
const main = <MainContent />;

function App() {
  const [tabVal, setTabVal] = React.useState(1);
  const tabs = [main, <GrobnerPage />, <SurfacePage />];

  return (
      <ThemeProvider theme={theme}>
        <Grid  sx={{height: '100vh'}} container rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 3 }}> 

        <Grid item xs={12}>
        <Box sx={{width: '100%', typography: 'body1' }}>
          <TabContext value={tabVal}>
            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
              <TabList
                onChange={(e, v) => setTabVal(v)}
                aria-label="lab API tabs example"
              >
                <Tab label="Graph" value={0} />
                <Tab label="Groebner" value={1} />
                <Tab label="Surfaces" value={2} />
              </TabList>
            </Box>
            {tabs.map(function (tabComponent, idx) {
              return (
                <TabPanel value={idx}>
                  <div
                    key={newId('floatInputContainer_')}
                    style={getVisibilityStyle(idx !== tabVal)}
                  >
                    {tabComponent}
                  </div>
                </TabPanel>
              );
            })}
          </TabContext>
          </Box>
          </Grid>
          <Grid item xs={12}>
          <Footer/>
          </Grid>
        
        </Grid>
        

        {/* <Content style={{ flexGrow: 1 }}></Content>
        <Footer>
          <Panel bordered>
            <p>Daniel Zufrí Quesada</p>
          </Panel>
        </Footer> */}
      </ThemeProvider>
  );
}

export default memo(App);
