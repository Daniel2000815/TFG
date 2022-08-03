# TFG

## Aplicación
- Abrir el archivo [./Aplicacion/build/index.html](./Aplicacion/build/index.html).
- A la izquierda aparece un canvas con un shader de prueba, que se puede consultar en [./Aplicacion/src/fragmentShaderMovable.js](./Aplicacion/src/fragmentShaderMovable.js). En él se puede girar la cámara en torno al cubo si se mantiene el click izquierdo. También se puede ejecutar a parte con el archivo [./Aplicacion/src/cameraShader.glsl](./Aplicacion/src/cameraShader.glsl), con la diferencia de que en este la cámara se mueve aunque no se haga click con el ratón.
- A la derecha aparece el editor de prueba.
    - `P`: crear nodo de primitiva.
    - `B`: crear nodo de opración booleana.
    - Los puertos de entrada son los superiores y los de salida los inferiores (actualmente si se actualiza un nodo una vez conectado no se actualiza el resultado).
    - Se puede navegar manteniendo click izquierdo y se puede hacer zoom con la rueda del ratón.
    - Se pueden eliminar nodos pulsando sobre ellos y pulsando la tecla de retroceso.

## Memoria
- El archivo compilado se encuentra en [./Memoria/libro.pdf](./Memoria/libro.pdf). De momento solo tiene puestos los datos básicos y algunos títulos de apartados.

