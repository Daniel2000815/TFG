import { Interface } from "readline";

export {};

declare global {
  type NodeSDFData = {

    default?: string;
    inputs: { [id: string]: string };
    sdf: string;
    children: string[];
    
  };

  type NodeData = {
    id: string;
    type: string;
    position: { x: number; y: number };
    dragHandle: string;
    data: NodeSDFData;
  }
}
