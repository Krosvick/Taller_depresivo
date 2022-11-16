# Cuestionario de salud mental  
Repositorio basado en typescript para la creacion de
de un cuestionario ponderado para determinar si el
usuario demuestra cierto grado de depresión.

Ademas el proyecto contara con una base de datos y
un sistema CRUD por consola para los administradores
## Informe del proyecto

[Link al informe](https://universidadarturoprat230-my.sharepoint.com/:w:/g/personal/fvirgilio_estudiantesunap_cl/Ef3v6LOrwWBPhS_KgbiwHLMBq8mVK0SEnSri9b31jgvAvw?e=aFVIlV)

## PPT del proyecto
[Link al ppt](https://universidadarturoprat230-my.sharepoint.com/:p:/g/personal/fvirgilio_estudiantesunap_cl/EYuqWZl5bgtPldMxotVnV3YBJMOzZTbO-5kR6BM70pthlA?e=E9dV3X)
## Correr de manera local

Un requisito previo es tener una version de nodejs
previamente instalada, puede elegir la correspondiente
a su sistema operativo en:

[Node Download Section](https://nodejs.org/en/download/)

Alternativamente puedes verificar si cuentas con una version
de node instalada utilizando el siguiente comando:

~~~bash  
node --v
~~~

Clonar el repositorio  

~~~bash  
git clone https://github.com/Krosvick/Taller_depresivo
~~~

Navegar al directorio del repositorio 

~~~bash  
cd Taller_depresivo
~~~

Instalar dependencias  

~~~bash  
npm install
~~~
## Ejecutar el servidor de pocketbase

En windows 

~~~bash
./pocketbase.exe serve 
~~~

En linux
~~~bash
./pocketbase serve
~~~
##Ejecutar el compilador tsc y correr el programa
~~~bash
npm run build
~~~
Luego
~~~bash
node ./prod/main.js
~~~

Para acceder al dashboard de pocketbase, ingrese al siguiente enlace con su cuenta de administrador:

[pocketbase local](http://127.0.0.1:8090/_/)

## Licencia

[MIT](https://choosealicense.com/licenses/mit/)
