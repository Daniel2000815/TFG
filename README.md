# TFG

## Aplicación

### Ejecución

- Abrir el archivo [./Aplicacion/build/index.html](./Aplicacion/build/index.html).
- A la izquierda aparece un canvas con un shader de prueba, que se puede consultar en [./Aplicacion/src/fragmentShaderMovable.js](./Aplicacion/src/fragmentShaderMovable.js). 
- En él se puede girar la cámara en torno al cubo si se mantiene el click izquierdo y hacer zoom con la rueda del ratón mientras se pulsa con el ratón.
- A la derecha aparece el editor de nodos. Cada nodo tiene un canvas de previsualización similar al explicado anteriormente. Los puertos de entrada son los superiores y los de salida los inferiores (actualmente si se actualiza un nodo una vez conectado no se actualiza el resultado).

### Controles

- Creación de nodos:
  - `P`: crear nodo de primitiva.
  - `B`: crear nodo de operación booleana.
  - `D`: crear nodo de deformación.
  - `T`: crear nodo de movimiento rígido (transformación).
- Navegación / Edición:
  - `click izquierdo`: 
    - Sobre el fondo: mover vista.
    - Sobre un nodo: seleccionar nodo.
    - Sobre una conexión: eliminar conexión.
  - `rueda ratón`: hacer zoom.
  - `retroceso`: elimina el nodo seleccionado anteriormente.

### Fallos conocidos / TODO

- [ ] Operador escala no funciona
- [ ] Hacer sliders continuos
- [ ] Save / Load ?
- [ ] Añadir soporte para introducir ecuaciones



## Memoria
- El archivo compilado se encuentra en [./Memoria/libro.pdf](./Memoria/libro.pdf). De momento solo tiene puestos los datos básicos y algunos títulos de apartados.

