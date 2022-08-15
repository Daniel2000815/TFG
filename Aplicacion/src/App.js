import React from "react";

import {
  Header,
  Content,
  Footer,
  Navbar,
  Nav,
  Icon,
  Panel,
  Grid,
  Row, Col,
} from "rsuite";

import Graph from "./Graph";
import "rsuite/dist/styles/rsuite-default.css";

import "./styles.css";
import Shader from "./CustomComponents/Shader";
import {fs} from "./ShaderStuff/fragmentShaderMovable";

const NavBarExample = () => {
  return (
    <Navbar appearance="inverse">
      <Navbar.Header>
        <a className="navbar-brand logo">3D Visualizer</a>
      </Navbar.Header>
      <Navbar.Body>
        <Nav>
          <Nav.Item eventKey="1">Tab 1</Nav.Item>
          <Nav.Item eventKey="2">Tab 2</Nav.Item>
          <Nav.Item eventKey="3">Tab 3</Nav.Item>
        </Nav>
        <Nav pullRight>
          <Nav.Item icon={<Icon icon="cog" />}>Settings</Nav.Item>
        </Nav>
      </Navbar.Body>
    </Navbar>
  );
};


function MainContent(){ 
  return(
    <>
    <Grid fluid>
      <Row>
        <Col xs={6}>
          <Shader 
            style={{height: "100vh"}}
            shader={fs("box(p, vec3(1.0))")} 
            uniforms={{ color: { type: "3fv", value: [1.0, 1.0, 0.0] } }}
          />
        </Col>
        <Col xs={1}>
          <div style={{borderRight: "2px solid grey",  height: "100vh"}} />
        </Col>
        <Col xs={17}>
          {/* <ContextMenu/> */}
          
          <Graph/>
        </Col>
      </Row>
      
    </Grid>
    </>
  );
}

const layoutStyles = {
  display: "flex",
  flexDirection: "column",
  height: "100vh"
};

export default function App() {
  return (
    <div style={layoutStyles}>
      <Header>
        <NavBarExample />
      </Header>
      <Content style={{ flexGrow: 1 }}>
        <MainContent />
      </Content>
      <Footer>
        <Panel bordered>
          <p>Daniel Zufrí Quesada</p>
        </Panel>
      </Footer>
    </div>
  );
}
