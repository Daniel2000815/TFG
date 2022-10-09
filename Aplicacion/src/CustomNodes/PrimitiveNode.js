import React, { useEffect } from 'react';
import CustomNode from '../CustomNodes/CustomNode';
import FloatInput from '../CustomComponents/FloatInput.js';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import useLocalStorage from '../storageHook';
import newId from '../uniqueIdHook';

const theme = createTheme({
  palette: {
    primary: {
      light: '#92bcff',
      main: '#609dff',
      dark: '#166cf5',
      contrastText: 'white',
    },
  },
});

export default function PrimitiveNode({ data, id }) {
  const [primitive, setPrimitive] = React.useState('sphere');
  const [sdf, setSdf] = React.useState('');
  const [inputs, setInputs] = React.useState([1.0, 1.0, 1.0]);
  const [inputLabels, setInputLabels] = React.useState(['Radius', '', '']);
  const [storage] = useLocalStorage('user_implicits', {});

  const handleInputChange = (newVal, idx) => {
    const newInputs = [...inputs];
    newInputs[idx] = newVal;

    setInputs(newInputs);
  };

  useEffect(() => {
    if (!storage[primitive])
      return;

    const parameters = storage[primitive].parameters;

    console.log('TYPE: ' + typeof parameters[0].defaultVal);
    setInputs(
      Object.keys(parameters).map(function (k) {
        return parameters[k].defaultVal;
      })
    );
    setInputLabels(
      Object.keys(parameters).map(function (k) {
        return parameters[k].label;
      })
    );

    // setInputs(Array(parameters.length).fill().map((_, idx) => parameters[idx].defaultVal));
    console.log(parameters);
    console.log(primitive);

  }, [primitive]);

  useEffect(() => {
    if (!storage[primitive])
      return;

    const parameters = storage[primitive].parameters;
    console.log(inputs);
    setSdf(
      `${primitive}(p ${parameters.length > 0 ? ',' : ''}${parameters
        .map((p, idx) => `${inputs[idx].toFixed(4)}`)
        .join(',')})`
    );
  }, [inputs]);

  return (
    <ThemeProvider theme={theme}>
      <CustomNode
        title={'Primitive'}
        id={id}
        data={data}
        dropdownOptions={Object.keys(storage)}
        body={
          <>
            {inputs.map(function (input, idx) {
              return (
                <div key={newId('floatInputContainer_')}>
                  <FloatInput
                    val={inputs[idx]}
                    handleChange={(newVal) => handleInputChange(newVal, idx)}
                    label={inputLabels[0]}
                  />
                </div>
              );
            })}
          </>
        }
        onChangeOption={setPrimitive}
        sdf={sdf}
        currOption={primitive}
        nInputs={0}
      />
    </ThemeProvider>
  );
}
