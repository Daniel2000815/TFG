import React from "react";
import {
  Modal,
  Grid,
  Row,
  Col,
  Button,
  Text,
  Collapse,
  Input,
} from "@nextui-org/react";
import { useState, useEffect } from "react";
import { SizeMe } from "react-sizeme";

import "katex/dist/katex.min.css";
import useLocalStorage from "../Utils/storageHook";
import Shader from "../CustomComponents/ShaderGL";
import { Polynomial } from "../multivariate-polynomial/Polynomial";
import EquationInput from "../CustomComponents/MaterialPage/EquationInput";
import {
  SDFInput,
  ParametricInput,
  ImplicitInput,
} from "../CustomComponents/MaterialPage/EquationInput";

import ColorPick from "../CustomComponents/MaterialPage/ColorPicker";
import ImplicitToSDF from "../Utils/StringToSDF";

import { InputMode } from "../Types/InputMode";
import ParameterTable from "../CustomComponents/MaterialPage/ParameterTable";
import MaterialInput from "../CustomComponents/MaterialPage/MaterialInput";
import "katex/dist/katex.min.css";
import { defaultMaterial } from "../Defaults/defaultMaterial";
import transformToValidName from "../Utils/transformToValidName";

var Latex = require("react-latex");

require("nerdamer/Calculus");


export default function App(props: {
  initialID: string;
  handleClose: Function;
  open: boolean;
}) {
  const [storage, setStorage] = useLocalStorage("user_implicits");

  const [eqData, setEqData] = useState({
    id: "",
    name: "",
    inputMode: InputMode.Implicit,
    input: "",
    parsedInput: "",
    parameters: [""],
    fHeader: "",
  });

  // PREVIEW
  const [exampleSDF, setExampleSDF] = useState("");
  const [exampleShaderFunction, setExampleShaderFunction] = useState("");

  // INPUT FROM DIALOG
  const [inputMath, setInputMath] = useState(["5*t^2 + 2*s^2 - 10", "s", "t"]);
  const [inputName, setInputName] = useState("");
  const [inputParameters, setInputParameters] = useState<Parameter[]>([]);
  const [inputMaterial, setInputMaterial] = useState<Material>(defaultMaterial);

  // VALIDATION OS INPUT FROM DIALOG
  const [mathErrorMsg, setMathErrorMsg] = useState(["", "", ""]);
  const [nameErrorMsg, setNameErrorMsg] = useState("");

  const [eqInputMode, setEqInputMode] = useState(InputMode.Implicit);

  useEffect(() => {
    // if (!props.data) return;
    // setEqInputMode(props.data.inputMode);
    // setInputMath([...props.data.input]);
    // setInputParameters(props.data.parameters);
    // handleNewName(props.data.name);
    // computeExampleSDF();
  }, [props.initialID]);

  useEffect(() => {
    console.log("INPUT MATH NEW ", inputMath);
    handleNewEquation();
  }, [eqInputMode, inputParameters, inputMath]);

  useEffect(() => {
    handleNewName();
  }, [inputName]);

  useEffect(() => {
    const initialSurf: EquationData = storage[props.initialID];
    if (initialSurf) {
      setEqInputMode(initialSurf.inputMode);
      console.log("TEST ", initialSurf);
      console.log("TEST ", initialSurf.input);
      if (initialSurf.inputMode === InputMode.Parametric) {
        setInputMath([
          initialSurf.input[0],
          initialSurf.input[1],
          initialSurf.input[2],
        ]);
      } else {
        setInputMath([initialSurf.input[0], "", ""]);
        console.log("TEST ", inputMath);
      }

      setInputName(initialSurf.name);

      setInputParameters(initialSurf.parameters);
      computeExampleSDF(initialSurf.parsedInput);
    } else {
      setInputMath(["", "", ""]);
      setInputName("");
      setExampleSDF("");
      setInputParameters([]);
    }
  }, [props.open]);

  // const latexInfo = () => {
  //   const implicit =
  //     eqData && validEq ? nerdamer.convertToLaTeX(eqData.f.toString()) : "";
  //   const dx =
  //     eqData && validEq ? nerdamer.convertToLaTeX(eqData.dx.toString()) : "";
  //   const dy =
  //     eqData && validEq ? nerdamer.convertToLaTeX(eqData.dy.toString()) : "";
  //   const dz =
  //     eqData && validEq ? nerdamer.convertToLaTeX(eqData.dz.toString()) : "";
  //   const norm =
  //     eqData && validEq ? nerdamer.convertToLaTeX(eqData.norm.toString()) : "";
  //   const sdf =
  //     eqData && validEq ? nerdamer.convertToLaTeX(eqData.sdf.toString()) : "";

  //   return `\\begin{align*}
  //         f(x,y,z) &=  ${implicit} \\\\[10pt]
  //         \\nabla f(x,y,z) &= \\left(
  //           ${dx},
  //           ${dy},
  //           ${dz}
  //         \\right) \\\\[10pt]
  //         \\Vert \\nabla f(x,y,z) \\Vert &= ${norm} \\\\[10pt]
  //         \\text{sdf}(x,y,z) &= ${sdf}
  //       \\end{align*}`;
  // };

  const handleNewEquationParam = (): [string | null, string[]] => {
    console.log("HANDLING PARAMETRIC ", mathErrorMsg);
    let implicit = "";
    let newErrorMsg = ["", "", ""];
    let fs: Polynomial[] = [];

    // SPELL CHECK
    newErrorMsg = inputMath.map((input) =>
      input === "" ? "Introduce equation" : ""
    );

    if(newErrorMsg.some(m => m!==""))
      return [null, newErrorMsg];

    inputMath.forEach((input, idx) => {
      try {
        fs.push(
          new Polynomial(
            input,
            ["s", "t"].concat(inputParameters.map((p) => p.symbol))
          )
        );
      } catch (e: any) {
        newErrorMsg[idx] = Error(e).message;
        return [null, newErrorMsg];
      }
    });

    // PARAM -> IMPLICIT
    try {
      implicit = Polynomial.implicitateR3(fs[0], fs[1], fs[2], inputParameters.map((p) => p.symbol)).toString(true);
      console.log("AQUI: ", fs[0].toString(), fs[1].toString(), fs[2].toString(), implicit);
    } catch (error: any) {
      newErrorMsg.fill(Error(error).message);
      return [null, newErrorMsg];
    }

    // IMPLICIT -> SDF
    try {
      return [ImplicitToSDF(implicit, inputParameters), newErrorMsg];
    } catch (error: any) {
      newErrorMsg.fill(Error(error).message);
      return [null, newErrorMsg];
    }
  };

  const handleNewEquationImp = (): [string | null, string[]] => {
    console.log("HANDLING IMPLICIT ", inputMath[0]);
    let newErrorMsg = ["", "", ""];

    // SPELL CHECK
    try {
      new Polynomial(
        inputMath[0],
        ["x", "y", "z"].concat(inputParameters.map((p) => p.symbol))
      );
    } catch (e: any) {
      console.log("SPELL CHECK ", Error(e).message);
      newErrorMsg[0] = Error(e).message;
      return [null, newErrorMsg];
    }

    try {
      console.log("COMPUTING IMPLICIT SDF");
      let r = ImplicitToSDF(inputMath[0], inputParameters);
      console.log("HECHO", ImplicitToSDF(inputMath[0], inputParameters, true));
      setExampleSDF(ImplicitToSDF(inputMath[0], inputParameters, true));
      return [r, newErrorMsg];
    } catch (error: any) {
      console.log("error:", Error(error).message);
      newErrorMsg.fill(Error(error).message);
      return [null, newErrorMsg];
    }
  };

  const handleNewEquationSDF = (): [string, string[]] => {
    return [inputMath[0], ["", "", ""]];
  };

  const handleNewEquation = () => {
    let res: [string | null, string[]] = [null, ["", "", ""]];
    switch (eqInputMode) {
      case InputMode.Parametric:
        res = handleNewEquationParam();
        break;
      case InputMode.Implicit:
        res = handleNewEquationImp();
        break;
      case InputMode.SDF:
        res = handleNewEquationSDF();
        break;
      default:
        break;
    }

    if (res[0] !== null) {
      setEqData({ ...eqData, parsedInput: res[0] });
      computeExampleSDF(res[0]);
    }
    setMathErrorMsg(res[1]);
    console.log("FINISH HANDLING ", exampleSDF);
  };

  const handleSave = () => {
    const id = transformToValidName(inputName);

    if (nameInUse(inputName)) {
      return;
    } else {
      let newData: any = {};
      const e: EquationData = {
        id: id,
        name: inputName,
        inputMode: eqInputMode,
        input: inputMath,
        parsedInput: eqData.parsedInput,
        parameters: inputParameters,
        fHeader: `${id}(vec3 p ${
          inputParameters.length > 0 ? "," : ""
        }${inputParameters.map((p) => `float ${p.symbol}`).join(",")})`,
      };

      Object.keys(storage).forEach((k: string) => {
        if (props.initialID === id || k !== props.initialID)
          newData[k] = storage[k];
      });

      newData[id] = e;
      console.log("STORING ", e);
      setStorage(newData);
      console.log(storage);
    }

    props.handleClose();
  };

  const computeExampleSDF = (parsedSDF: string) => {
    let exampleHeader = `exampleSDF(vec3 p ${
      inputParameters.length > 0 ? "," : ""
    }${inputParameters.map((p) => `float ${p.symbol}`).join(",")})`;

    let shaderFunction = `float ${exampleHeader}{
        float x = p.r;
        float y = p.g;
        float z = p.b;
  
        return ${parsedSDF};
    }\n`;

    setExampleShaderFunction(shaderFunction);
    setExampleSDF(
      `exampleSDF(p${inputParameters.length > 0 ? "," : ""}${inputParameters
        .map((p, idx) => `${p.defaultVal.toFixed(4)}`)
        .join(",")})`
    );
  };

  const displayInput = () => {
    switch (eqInputMode) {
      case InputMode.Implicit:
        return ImplicitInput(
          inputMath,
          (newInputMath: string[]) => setInputMath(newInputMath),
          mathErrorMsg[0]
        );

      case InputMode.Parametric:
        return ParametricInput(
          inputMath,
          (newInputMath: string[]) => setInputMath(newInputMath),
          mathErrorMsg
        );

      case InputMode.SDF:
        return SDFInput(
          inputMath,
          (newInputMath: string[]) => setInputMath(newInputMath),
          mathErrorMsg[0]
        );

      default:
        break;
    }
  };

  const displayInputHelp = () => {
    switch (eqInputMode) {
      case InputMode.Implicit:
        return (
          <Latex>{`Write the implicit equation using variables $$ x,y,z$$.`}</Latex>
        );

      case InputMode.Parametric:
        return (
          <Latex>{`Write the parametrization of each component $$x,y,z$$ using $$s,t$$ as parameters.`}</Latex>
        );

      case InputMode.SDF:
        return (
          <Latex>{`Write the SDF of the surface at a point $$p=(x,y,z)$$. You can use any $$\\texttt{glsl}$$ function.`}</Latex>
        );

      default:
        break;
    }
  };

  function nameInUse(name: string) {
    const id = transformToValidName(name);
    if (props.initialID === "") return id in storage;
    else {
      return id !== props.initialID && id in storage;
    }
  }

  function handleNewName() {
    if (inputName === "") setNameErrorMsg("Introduce a name");
    else if (nameInUse(inputName)) {
      setNameErrorMsg("Name already in use");
    } else {
      setNameErrorMsg("");
    }
  }

  function handleShaderError(e: string){
    const regex = /ERROR: 0:255: ([^\n]+)/;
const match = e.match(regex);
const errorMessage = match ? match[1] : "No error message found";

console.log(errorMessage);

    setMathErrorMsg([errorMessage,"",""])
  }

  return (
    <div>
      <Modal
        closeButton
        blur
        aria-labelledby="modal-title"
        open={props.open}
        onClose={() => props.handleClose()}
        width="75%"
        css={{ minHeight: "90vh" }}
      >
        <Modal.Header>
          <Text id="modal-title" size={18}>
            <Text b size={18}>
              New Surface
            </Text>
          </Text>
        </Modal.Header>
        <Modal.Body>
          <Grid.Container
            alignItems="center"
            alignContent="space-between"
            justify="space-between"
            direction="row"
          >
            <Row align="center" justify="flex-start">
              <Button.Group  auto>
                <Button
                  flat={eqInputMode===InputMode.Implicit}
                  onClick={() => setEqInputMode(InputMode.Implicit)}
                >
                  Implicit
                </Button>
                <Button
                flat={eqInputMode===InputMode.Parametric}
                  onClick={() => setEqInputMode(InputMode.Parametric)}
                >
                  Parametric
                </Button>
                <Button
                flat={eqInputMode===InputMode.SDF}
                  onClick={() => setEqInputMode(InputMode.SDF)}
                >
                  SDF
                </Button>
              </Button.Group>
              <Text id="modal-title" size={18}>
                <Text size={16}>{displayInputHelp()}</Text>
              </Text>
            </Row>
            <Grid xs={8}>
              <Grid.Container gap={1} direction="row">
                <Grid xs={12}>
                  <Grid.Container gap={2} direction="column">
                    <Grid>
                      {EquationInput(
                        0,
                        inputName,
                        "Name",
                        (n: string) => setInputName(n),
                        nameErrorMsg,
                        "left",
                        "Name"
                      )}
                    </Grid>
                    <Grid>{displayInput()}</Grid>
                  </Grid.Container>
                </Grid>
                <Grid.Container gap={2}>
                  <Grid xs={12}>
                    <Collapse.Group bordered >
                      <Collapse
      
                        title={
                          <Row align="center">
                            <Text h4>Parameters</Text>
                            <Latex>{`$$\\quad $$ ${inputParameters.map(
                              (p) => `$$ ${p.symbol} $$`
                            )}`}</Latex>
                          </Row>
                        }
                      >
                        <ParameterTable
                          params={inputParameters}
                          onEditParams={(newParams: Parameter[]) => {
                            setInputParameters(newParams.map((p) => p));
                            console.log("EDIT PARAMS", newParams);
                          }}
                        />
                      </Collapse>
                      <Collapse
                        title={
                          <Row align="center">
                            <Text h4>Material</Text>
                          </Row>
                        }
                      >
                        <MaterialInput
                          handleChange={(m: Material) => setInputMaterial(m)}
                        />
                      </Collapse>
                    </Collapse.Group>
                  </Grid>
                </Grid.Container>
              </Grid.Container>
            </Grid>
            <SizeMe monitorHeight>
              {({ size }) => (
                <Grid style={{ height: "200px" }} xs={4}>
                  <Shader
                    sdf={exampleSDF}
                    primitives={exampleShaderFunction}
                    material={inputMaterial}
                    width={size.width}
                    height={size.height}
                    onError={(e:string) => handleShaderError(e)}
                  />
                </Grid>
              )}
            </SizeMe>
          </Grid.Container>
        </Modal.Body>
        <Modal.Footer>
          <Button auto flat color="error" onPress={() => props.handleClose()}>
            Discard
          </Button>
          <Button
            auto
            onPress={() => handleSave()}
            disabled={mathErrorMsg.some((m) => m !== "") || nameErrorMsg !== ""}
          >
            Save
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}
