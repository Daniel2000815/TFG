import { Canvas } from '@react-three/fiber';
import { useRef } from 'react';

const fragmentShader = `...`;
const vertexShader = `...`;

const Cube = () => {
  const mesh = useRef();

  return (
    <mesh >
      <boxGeometry args={[1, 1, 1]} />
      <shaderMaterial
        fragmentShader={fragmentShader}
        vertexShader={vertexShader}
      />
    </mesh>
  );
};

export default function ThreeShader () {
  
  return(<Canvas>
    <Cube />
  </Canvas>);
};