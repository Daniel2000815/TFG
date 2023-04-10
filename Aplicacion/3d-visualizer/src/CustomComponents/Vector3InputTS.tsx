import { useEffect, useState } from "react";
import { Grid, Card, Text, Input } from "@nextui-org/react";

const headerStyke: any = {
  textAlign: "center",
  borderRadius: "3px 3px 3px 3px",
};

export default function Vector3InputTS(props: {
  handleChange: (newFields: string[]) => void;
}) {
  const [x, setX] = useState("0.0");
  const [y, setY] = useState("0.0");
  const [z, setZ] = useState("0.0");

  useEffect(() => {
    props.handleChange([x, y, z]);
  }, [x, y, z]);

  return (
    <>
    <Grid.Container gap={0.5}>
      <Grid xs={2} sm={4} md={4} key="xHeader">
        <Card style={{ ...headerStyke, backgroundColor: "red" }}>x</Card>
      </Grid>
      <Grid xs={2} sm={4} md={4} key="yHeader">
        <Card style={{ ...headerStyke, backgroundColor: "green" }}>y</Card>
      </Grid>
      <Grid xs={2} sm={4} md={4} key="zHeader">
        <Card style={{ ...headerStyke, backgroundColor: "blue" }}>z</Card>
      </Grid>

      <Grid xs={2} sm={4} md={4} key="xInput">
        <Input
        initialValue={"0.0"}
          onChange={(e) => setX(Number(e.target.value).toFixed(4))}
          bordered
          aria-label="inputX"
          size="sm"
        />
      </Grid>
      <Grid xs={2} sm={4} md={4} key="yInput">
        <Input
        initialValue={"0.0"}
          onChange={(e) => setY(Number(e.target.value).toFixed(4))}
          bordered
          size="sm"
          aria-label="inputY"
        />
      </Grid>
      <Grid xs={2} sm={4} md={4} key="zInput">
        <Input
        initialValue="0.0"
          onChange={(e) => setZ(Number(e.target.value).toFixed(4))}
          bordered
          size="sm"
          aria-label="inputZ"
        />
      </Grid>
    </Grid.Container>
    </>
  );
}
