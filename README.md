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

# Práctica 22 – Operaciones HTTP, sesión y edición de clases

## Preparación y ejecución

El frontend se ejecuta desde `gimnasio-admin` con `npm install` y `npm start`. La API de la práctica está en `../Practica15_Gimnasio_Backend-main/Practica15_Gimnasio_Backend-main`; requiere MySQL de la configuración local en `.env`. Con MySQL disponible, ejecutar `npm run prisma:seed` para recrear las cuentas y los datos de prueba, y después `npm run start:dev`. El seed borra y vuelve a crear los datos de la base configurada.

Cuentas que crea el seed local. La clave se define en prisma/seed.ts del backend y no se publica aquí.

| Correo | Rol |
|---|---|
| `admin@itson.mx` | administrador |
| `karla@itson.mx` | miembro |

`GET /clases` continúa siendo público. Para demostrar el `401` antes del login, enviar un `POST /clases` sin encabezado `Authorization`; el alta, edición y eliminación requieren rol administrador. El login responde dentro del sobre `{ data, meta }` de la API.

## Ejercicio 1: guardar con POST

`ClasesApi` usa `HttpClient` para crear una clase. El formulario convierte `duracionMin` a número y envía el mismo DTO que entiende el backend. Si la respuesta es correcta recarga el recurso del catálogo y navega a `/clases`; mientras hay una petición, deshabilita los botones. Si el servidor regresa un error, la interfaz muestra `message`, incluyendo los arreglos de mensajes que produce `ValidationPipe` con HTTP 400.

Para verificar autorización, el endpoint `POST /clases` debe permanecer con `@Roles(Rol.admin)`. Sin token responde 401. Al cambiar temporalmente el decorador a `@Publico()` y reiniciar el backend, se puede guardar una clase sin login; al reponer `@Roles(Rol.admin)`, el mismo POST sin token vuelve a responder 401. El DTO del backend conserva sus validadores de nombre y duración; al quitarlos solo durante la prueba, el frontend muestra los mensajes devueltos por los validadores restantes.

**Si el formulario ya valida, ¿por qué también valida el servidor?**

El navegador no es una frontera de seguridad: se pueden omitir sus validaciones llamando la API directamente, usando otro cliente o manipulando la petición. La validación del servidor protege la base de datos y mantiene las reglas para todos los consumidores.

**¿Por qué `httpResource` para leer y `HttpClient` para crear, editar y eliminar?**

`httpResource` encaja con lecturas que alimentan estado de interfaz: expone carga, error y datos de forma reactiva. Las mutaciones son acciones explícitas del usuario y `HttpClient` permite decidir cuándo enviar POST/PATCH/DELETE y qué hacer después de la respuesta, como recargar el catálogo y navegar.

**¿Qué pasa si se olvida el `subscribe()`?**

El observable de `HttpClient` es perezoso. Si nadie se suscribe, no se envía la petición y no se ejecutan ni el servidor ni los callbacks de éxito o error.

## Ejercicio 2: login, interceptores y guardia

`Sesion` guarda el token Bearer y el usuario de sesión en `localStorage`. `authInterceptor` agrega `Authorization: Bearer …` a las peticiones a la API. `soloAdminGuard` protege las rutas hijas del panel; el login queda público. El componente raíz solo tiene `<router-outlet />`; `Panel` contiene la barra de navegación y el outlet para Clases, Horarios y Miembros. Las páginas y el formulario se cargan de forma diferida con `loadComponent`.

**¿A qué pieza de React corresponden las rutas hijas, el interceptor y el guardia?**

Las rutas hijas se parecen a las rutas anidadas de React Router y el outlet del panel a `<Outlet />`. Un interceptor se parece a una capa middleware que transforma las peticiones de `fetch` o de un cliente HTTP antes de enviarlas. El guardia equivale al patrón de ruta protegida o a una comprobación de autorización en un loader; React Router no impone una única API idéntica a `CanActivate`.

**¿Cuándo se ejecuta el guardia y por qué `salir()` tiene que navegar al login?**

`canActivateChild` se ejecuta durante la navegación y antes de activar una ruta hija. `salir()` borra token y usuario y navega a `/login` para terminar la vista actual del panel y mostrar una ruta pública; el guardia redirige a quien intente volver a una ruta protegida.

## Ejercicio 3: editar, eliminar y salida con cambios

La ruta `/clases/:id/editar` enlaza `id` al input del componente gracias a `withComponentInputBinding()`. El formulario usa `patchValue` para cargar el registro; con id llama PATCH y sin id llama POST. El catálogo incluye un botón Editar en el detalle lateral. El botón Eliminar pide confirmación, envía DELETE y al completar recarga la lista. `cambiosSinGuardarGuard` pregunta antes de abandonar el formulario cuando está `dirty`; después de guardar correctamente el formulario vuelve a `pristine`.

**¿Cómo decide un mismo formulario, con dos rutas, si manda POST o PATCH?**

Comprueba si recibió el `id` de la ruta. Sin id, es una creación y manda POST a `/clases`; con id, es edición y manda PATCH a `/clases/:id`.

**¿Por qué el estado del formulario no se puede observar con un `computed()`?**

`computed()` rastrea señales. `FormGroup.dirty` y `FormGroup.value` son propiedades del modelo de formularios reactivos, no señales; leerlas dentro de un `computed()` no crea una dependencia reactiva. Se pueden consultar al enviar o convertir `valueChanges`/`statusChanges` en señales cuando se necesita una vista derivada.

**¿Qué diferencia hay entre `canActivate` y `canDeactivate`, y qué casos no cubre la guarda de salida?**

`canActivate` decide si una ruta puede abrirse antes de activarla. `canDeactivate` pregunta si se puede abandonar un componente ya activo, aquí para evitar perder cambios. La guarda no evita cerrar o recargar la pestaña, cerrar el navegador, una caída del proceso ni cambios fuera de la navegación controlada por Angular.

## Evidencias

Guardar las capturas reales de la ejecución en `evidencias/` con nombres descriptivos: `01-validacion-servidor.png`, `02-post-401-sin-login.png`, `03-login-miembro-rechazado.png`, `04-post-201-authorization.png`, `05-edicion-patch.png`, `06-delete-200.png` y `07-confirmacion-can-deactivate.png`. La pestaña Red debe mostrar el encabezado `Authorization` en la captura del POST 201. No se deben incluir capturas fabricadas ni datos sensibles del token.


