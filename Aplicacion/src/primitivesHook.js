import React, { useEffect, useState } from 'react';
import useLocalStorage from './storageHook.js';

export const usePrimitivesHook = () => {
  const [primitives, setPrimitives] = useState('');
  const [storage, setStorage] = useLocalStorage('user_implicits', {});

  useEffect(() => {
    let res = '';

    console.log("RECALCULANDO PRIMITIVAS GLSL");
    for (let key in storage) {
        console.log(key);
        let p = storage[key];
        res += 
        `float ${p.fName}(vec3 p){
            float x = p.r;
            float y = p.g;
            float z = p.b;

            return ${p.parsedSdf};
        }\n`
      }

      setPrimitives(res);

      console.log(res);
  }, [storage]);

  return [primitives, setPrimitives];
};

export default usePrimitivesHook;