import { useEffect, useState } from 'react';

// torus: (x^2+y^2+z^2+R^2-a^2)^2 - 4R^2(x^2+y^2)

const defaultStorage = {
  sphere: {
    id: 'sphere',
    name: 'Sphere',
    implicit: 'x^2 + y^2 + z^2 - r',
    sdf: '|p|-r',
    parsedSdf: 'return length(p)-r',
    fHeader: 'sphere(vec3 p, float r)',
    parameters: [{ symbol: 'r', label: 'Radius', defaultVal: 1.0 }],
  },
  // cube: {
  //   id: 'cube',
  //   name: 'Cube',
  //   implicit: 'max(|x|,|y|,|z|)-1',
  //   sdf: '|max((|x|,|y|,|z|),(sx,sy,sz))| + min(max(|x| - sx, max(|y|-sy, |z|-sz)), 0)',
  //   parsedSdf: `
  //     vec3 b = vec3(sx,sy,sz);
  //     vec3 q = abs(p) - b;
  //     return length(max(q,0.0)) + min(max(q.x,max(q.y,q.z)),0.0);
  //   `,
  //   fHeader: 'cube(vec3 p, float sx, float sy, float sz)',
  //   parameters: [
  //     { symbol: 'sx', label: 'sx', defaultVal: 1.0 },
  //     { symbol: 'sy', label: 'sz', defaultVal: 1.0 },
  //     { symbol: 'sz', label: 'sz', defaultVal: 1.0 }
  //   ],
  // },

}

export const useLocalStorage = (key) => {
  const [storedValue, setStoredValue] = useState(() => {
    // localStorage.clear();
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : defaultStorage;
    } catch (err) {
      console.error(err);
      window.dispatchEvent(new Event('storage'));
      return defaultStorage;
    }
  });

  const setValue = (value) => {
    try {
      const valueToStore =
        value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      localStorage.setItem(key, JSON.stringify(valueToStore));
      window.dispatchEvent(new Event('storage'));
    } catch (err) {
      console.error(err);
    }
  };

  // useEffect(() => {
  //   window.dispatchEvent(new Event("storage"));
  // }, [storedValue]);

  useEffect(() => {
    const listenStorageChange = () => {
      setStoredValue(() => {
        const value = localStorage.getItem(key);
        if (value !== null) {
          return JSON.parse(value);
        }

        localStorage.setItem(key, JSON.stringify(defaultStorage));
        window.dispatchEvent(new Event('storage'));
        return defaultStorage;
      });
    };
    window.addEventListener('storage', listenStorageChange);
    return () => window.removeEventListener('storage', listenStorageChange);
  }, []);

  return [storedValue, setValue];
};

export default useLocalStorage;
