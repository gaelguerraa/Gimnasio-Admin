# Práctica 23 — El panel del gimnasio: el buscador con RxJS

## Preguntas de reflexión

### Ejercicio 1: el tubo de búsqueda

1. **¿Qué diferencia hay entre un `signal` y un `Observable`?**

* Un **`signal`** sirve para guardar un estado o valor actual que puedes leer de forma directa y síncrona en cualquier momento (solo llamándolo como `estado()`), sin tener que suscribirte. Cuando su valor cambia, le avisa automáticamente a la vista o a los `computed()` que dependan de él.
* Un **`Observable`** maneja flujos de eventos o datos que van llegando con el tiempo de forma asíncrona (por ejemplo, lo que el usuario va tecleando o las respuestas de una petición HTTP). No hace nada hasta que te suscribes, te deja encadenar operadores para controlar tiempos y flujos (`debounceTime`, `distinctUntilChanged`, `switchMap`, `catchError`), y además te permite cancelar peticiones que quedaron a medias.

### Ejercicio 2: la caja de búsqueda

2. **¿Qué problema evita `switchMap` y qué pasaría con `mergeMap`?**

* **`switchMap`** evita que se empalmen peticiones viejas con las nuevas y ahorra recursos de red. Cada vez que el usuario escribe algo nuevo, cancela la petición HTTP anterior si todavía no terminaba y se queda únicamente con la más reciente.
* Si usáramos **`mergeMap`**, todas las peticiones saldrían al mismo tiempo sin cancelarse. El problema es que si una búsqueda vieja tarda más en responder que la última que hizo el usuario, cuando llegue su respuesta va a sobrescribir los resultados actuales con datos viejos que ya ni al caso.

3. **¿Qué pasa si se quita `catchError` y la API se apaga?**

* Si quitamos el `catchError` que está adentro del `switchMap`, en cuanto falle la primera petición porque el servidor está apagado (tirando un `status 0`), ese error sube y rompe por completo el `Observable` principal. Esto hace que el flujo se cierre y muera; aunque después vuelvas a prender la API y sigas escribiendo en el buscador, ya no se va a disparar ninguna petición nueva.