import { Table, Text, Row, Col, Tooltip, Badge, Button } from "@nextui-org/react";
import { IconButton } from "./IconButton";
import "@fontsource/fira-code";
import useLocalStorage from "../storageHook";
import React, { useEffect, useState } from "react";
import { EditIcon } from "./EditIcon";
import { DeleteIcon } from "./DeleteIcon";
import { CiCirclePlus,CiRedo } from "react-icons/ci";
import { AddIcon } from "./AddIcon";

import "katex/dist/katex.min.css";
import { InputMode } from "../Types/InputMode";
import { defaultStorage } from "../defaultStorage";
var Latex = require("react-latex");

const columns = [
  { name: "NAME", uid: "name", width: "20%" },
  { name: "TYPE", uid: "inputMode", width: "10%" },
  { name: "INPUT", uid: "input", width: "50%" },
  { name: "PARAMETERS", uid: "parameters",width: "10%" },
//   { name: "SDF", uid: "sdf", minWidth: 100 },
  { name: "", uid: "actions", width: "10%" },
];

const renderCell = (data: EquationData, col: React.Key, handleEdit: Function, handleDelete: Function) => {
  console.log("aaaaass", data);
  if (col === "name") {
    return <Text>{data.name}</Text>;
  } 
  else if (col === "inputMode") {
    return <Badge isSquared>{data.inputMode}</Badge>;
  } 
  else if (col === "input") {
    return (
      <Row >
        
        {data.inputMode === InputMode.SDF ?
        <Text css={{ fontFamily: "Fira Code" }}>{data.input}</Text> :
        <Latex>{` $$ ${data.inputMode===InputMode.Implicit ? data.input[0] : data.input.join(',')} $$`}</Latex>}
      </Row>
    );
  }
  else if(col === "parameters"){
      return (
        <Latex>{`$$ ${data.parameters.map(p=>p.symbol).join(",")} $$`}</Latex>
        )
  }
//   else if (col === "sdf") {
//     return <Text css={{ fontFamily: "Fira Code" }}>{data.parsedInput}</Text>;
//   } 
    else if (col === "actions") {
    return (
      <Row justify="center" align="center">
        <Col css={{ d: "flex" }}>
          <Tooltip content="Edit">
            <IconButton onClick={() => handleEdit(data.id)}>
              <EditIcon
                size={20}
                fill="#979797"
                height={undefined}
                width={undefined}
              />
            </IconButton>
          </Tooltip>
        </Col>
        <Col css={{ d: "flex" }}>
          <Tooltip
            content="Delete"
            color="error"
            onClick={() => handleDelete(data.id)}
          >
            <IconButton>
              <DeleteIcon
                size={20}
                fill="#FF0080"
                height={undefined}
                width={undefined}
              />
            </IconButton>
          </Tooltip>
        </Col>
      </Row>
    );
  }
};


export default function SurfaceTable(props: {handleNew: Function, handleEdit: Function}) {
  const [storage, setStorage] = useLocalStorage("user_implicits");
  const [rows, setRows] = useState<EquationData[]>([]);

  useEffect(() => {
    let newRows: EquationData[] = [];
    console.log("WY ", storage);
    Object.keys(storage).forEach(function (key, index) {
      const item: EquationData = storage[key];
      console.log("DATA ", item);
      newRows.push(item);
    });

    setRows(newRows);
    
    console.log("rows", newRows);
  }, [storage]);

  const handleEdit = (id: string) => {
    props.handleEdit(id);
  }
  
  const handleDelete = (id: string) => {
    let newData : any = {};

    Object.keys(storage).forEach((k:string) => {
      if(k !== id)
        newData[k] = storage[k];
    });
      
    setStorage(newData);
    console.log(newData);
  }

  const handleRestore = () => {
    setStorage(defaultStorage);
  }

  function AddButton(){
    return (<Tooltip content="New surface"><Button auto light icon={<CiCirclePlus size={24} />} onClick={() => props.handleNew()}/></Tooltip>);
  }

  function RestoreButton(){
    return (<Tooltip content="Restore dafult"><Button auto light icon={<CiRedo size={24} />} onClick={() => handleRestore()}/></Tooltip>);
  }

  return (
    <Table
      bordered
      shadow={true}
      aria-label="Example static bordered collection table"
      css={{
        height: "auto",
        minWidth: "100%",
        alignContent: "space-around",
        justifyContent: "flex-start",
      }}
        
    >
      <Table.Header columns={columns} >
        {(column) => (
          <Table.Column
            key={column.uid}
            align={column.uid === "actions" ? "center" : "start"}
          >
            {column.uid!=="actions" ? column.name : <Row><AddButton/><RestoreButton/></Row>}
              
          </Table.Column>
        )}
      </Table.Header>
      <Table.Body items={rows}>
        {(item) => (
          <Table.Row key={item.id} >
            {(columnKey) => (
              <Table.Cell >{renderCell(item, columnKey, handleEdit, handleDelete)}</Table.Cell>
            )}
          </Table.Row>
        )}
      </Table.Body>
    </Table>
  );
}
