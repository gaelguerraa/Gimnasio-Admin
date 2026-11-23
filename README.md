# Práctica 23 — El panel del gimnasio: el buscador con RxJS

## Preguntas de reflexión

### Ejercicio 1: el tubo de búsqueda
1. **¿Qué diferencia hay entre un `signal` y un `Observable`?**
   - Un **`signal`** guarda un valor síncrono en un instante dado (`estado()`), siempre tiene un valor actual disponible sin necesidad de suscribirse y notifica de forma granular a la plantilla o a `computed()`/`effect()` cuando cambia.
   - Un **`Observable`** representa un flujo de eventos o valores asíncronos a lo largo del tiempo (como teclas pulsadas o peticiones HTTP). Es perezoso (*cold* hasta que alguien se suscribe), admite operadores de composición temporal (`debounceTime`, `distinctUntilChanged`, `switchMap`, `catchError`) y permite cancelar operaciones en curso al desuscribirse.

---

### Ejercicio 2: la caja de búsqueda
2. **¿Qué problema evita `switchMap` y qué pasaría con `mergeMap`?**
   - **`switchMap`** evita las condiciones de carrera (*race conditions*) y el desperdicio de red: cada vez que llega un nuevo término de búsqueda, cancela inmediatamente la petición HTTP anterior que seguía pendiente y conserva únicamente la suscripción a la búsqueda más reciente.
   - Si se usara **`mergeMap`**, todas las peticiones se ejecutarían en paralelo sin cancelarse y sus respuestas llegarían en el orden en que termine el servidor (no en el orden en que el usuario tecleó). Si una búsqueda anterior tardara más que la última, sobrescribiría la pantalla con resultados obsoletos.

3. **¿Qué pasa si se quita `catchError` y la API se apaga?**
   - Si se elimina `catchError` del flujo interno dentro de `switchMap`, el primer error de red (`status 0` al apagar la API) provoca que el `Observable` principal lance una excepción no controlada y **se complete/muera por error**. Como consecuencia, aunque el usuario vuelva a escribir en la caja de búsqueda después de encender el servidor, el tubo reactivo queda roto y ya no vuelve a disparar ninguna petición.
