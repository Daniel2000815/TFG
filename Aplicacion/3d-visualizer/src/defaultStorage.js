import { InputMode } from './Types/InputMode';

export const defaultStorage = {
    sphere: {
      id: 'sphere',
      name: 'Sphere',
      inputMode: InputMode.Implicit,
      input: ['x^2 + y^2 + z^2 - r','',''],
      parsedInput: 'length(p)-r',
      parameters: [{ symbol: 'r', label: 'Radius', defaultVal: 1.0 }],
      fHeader: 'sphere(vec3 p, float r)',
    },
    torus: {
      id: 'torus',
      name: 'Torus',
      inputMode: InputMode.SDF,
      input: ['length(vec2(length(p.xz)-R,p.y)) - r','',''],
      parsedInput: 'length(vec2(length(p.xz)-R,p.y)) - r',
      parameters: [{ symbol: 'R', label: 'Radius 1', defaultVal: 2.0 }, { symbol: 'r', label: 'Radius 2', defaultVal: 1.0 }],
      fHeader: 'torus(vec3 p, float R, float r)',
    },
    cube: {
      id: 'cube',
      name: 'Cube',
      inputMode: InputMode.SDF,
      input: ['length(max(abs(p) - vec3(l),0.0)) + min(max(abs(p.x) - l,max(abs(p.y) - l,abs(p.z) - l)),0.0)','',''],
      parsedInput: 'length(max(abs(p) - vec3(l),0.0)) + min(max(abs(p.x) - l,max(abs(p.y) - l,abs(p.z) - l)),0.0)',
      parameters: [{ symbol: 'l', label: 'side', defaultVal: 1.0 }],
      fHeader: 'cube(vec3 p, float l)',
    },
    ellipsoid: {
      id: 'ellipsoid',
      name: "Ellipsoid",
      inputMode: InputMode.Parametric,
      input: ['s','t','s^2+t^2'],
      parsedInput: '(-z + pow(x, 2.0000) + pow(y, 2.0000)) * pow(sqrt(1.0000 + 4.0000 * pow(x, 2.0000) + 4.0000 * pow(y, 2.0000)), -1.0000)',
      parameters: [],
      fHeader: 'ellipsoid(vec3 p)',
    }
  
  }