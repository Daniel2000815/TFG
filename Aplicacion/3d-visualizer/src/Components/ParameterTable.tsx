import React, { useEffect } from "react";
import {
  Grid,
  Card,
  Text,
  Row,
  Input,
  Button,
  FormElement,
} from "@nextui-org/react";
import {Delete} from "react-iconly";
import { set } from "nerdamer-ts/dist/Functions/Core";
import { DeleteIcon } from "../SurfacePage/DeleteIcon";
import { CiCirclePlus,CiRedo } from "react-icons/ci";
const defaultParameter = {
  symbol: "",
  label: "",
  defaultVal: 0,
};

function findDuplicateIndices(arr: string[]): number[] {
  const counts: { [key: string]: number[] } = {};
  const duplicates: number[] = [];

  // count the number of occurrences of each element
  arr.forEach((element, index) => {
    if (counts[element] === undefined) {
      counts[element] = [index];
    } else {
      counts[element].push(index);
    }
  });

  // identify elements that appear more than once
  for (const element in counts) {
    if (counts[element].length > 1 && element!=="") {
      duplicates.push(...counts[element]);
    }
  }

  return duplicates;
}

export default function ParameterTable(props: {
  params: Parameter[];
  onEditParams: Function;
}) {
  const [params, setParams] = React.useState<Parameter[]>(props.params);
  const [errorMsgs, setErrorMsgs] = React.useState<string[][]>(
    props.params.map(() => ["", "", ""])
  );

  const editParam = (idx: number, field: 0 | 1 | 2, val: string) => {
    let newParams = params.map(p => p);
    var newErrors = errorMsgs.map(function (arr) {
      return arr.slice();
    });

    console.log("REOLD: ", params, val);

    switch (field) {
      case 0:
        console.log("CHANGING PARAM ", idx);
        console.log("OLD: ", newParams);
        newParams[idx].symbol = val;
        console.log("NEW: ", newParams);
        if (val === "") newErrors[idx][0] = "Introduce symbol";
        else {
          const duplicateItems = findDuplicateIndices(
            newParams.map((p) => p.symbol)
          );

          for (let i = 0; i < newParams.length; i++) {
            newErrors[i][0] = duplicateItems.includes(i)
              ? "Symbol must be unique"
              : "";
          }
        }

        break;
      case 1:
        newErrors[idx][1] =  val === "" ? "Introduce label" : "";
        newParams[idx].label = val;
        break;
      case 2:
        console.log("CHECIING ", val, " : ", val==="");
        newErrors[idx][2] = val === "" ? "Introduce default value" : "";
        newParams[idx].defaultVal = Number(val);
        break;
      default:
        break;
    }

    console.log(newParams);

    setErrorMsgs(newErrors);

    const error = newErrors.some((e) => e.some((ee) => ee !== ""));

    if (!error){
      setParams(newParams);
      console.log("EDIT PARAMS2 " , params);
      
    }
    else{
      console.log("PARAM ERROR: ", newErrors);
    }
  };

  useEffect(()=>{
    props.onEditParams(params);
  }, [params])

  const handleCreateParam = () => {
    setErrorMsgs([...errorMsgs, ["", "", ""]]);
    let copy = params.map(p => p);
    setParams(copy.concat({
      symbol: "",
      label: "",
      defaultVal: 0,
    }));

    setErrorMsgs([...errorMsgs, ["Introduce symbol", "Introduce label", ""]]);
  };

  const handleDeleteParam = (idx: number) => {
    console.log("BEFORE DELETE ", idx, ": ", params);

    setParams(params.filter((val,i) => i!==idx));
    setErrorMsgs(errorMsgs.filter((val,i) => i!==idx));
    console.log("AFTER DELETE ", idx, ": ", params.filter((val,i) => i!==idx));
    
  }

  function ParamInput(i: number,field: 0 | 1 | 2,value: string,label: string, type: "number"|"default" = "default") {
    console.log("RENDERING ", i);
    console.log(errorMsgs);
    const color = errorMsgs[i][field] === "" ? "default" : "error";

    return (
      <Input
          onChange={(e) => editParam(i, field, e.target.value.toString())}
          color={color}
          helperColor={
            color
          }
          type={type}
          value={value}
          aria-label={label}
          fullWidth
          status={errorMsgs[i][field] === "" ? "default" : "error"}
          helperText={errorMsgs[i][field]}
      />
    );
  }



  return (
    <Card variant="bordered" >
      <Card.Header>
        <Row align="stretch" justify="space-between">
          <Text h5>Parameters</Text>

          <Button
            icon={<CiCirclePlus size={24}/>}
            onClick={() => handleCreateParam()}
            css={{ height: "30px", width: "20px" }}
            light
            auto
            disabled={params.length >= 4}
            color="primary"
            rounded
          />
          
        </Row>
      </Card.Header>
      <Card.Body>
        <Grid.Container gap={1}>
          <Grid xs={3}>
            <Text h6>Symbol</Text>
          </Grid>
          <Grid xs={5}>
            <Text h6>Label</Text>
          </Grid>
          <Grid xs={3}>
            <Text h6>Default Value</Text>
          </Grid>
          {params.map((p, i) => (
            <>
            <Grid xs={3}>{ParamInput(i, 0, p.symbol, "Symbol")}</Grid>
            <Grid xs={5}>{ParamInput(i, 1, p.label, "Label")}</Grid>
            <Grid xs={3}>{ParamInput(i, 2, p.defaultVal.toString(), "Default Value", "number")}</Grid>
            <Grid xs={1}><Button onClick={()=>handleDeleteParam(i)} icon={"x"} auto/>
              </Grid>
              </>
          ))}
        </Grid.Container>
      </Card.Body>
    </Card>
  );
}
