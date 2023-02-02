import { useEffect, useState } from 'react';
import useLocalStorage from './storageHook.js';

export const usePrimitivesHook = () => {
  const [primitives, setPrimitives] = useState('');
  const [storage] = useLocalStorage('user_implicits', {});

  useEffect(() => {
    let res = '';

    console.log("RECALCULANDO PRIMITIVAS GLSL");
    for (let key in storage) {
      console.log(key);
      let p = storage[key];
      res +=
        `float ${p.fHeader}{
            float x = p.r;
            float y = p.g;
            float z = p.b;

            ${p.parsedSdf};
        }\n`
    }

    console.log("PRIM " + res);
    setPrimitives(res);
  }, [storage]);

  return [primitives, setPrimitives];
};

export default usePrimitivesHook;