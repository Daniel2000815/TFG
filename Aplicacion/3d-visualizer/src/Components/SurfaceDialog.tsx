import React from "react";
import {
  Modal,
  Grid,
  Input,
  Row,
  Checkbox,
  Button,
  Text,
} from "@nextui-org/react";
import { useState, useEffect } from "react";

import "katex/dist/katex.min.css";
import useLocalStorage from "../storageHook";
import Shader from "../CustomComponents/Shader";
import CustomInputTable from "../CustomComponents/CustomInputTable";
import { Polynomial } from "../multivariate-polynomial/Polynomial";
import EquationInput from "../Components/EquationInput";
import {
  SDFInput,
  ParametricInput,
  ImplicitInput,
} from "../Components/EquationInput";
import ImplicitToSDF from "../Components/StringToSDF";
import nerdamerTS from "nerdamer-ts";
import nerdamer, { ExpressionParam } from "nerdamer";
import { InputMode } from "../Types/InputMode";
import { Expression } from "nerdamer-ts/dist/Parser/Expression";
import ParameterTable from "../Components/ParameterTable";
import { err } from "nerdamer-ts/dist/Core/Errors";
require("nerdamer/Calculus");

export default function App(props: {
  data: EquationData;
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

  const [exampleSDF, setExampleSDF] = useState("");

  // INPUT FROM DIALOG
  const [inputMath, setInputMath] = useState(["5*t^2 + 2*s^2 - 10", "s", "t"]);
  const [inputName, setInputName] = useState("");
  const [inputParameters, setInputParameters] = useState<Parameter[]>([]);

  // VALIDATION OS INPUT FROM DIALOG
  const [mathErrorMsg, setMathErrorMsg] = useState(["", "", ""]);
  const [nameErrorMsg, setNameErrorMsg] = useState("");

  const [eqInputMode, setEqInputMode] = useState(InputMode.Implicit);
  const [visible, setVisible] = React.useState(false);

  useEffect(() => {
    // if (!props.data) return;
    // setEqInputMode(props.data.inputMode);
    // setInputMath([...props.data.input]);
    // setInputParameters(props.data.parameters);
    // handleNewName(props.data.name);
    // computeExampleSDF();
  }, [props.data]);

  useEffect(() => {
    console.log("INPUT MATH NEW ", inputMath);
    handleNewEquation();
  }, [eqInputMode, inputParameters, inputMath]);

  useEffect(() => {
    computeExampleSDF();
  }, [eqData, inputParameters]);

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
    newErrorMsg = inputMath.map((input) => input==="" ? "Introduce equation" : "");
    
    inputMath.forEach((input, idx) => {
      try {
        fs.push(new Polynomial(input, ["s", "t"]));
      } catch (e: any) {
        newErrorMsg[idx] = Error(e).message;
        return [null, newErrorMsg];
      }
    });

    // PARAM -> IMPLICIT
    try {
      implicit = Polynomial.implicitateR3(fs[0], fs[1], fs[2]).toString();
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
    let newErrorMsg = ["","",""];

    // SPELL CHECK
    try {
      new Polynomial(inputMath[0]);
    } catch (e: any) {
      newErrorMsg[0] = Error(e).message;
      return [null, newErrorMsg];
    }

    try {
      return [ImplicitToSDF(inputMath[0], inputParameters), newErrorMsg];
    } catch (error: any) {
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
    }

    setMathErrorMsg(res[1]);
    console.log("FINISH HANDLING ", res[0], res[1]);
  };

  const handleSave = () => {
    // const id = inputName.toLowerCase();
    // if (id in storage) {
    //   return;
    // } else {
    //   let newData = { ...storage };
    //   const e: EquationData = {
    //     id: id,
    //     name: inputName,
    //     inputMode: eqInputMode,
    //     implicit: eqData.f.toString(),
    //     sdf: eqData.sdf.toString(),
    //     parsedSdf: eqData.parsedSdf,
    //     fHeader: `${nameInput.toLowerCase()}(vec3 p ${
    //       parametersInput.length > 0 ? "," : ""
    //     }${parametersInput.map((p) => `float ${p.symbol}`).join(",")})`,
    //     parameters: parametersInput,
    //   };
    //   newData[id] = e;
    //   setStorage(newData);
    //   handleClose();
    // }
  };

  const computeExampleSDF = () => {
    console.log("PARANUEVOS ", inputParameters);
    let newExampleSDF = eqData.parsedInput;
    inputParameters.forEach((param: Parameter) => {
      newExampleSDF = newExampleSDF?.replaceAll(
        param.symbol,
        param.defaultVal.toFixed(4).toString()
      );
    });
    console.log("EXXXXX ", newExampleSDF);
    setExampleSDF(newExampleSDF);
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
  
  const displayInputHelp = () =>{
    switch (eqInputMode) {
      case InputMode.Implicit:
        return "Write the implicit equation using variables x,y,z";

      case InputMode.Parametric:
        return "Write the parametrization of each component x,y,z using s,t as parameters"

      case InputMode.SDF:
        return "Write the SDF of the surface at a point p=(x,y,z)"

      default:
        break;
    }
  }

  function handleNewName(name: string) {
    setInputName(name);

    if (name === "") setNameErrorMsg("Introduce a name");
    else if (name.toLowerCase() in storage) {
      setNameErrorMsg("Name already in use");
    } else {
      setNameErrorMsg("");
    }
  }

  return (
    <div>
      <Button auto color="warning" shadow onPress={() => setVisible(true)}>
        Open modal
      </Button>
      <Modal
        closeButton
        blur
        aria-labelledby="modal-title"
        open={visible}
        onClose={() => setVisible(false)}
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
              <Button.Group color="primary" bordered auto>
                <Button onClick={() => setEqInputMode(InputMode.Implicit)}>
                  Implicit
                </Button>
                <Button onClick={() => setEqInputMode(InputMode.Parametric)}>
                  Parametric
                </Button>
                <Button onClick={() => setEqInputMode(InputMode.SDF)}>
                  SDF
                </Button>
              </Button.Group>
              <Text id="modal-title" size={18}>
                <Text size={16} >{displayInputHelp()}</Text>
              </Text>
            </Row>
            <Grid  xs={8}>
              <Grid.Container gap={1} direction="row" >
                <Grid xs={12}>
                  <Grid.Container gap={2} direction="column">
                    <Grid>
                      {/* {EquationInput(
                        0,
                        inputName,
                        "Name",
                        (n: string) => handleNewName(n),
                        nameErrorMsg,
                        "left",
                        "Name"
                      )} */}
                    </Grid>
                    <Grid>{displayInput()}</Grid>
                  </Grid.Container>
                </Grid>
                <Grid xs={12}>
                  <ParameterTable
                    params={inputParameters}
                    onEditParams={(newParams: Parameter[]) => {
                      setInputParameters(newParams.map((p) => p));
                      console.log("EDIT PARAMS", newParams);
                    }}
                  />
                </Grid>
              </Grid.Container>
            </Grid>
            <Grid xs={4}>
              <Shader
                sdf={exampleSDF}
                style={{ width: "100%", margin: "10px" }}
              />
            </Grid>
          </Grid.Container>
        </Modal.Body>
        <Modal.Footer>
          <Button
            auto
            flat
            color="error"
            onPress={() => setVisible(false)}
          >
            Discard
          </Button>
          <Button auto onPress={() => setVisible(false)} disabled={mathErrorMsg.some((m) => m !== "") || nameErrorMsg !== ""}>
            Save
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}
