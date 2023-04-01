import { Card, Grid, Text, Button, Row } from "@nextui-org/react";
import { useState } from "react";
import EquationInput from "../Components/EquationInput";
import { createTheme, NextUIProvider } from "@nextui-org/react";
import ThreeShader from "./ThreeShader";

const theme = createTheme({
  type: "dark", // it could be "light" or "dark"
  theme: {
    colors: {
      // brand colors

      primary: "#4ADE7B",
      primaryBorder: "$green500",

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

  const [collapse, setCollapse] = useState(false);

  return (
    <NextUIProvider theme={theme}>
    <Card borderWeight="extrabold" variant="bordered" css={{ borderColor: "$primary", mw: "330px" }}>
      <Card.Header css={{width: "100%", maxHeight: "30px"}}>
        <Text b>Card Title</Text>
      </Card.Header>
      <Card.Divider css={{bgColor: "$primary"}}/>
      {!collapse && <Card.Body css={{ py: "$10" }}>
        <Text>
          Some quick example text to build on the card title and make up the
          bulk of the card's content.
        </Text>
        {EquationInput(0, "test 1", "t1", ()=>{}, "", "left", "x")}
        {EquationInput(1, "test 1", "t1", ()=>{}, "", "left", "y")}
        {EquationInput(2, "test 1", "t1", ()=>{}, "", "left", "z")}
        <ThreeShader/>
      </Card.Body>}
      <Card.Footer>
          <Button onClick={()=>setCollapse(!collapse)} flat css={{width: "100%", maxHeight: "20px"}}>Agree</Button>
      </Card.Footer>
    </Card>
    </NextUIProvider>
  );
}
