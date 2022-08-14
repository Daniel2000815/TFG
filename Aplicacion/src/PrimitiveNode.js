import React, { useEffect } from "react";
import CustomNode from "./CustomNode";

const Primitives = {
  Sphere: "Sphere",
  Box: "Box",
  Torus: "Torus",
  Cylinder: "Cylinder",
};

export default function PrimitiveNode({ data, id }) {
  const [primitive, setPrimitive] = React.useState(Primitives.Sphere);
  const [sdf, setSdf] = React.useState("");
  const [inputs, setInputs] = React.useState([1.0, 1.0, 1.0]);
  const [inputLabels, setInputLabels] = React.useState(["Radius", "", ""]);
  const [inputsActive, setInputsActive] = React.useState([true, false, false]);

  const prepareInputs = (label1, label2 = "", label3 = "") => {
    setInputLabels([label1, label2, label3]);
    setInputsActive([label1, label2, label3]);
  };
  useEffect(() => {
    console.log("ACTUALIZADO SDF");
    if (primitive == Primitives.Sphere) {
      setSdf(`sphere(p, ${inputs[0].toFixed(4)})`);
      prepareInputs("radius");
    } else if (primitive == Primitives.Box) {
      setSdf(
        `box(p, vec3(
          ${inputs[0].toFixed(4)}, 
          ${inputs[1].toFixed(4)}, 
          ${inputs[2].toFixed(4)}
          )
        )`
      );
      prepareInputs("sx", "sy", "sz");
    } else if (primitive == Primitives.Torus) {
      setSdf(
        `torus(p, vec2(
          ${inputs[0].toFixed(4)}, 
          ${inputs[1].toFixed(4)}
          )
        )`
      );
      prepareInputs("hole", "thickness");
    } else if (primitive == Primitives.Cylinder) {
      setSdf(
        `cylinder(p, 
          ${inputs[0].toFixed(4)}, 
          ${inputs[1].toFixed(4)}
        )`
      );
      prepareInputs("height", "radius");
    }
  }, [primitive, inputs]);

  return (
    <CustomNode
        title={"!Primitive"}
      id={id}
      data={data}
      dropdownOptions={Object.values(Primitives)}
      onChangeOption={setPrimitive}
      sdf={sdf}
    />
  );
}
