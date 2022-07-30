import React from "react";
import { Panel, PanelGroup } from "rsuite";

export default function () {
  return (
    <PanelGroup
      shaded
      bordered
      bodyFill
      style={{ display: "inline-block", width: 70 }}
    >
      <Panel>hola</Panel>
      <Panel>hola</Panel>
      <Panel>hola</Panel>
    </PanelGroup>
  );
}
