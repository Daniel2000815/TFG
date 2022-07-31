import React from "react";

import Dropdown from "./Dropdown";

const BooleanOperations = {
  Union: "Union",
  Difference: "Difference",
  Intersection: "Intersection",
};

export default function BooleanNode({ data, id }) {
  const [operation, setOperation] = React.useState(BooleanOperations.Union);

  return (
    <div className="custom-node">
      <div className="custom-node-header">Primitive</div>
      <Dropdown
        value={operation}
        onChange={setOperation}
        items={[
          BooleanOperations.Union,
          BooleanOperations.Difference,
          BooleanOperations.Intersection,
        ]}
        label="Primitives"
      />
    </div>
  );
}
