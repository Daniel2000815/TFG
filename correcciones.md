Hola Daniel,

no he podido ver el capítulo 2 completo con el detalle que yo querría, no
obstante te mando algunas cosas que creo que se deben mejorar en la parte
inicial de ese capítulo y en la sección 2.1. Cuando puedas introducir esas
modificaciones y me las mandes, yo veré con más detalle las secciones 2.2 y
2.3 (no me importa que sea en Agosto), pero creo que los cambios que habrá
que hacer en 2.2 y 2.3 son más puntuales y menos "estructurales" que los
que requiere la 2.1. Te comento lo que creo que se debe mejorar a
continuación.

El primer aspecto a mejorar que veo es que a principio del capítulo 2,
antes de 2.1, no hay un texto introductorio donde se haga un resumen de qué
se pretende con este capítulo 2 y haya un resumen de los contenidos de este
capítulo 2, tal y como está el lector se encuentra de golpe leyendo de
cosas muy concretas, como, por ejemplo, el "lienzo", y no podrá saber de
qué se está hablando. Es necesario introducir al lector en lo que se va a
hablar en este capítulo 2. Eso para mi es algo muy importante en general en
las memorias de los TFGs. En este caso particular, no puedes pasar a hablar
del "lienzo" sin más, antes debes de explicar una serie de conceptos,
aunque sea brevemente, pero de forma clara y concisa. Este es algo que os
suele ocurrir a los alumnos, a veces las memorias están muy bien escritas,
como es tu caso, pero están ordenadas o estructuradas más bien de acuerdo a
qué cosas has ido haciendo a lo largo del tiempo en tu desarrollo del TFG,
más que ordenadas de acuerdo a un orden que permita al lector entender los
conceptos y la implementación.

En línea con eso, debes explicar porqué se usa rasterización para dibujar
dos triángulos y luego trazar rayos en cada pixel. En primer lugar debes
dejar claro al lector las diferencias entre visualización 3D por
ray-tracing y por rasterización (explicar que los cálculos son básicamente
los mismos pero con los bucles cambiados, pues usar lo que digo al respecto
en mis apuntes al principio del tema 1). Después, aclarar porqué se usa una
API de rasterización para hacer ray-tracing. Para esto último, te propongo
un texto en esta línea:

        Para hacer ray-tracing, debemos usar las APIs de rasterización en
GPU. Puesto que rasterización y ray-tracing son métodos alternativos de
visualización, esto parece una contradicción. El motivo fundamental de esta
aparente contradicción es que queremos hacer el cáculo de las
intersecciones rayo-escena en la GPU para que vaya mucho más rápido,
aprovechando las capacidades de ese tipo de hardware, el cual se incorpora
desde hace ya años en la inmensa mayoría de los ordenadores y dispositivos
móviles.

        En principio, el cálculo de intersecciones se puede hacer en la CPU
por métodos clásicos usando un bucle que recorre secuencialmente los
píxeles y calcula los colores de cada uno de ellos. Se puede repartir ese
cálculo en varias CPUs, con una hebra por CPU (cada hebra calcula algunos
pixels, por ejemplo). Pero es mucho mejor usar la GPU, que tiene unas
capacidades mucho mayores de paralelización de esos cálculos. Para usar la
GPU se pueden usar APIs de ray-tracing en GPUs modernas y avanzadas con
optimización de ray-tracing en hardware, pero entonces el software
únicamente podría ejecutarse en esas GPUs (muy caras), y además esas APIs
están optimizadas para trabajar con mallas de triángulos (no obtendremos
ventaja si usamos escenas definidas por SDFs)

        Por tanto, recurrimos a las APIs de rasterización, portables y
conocidas, que pueden ejecutarse en cualquier GPU. Esas APIs de
rasterización permiten ejecutar, en cada píxel donde se proyecta un
triángulo, un trozo de código definido por el programador, código que
produce el color del píxel. Esos trozos de código se llaman 'fragment
shaders'. Para lograr nuestro objetivo, se visualizan por rasterización dos
triángulos que cubren toda la imagen, y eso provoca una ejecución de una
instancia del *fragment shader* en todos y cada uno de los píxeles de dicha
imagen. Por tanto, lo que hacemos es definir el código del fragment shader
de forma que sea ahí donde se calculan las intersecciones de los rayos
primarios con las superficies (además de hacerse el cálculo de la
iluminación), para así calcular el color del píxel.

        (nota: ten muy en cuenta que en este texto no se habla de OpenGL o
GLSL específicamente, sino de APIs de rasterización en general, ya que lo
que se describe podría hacerse con DirectX+HLSL, o con Metal+MSL, o con
Vulkan+HLSL, pero eso no es relevante para lo que se quiere explicar, este
detalle está relacionado con lo que te digo a continuación).


Otra cosa que en mi opinión sería muy importante mejorar en este capítulo 2
(concretamente en 2.1), es que estás mezclando dos tipos de cosas que creo
que sería mucho mejor separar, estas dos tipos de cosas son:

* Descripción de los algoritmos y conceptos que estás usando para tu
desarrollo, independientemente de cómo se implementen en una API, lenguaje
o librería concretos.
* La descripción de cómo se implementan esos algoritmos y conceptos usando
OpenGL o WebL + GLSL en tu programa.

En este apartado 2 creo que es mejor hablar simplemente de algoritmos (ya
que el título comienza con "Algoritmos..."), y en al apartado 3 dejar los
aspectos relacionados con la implementación. Te doy más detalles de qué
tipo de contenidos son de cada tipo en el apartado 2.1:

    -- Por un lado comentas conceptos generales de Informática Gráfica,
hablas de técnicas y algoritmos en general, son estos:

        * Los sistemas de coordenadas que se usan en Informática Gráfica en
general.
        * Las matrices de modelo, de vista y de proyección.
        * El procesamiento que se hace en rasterización de los vértices
usando esas matrices (algoritmo 4)
        * Las componentes que definen una cámara, marco de coordenadas de
cámara, el plano de visión (figura 2.8)
        * Ray-marching y sphere tracing (figuras 2.12)
        * La forma de calcular la posición del plano de visión en
coordenadas de mundo, a partir de la cámara, y por tanto la posición de
cada pixel y de cada rayo primario en ese espacio.

    -- Por otro lado, hablas de cómo se implementan estos conceptos usando
unos lenguajes, librerías y herramientas concretas, me refiero en concreto
a:

        * Envío de los triángulos a la GPU (figura 2.1, izquierda) con
OpenGL en lenguaje C o C++.
        * Nombres y tipos de los parámetros de entrada y salida (varying o
in-out) de un vertex shader y un fragment shader en GLSL
        * Cálculo de la matriz de proyección usando C++ con la librería GLM

Estos dos tipos de contenidos están mezclados en la sección 2.1. Sin
embargo, aquí en la sección 2 debes dejar el primer tipo de contenidos,
mientras que el segundo tipo de contenidos debe moverse a la sección 3.
Además, respecto de esas cosas que debes mover al apartado 3, ten en cuenta
que los ejemplos de código que pones se refieren a C/C++ sobre OpenGL,
cuando en realidad tu has usado Javascript sobre WebGL. Creo, por tanto,
que sería mejor adaptar los ejemplos a Javascript y WebGL. Además, al
inicio de la sección 3 debes de hablar de qué lenguajes o librerías has
seleccionado.

Respecto a las secciones 2.2 y 2.3, las he visto por encima y creo que no
dices nada específico de la implementación, así que creo que no hay este
problema de la 2.1, por eso creo que los cambios serán cosas puntuales.
Cuando me mandes la parte introductoria y la 2.1 reformada, volveré a mirar
el capítulo 2 completo con más detalle.

Saludos,
Carlos.