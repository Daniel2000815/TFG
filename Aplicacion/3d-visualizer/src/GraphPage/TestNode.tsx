import { Card, Grid, Text, Button, Row } from "@nextui-org/react";
import EquationInput from "../Components/EquationInput";

export default function App() {
  return (
    <Card variant="bordered" css={{ mw: "330px" }}>
      <Card.Header css={{width: "100%", maxHeight: "30px"}}>
        <Text b>Card Title</Text>
      </Card.Header>
      <Card.Divider />
      <Card.Body css={{ py: "$10" }}>
        <Text>
          Some quick example text to build on the card title and make up the
          bulk of the card's content.
        </Text>
        {EquationInput(0, "test 1", "t1", ()=>{}, "", "left", "x")}
        {EquationInput(1, "test 1", "t1", ()=>{}, "", "left", "y")}
        {EquationInput(2, "test 1", "t1", ()=>{}, "", "left", "z")}
      </Card.Body>
      <Card.Footer>
          <Button flat css={{width: "100%", maxHeight: "20px"}}>Agree</Button>
      </Card.Footer>
    </Card>
  );
}
