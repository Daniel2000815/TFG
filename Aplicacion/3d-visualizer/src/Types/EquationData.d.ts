import { Interface } from "readline";

export {};

declare global {

  type EquationData = {
    id: string, // identifier to save in local storage
    name: string,
    inputMode: string
    input: string
    parsedInput: string,
    parameters: Parameter[],
    fHeader: string,
  }

  interface Parameter {
    symbol: string; 
    label: string; 
    defaultVal: number
  }

}

