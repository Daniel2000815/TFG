import React from "react";
import { Navbar, Button, Link, Text, Container, Col } from "@nextui-org/react";
import { Layout } from "./Layout.js";
import { AcmeLogo } from "./AcmeLogo.js";
import { createTheme, NextUIProvider } from "@nextui-org/react";
import Graph from "../GraphPage/Graph.js";
import SurfacePage from "../SurfacePage/SurfacePage.js";

const lightTheme = createTheme({
  type: "light", // it could be "light" or "dark"
  theme: {
    colors: {
      // brand colors
      primaryLight: "$green200",
      primaryLightHover: "$green300",
      primaryLightActive: "$green400",
      primaryLightContrast: "$green600",
      primary: "#4ADE7B",
      primaryBorder: "$green500",
      primaryBorderHover: "$green600",
      primarySolidHover: "$green700",
      primarySolidContrast: "$white",
      primaryShadow: "$green500",

      gradient:
        "linear-gradient(112deg, $blue100 -25%, $pink500 -10%, $purple500 80%)",
      link: "#5E1DAD",

      // you can also create your own color
      myColor: "#ff4ecd",

      // ...  more colors
    },
    space: {},
    fonts: {},
  },
});

const darkTheme = createTheme({
  type: "dark", // it could be "light" or "dark"
  theme: {
    colors: {
      // brand colors
      primaryLight: "$green200",
      primaryLightHover: "$green300",
      primaryLightActive: "$green400",
      primaryLightContrast: "$green600",
      primary: "#4ADE7B",
      primaryBorder: "$green500",
      primaryBorderHover: "$green600",
      primarySolidHover: "$green700",
      primarySolidContrast: "$white",
      primaryShadow: "$green500",

      gradient:
        "linear-gradient(112deg, $blue100 -25%, $pink500 -10%, $purple500 80%)",
      link: "#5E1DAD",

      // you can also create your own color
      myColor: "#ff4ecd",

      // ...  more colors
    },
    space: {},
    fonts: {},
  },
});

export default function App() {
  const [tab, setTab] = React.useState(0);
  const [theme, setTheme] = React.useState(lightTheme);

  return (
    
    <NextUIProvider theme={theme}>
      <Navbar maxWidth="fluid" isCompact isBordered variant="sticky">
        <Navbar.Brand>
          <Text b color="inherit" hideIn="xs">
            3D Visualizer
          </Text>
        </Navbar.Brand>
        <Navbar.Content variant="underline">
          <Navbar.Link isActive={tab === 0} onClick={() => setTab(0)}>
            Graph
          </Navbar.Link>
          <Navbar.Link isActive={tab === 1} onClick={() => setTab(1)}>
            Surfaces
          </Navbar.Link>
        </Navbar.Content>
        <Navbar.Content hideIn="xs">
          <Navbar.Item>
            <Button auto flat onClick={()=>setTheme(theme===lightTheme
               ? darkTheme : lightTheme)}>
              Test Button
            </Button>
          </Navbar.Item>
        </Navbar.Content>
      </Navbar>
      <Container gap={2} xl fluid>
      
      {tab === 0 && <Graph />}
      {tab === 1 && <SurfacePage />}
      
      </Container>
    </NextUIProvider>
    
  );
}
