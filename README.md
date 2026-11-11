# Práctica 21 · Router, formularios y catálogo desde API

## Requisitos y ejecución

- Proyecto: `Gimnasio-Admin`, rama de trabajo **Práctica 21**.
- Frontend Angular 22. Backend: `../Practica15_Gimnasio_Backend-main/Practica15_Gimnasio_Backend-main` (actualizado a Unidad IV; para esta práctica se usa hasta el Ejercicio 3).
- Configura y arranca MySQL y el backend siguiendo su README. La API debe quedar en `http://localhost:3000`.
- En `gimnasio-admin`, ejecuta `npm install` y `npm start`; Angular estará en `http://localhost:4200`.

La URL de la API está centralizada en `src/app/config.ts`. El endpoint público `GET /clases` regresa un sobre `{ data, meta }`; las imágenes usan rutas como `/img/clase-01.jpg` y se sirven desde el backend.

## Ejercicio 1: el router y las páginas

Se crearon las páginas `lista-clases`, `horarios` y `miembros`. Las rutas están en `src/app/app.routes.ts`; la ruta vacía redirige a `/clases` con `pathMatch: 'full'` y la comodín redirige al catálogo. `provideRouter(routes)` registra el router en `app.config.ts`. La barra de navegación usa `routerLink`, `routerLinkActive` y `<router-outlet>`.

El tablero de la Práctica 20 vive ahora en la página `lista-clases`. Horarios y Miembros muestran su saludo inicial.

**¿Qué pieza de React Router corresponde a `router-outlet`, `routerLink` y `routerLinkActive`?**

- `<router-outlet>` cumple el papel de `<Outlet />`: es el espacio donde se renderiza la página de la ruta activa.
- `routerLink` corresponde a `<Link to="…">`: navega sin recargar toda la aplicación.
- `routerLinkActive` se parece a `NavLink`: aplica una clase cuando el enlace corresponde a la ruta activa.

**¿Por qué la ruta comodín (`**`) va al final y la ruta vacía necesita `pathMatch: 'full'`?**

Angular prueba las rutas en orden. La comodín coincide con cualquier URL restante, así que antes de las rutas válidas las interceptaría. La ruta vacía usa por defecto coincidencia por prefijo; como cualquier URL empieza con una cadena vacía, sin `pathMatch: 'full'` podría redirigir también rutas como `/horarios`. `full` exige que la URL completa esté vacía.

## Ejercicio 2: formulario de nueva clase

La ruta `/clases/nueva` abre el formulario con `FormBuilder` y validadores para nombre, categoría, descripción, duración e imagen. Los errores se muestran después de tocar el control; al intentar guardar, todos se marcan como tocados. El validador propio `multiploDeCinco` acepta duraciones en bloques de cinco minutos. El formulario válido presenta el objeto `ClaseNueva` que se enviaría, sin realizar una petición.

**¿Dónde vive el valor de un campo en un formulario reactivo y en qué se diferencia del `useState` de React?**

El valor vive en el `FormControl` que forma parte del `FormGroup` de Angular; se consulta en el modelo del formulario, por ejemplo `formulario.controls.nombre.value`. Angular también guarda ahí estado como `touched`, `dirty` y `valid`. Con `useState`, normalmente se mantiene cada valor en estado del componente y se conecta el input mediante `value` y `onChange`; el formulario reactivo agrupa valores, validaciones y estado en un modelo explícito.

**¿Qué regresa un validador propio cuando el valor es válido o no, y cómo se relaciona con `hasError`?**

Un validador devuelve `null` cuando el valor es válido. Si no cumple, devuelve un objeto con una clave de error, aquí `{ multiploDeCinco: true }`. Angular registra esa clave en los errores del control, y `hasError('multiploDeCinco')` permite consultarla para mostrar el mensaje correspondiente.

## Ejercicio 3: catálogo desde la API

El servicio `Catalogo` obtiene `GET /clases` con `httpResource`, conserva el filtro y la selección como signals y deriva la lista desde `data` del sobre. La página muestra carga y error. Las tarjetas y el detalle construyen la URL absoluta de imagen usando `API_URL`. Se eliminaron los datos de clases escritos localmente y las imágenes locales del frontend; la API es la fuente del catálogo y de sus imágenes.

El backend entregado ya contiene los cambios de Unidad IV. El endpoint `GET /clases` tiene `@Publico()`, por eso el guard global no requiere token para leer el catálogo. Las operaciones de escritura sí están protegidas por rol administrador.

**¿Qué cambió en el servicio del catálogo y por qué ningún componente se enteró?**

Antes el servicio iniciaba un signal con un arreglo importado de clases locales. Ahora `httpResource` carga la respuesta de la API y `clases` deriva su contenido de `value()?.data`; el resto del servicio conserva las señales y operaciones de lectura que usa la interfaz. Los componentes dependen de la interfaz pública del servicio (`clases`, `clasesVisibles`, filtros y selección), no de cómo se obtienen los datos. Por eso no hubo que cambiar sus consumidores, salvo formar las URL de imagen para apuntar al servidor.

**¿Por qué no hizo falta iniciar sesión para leer el catálogo?**

El controlador del backend marca `GET /clases` como público con `@Publico()`. El guard JWT global omite la autenticación para esa ruta; el acceso público al catálogo es independiente de que las rutas de administración requieran rol.
