## Ejercicio 1: El proyecto y el tablero

En el componente principal (`src/app/app.ts` y `app.html`) se guardan las clases utilizando un signal. También se usan tres `computed` para calcular el total de clases, la suma de los minutos y cuántas clases duran 60 minutos o más.

Con las 8 clases que tenemos registradas, el resultado es de 8 clases, 380 minutos por semana y 2 clases que duran una hora o más.

**¿Qué archivo de Angular hace el papel de main.tsx, de App.tsx y de vite.config.ts?**

- `main.tsx` sería `src/main.ts` en Angular, ya que es el archivo que se encarga de iniciar la aplicación mediante `bootstrapApplication(App, appConfig)`. Las configuraciones globales se encuentran en `app.config.ts`.
- `App.tsx` sería `src/app/app.ts` junto con `app.html`, porque ahí se encuentra el componente principal y lo que se muestra en pantalla.
- `vite.config.ts` sería parecido a `angular.json`, ya que ahí se configuran cosas del proyecto como la compilación, los estilos y las carpetas que se utilizan. También se complementa con los archivos `tsconfig`.

## Ejercicio 2: La tarjeta de una clase

En este ejercicio se creó el componente `tarjeta-clase`, que recibe la información de cada clase mediante `clase = input.required<Clase>()`. En la tarjeta se muestra la imagen, el nombre, la descripción, la categoría y la duración.

También se utilizó `@if` para que aparezca la etiqueta "Larga" solamente cuando una clase dura 60 minutos o más.

En el componente principal se usa `@for` para mostrar todas las tarjetas y `@empty` para mostrar un mensaje cuando no hay clases registradas. Además, se agregaron los botones "Vaciar catálogo" y "Restaurar catálogo", que permiten modificar la lista de clases mediante el signal.

**¿Por qué clase() lleva paréntesis y para qué sirve track?**

`clase()` lleva paréntesis porque `input.required()` devuelve un signal y no el objeto directamente. Por eso, para obtener la información que tiene guardada, tenemos que llamarlo como si fuera una función. Esto también permite que Angular detecte los cambios y actualice la información que se muestra en pantalla.

Por otro lado, `track` sirve para que Angular pueda identificar cada elemento dentro del `@for`. En este caso se utiliza `c.id`, que es el identificador de cada clase.

Esto ayuda a que, cuando se modifica la lista, Angular no tenga que volver a crear todos los elementos, sino que pueda reutilizar los que ya existen. Es algo parecido al `key` que se utiliza en React, con la diferencia de que en Angular es obligatorio dentro de `@for`.