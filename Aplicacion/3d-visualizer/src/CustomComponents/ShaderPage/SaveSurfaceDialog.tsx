import { Modal, Text, Input, Button } from "@nextui-org/react";
import useLocalStorage from "../../Utils/storageHook";
import { useEffect, useState } from "react";
import EquationInput from "../MaterialPage/EquationInput";
import { InputMode } from "../../Types/InputMode";
import transformToValidName from "../../Utils/transformToValidName";

export default function SaveSurfaceDialog(props:{sdf:string, visible: boolean, onClose: ()=>void, onSubmit: ()=>void}){
    const [storage, setStorage] = useLocalStorage("user_implicits");
    const [name, setName] = useState("");
    const [errorMsg, setErrorMsg] = useState("");

    const nameInUse = () : boolean => {
        const id = name.replace(" ", "").toLowerCase();
        return id in storage;
    }

    useEffect(()=>{
        console.log(transformToValidName(name));
        if(name === ""){
            setErrorMsg("Introduce a name");
        }
        else if(nameInUse()){
            setErrorMsg("Name already in use");
            return;
        }
        else{
            setErrorMsg("");
            return;
        }
    }, [name])

    const handleSave = () => {
        const id = transformToValidName(name);


      let newData: any = {...storage};
      const e: EquationData = {
        id: id,
        name: name,
        inputMode: InputMode.SDF,
        input: [props.sdf, "", ""],
        parsedInput: props.sdf,
        parameters: [],
        fHeader: `${id}(vec3 p)`,
      };

      newData[id] = e;
      console.log("STORING ", e);
      setStorage(newData);
      console.log(storage);
    

        props.onClose();
    }

    return(
      <Modal
          closeButton
          blur
          aria-labelledby="modal-title"
          open={props.visible}
          onClose={props.onClose}
          width="50%"
          css={{minHeight: "275px"}}
        >
          <Modal.Header>
            <Text b id="modal-title" size={18}>
              Save surface
            </Text>
          </Modal.Header>
          <Modal.Body>
          <Text id="modal-input" size={18}>
            Introduce name:
            </Text>
            {EquationInput(
                        0,
                        name,
                        "Name",
                        (n: string) => setName(n),
                        errorMsg,
                        "left",
                        "Name"
                      )}
          </Modal.Body>
          <Modal.Footer>
            <Button auto flat color="error" onPress={()=>props.onClose()}>
              Close
            </Button>
            <Button disabled={errorMsg!==""} auto onPress={()=>handleSave()}>
              Save
            </Button>
          </Modal.Footer>
        </Modal>
    );
  }