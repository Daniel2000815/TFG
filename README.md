# TFG

## Aplicación

### Ejecución

- Abrir el archivo [./Aplicacion/3d-visualizer/build/index.html](./Aplicacion/3d-visualizer/build/index.html).

### Estructura
Se pueden elegir diferentes pestañas desde la barra superior:
#### Graph
Aquí se pueden realizar operaciones sobre las primitivas existentes. A la izquierda aparece un canvas con un shader de prueba que no hace nada de momento. A la derecha aparece el editor de nodos. Cada nodo tiene un canvas de previsualización. Los puertos de entrada son los de la izquierda y los de salida los de la derecha.

##### Controles
- Creación de nodos:
  - `P`: crear nodo de primitiva.
  - `B`: crear nodo de operación booleana.
  - `D`: crear nodo de deformación.
  - `T`: crear nodo de movimiento rígido (transformación).
  - `click derecho`:  menú contextual.
- Navegación / Edición:
  - `click izquierdo`: 
    - Sobre el fondo: mover vista.
    - Sobre un nodo: seleccionar/mover nodo.
    - Sobre una conexión: eliminar conexión.
    - Sobre shader: rotar vista
  - `rueda ratón` sobre el fondo o sobre un shader: hacer zoom.
  - `retroceso`: elimina el nodo seleccionado anteriormente.
  - `s`: colapsar/expandir todos los nodos

#### Surfaces
En esta página se pueden crear nuevas superficies. Por defecto aparecen 3. Para crear una nueva superficie:
- Pulsar el botón superior derecho de la tabla
- Se elige el tipo de ecuación a introducir (implícita, paramétricas o SDF).
- En la tabla inferior se pueden añadir parámetros que luego se podrán controlar en el editor de nodos.
- A la derecha aparece un shader del mismo tipo que en la página *Graph* a modo de previsualización de la superficie creada.

> *Ejemplo:* para crear una esfera con diámetro variable, puedes seleccionar la opción "SDF" e introducir `length(p) - r` en el campo de texto de la ecuación. En la tabla tendrás que añadir un nuevo parámetro con símbol `r`, etiqueta la que quieras y un valor por defecto, por ejemplo $1$. Otra opción sería usar la opción "Implicit" e introducir $x^2+y^2+z^2-r$.

### Fallos conocidos / TODO

- *Surfaces*:
  - [ ] No se pueden usar parámetros cuando el tipo de ecuación es "Parametric". 
  - [ ] En el modo "SDF" si hay algún fallo no te avisa, simplemente no se visualiza nada.
  - [x] El botón de editar no funciona.
- *Graph*
  - [ ] Rendimiento.
  - [ ] Save / Load ?
  - [ ] Faltan algunas operaciones
  - [ ] Operador de escalado no funciona
  - [ ] Eliminar conexiones hace que deje de funcionar

## Memoria
- El archivo compilado se encuentra en [./Memoria/TFG.pdf](./Memoria/TFG.pdf).

