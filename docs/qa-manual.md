# Pasada manual de calidad — Centro Aura, demo B

Esta guía recoge lo que **no puede decidir un script** y se hace una sola vez, a mano, antes de publicar. Los tests (`npm test`) ya cubren la estructura, los nombres accesibles, el contraste, el foco visible, los tamaños táctiles y el reflow en el CSS; aquí se comprueba lo que solo se percibe usando la web.

Cómo usarla: arranca la web con `npm run serve` (http://localhost:4173), recorre cada apartado, marca las casillas y rellena la línea final. Si algo falla, anótalo con la página y el ancho de pantalla, y no des el apartado por hecho.

## Teclado

Solo con el teclado (Tab, Mays+Tab, Intro, Espacio, flechas, Esc), sin ratón:

- [ ] Tab recorre la cabecera en orden lógico: enlace "Saltar al contenido", marca, menú y botón de reservar.
- [ ] En móvil (menos de 900 px), el botón del menú se abre con Intro o Espacio y **Esc lo cierra** devolviendo el foco al botón.
- [ ] Con el menú abierto, el foco no se escapa a la página de detrás.
- [ ] En Servicios, las pestañas se mueven con las flechas, Inicio y Fin; cada panel se muestra al elegir su pestaña.
- [ ] En Contacto, el formulario se rellena y se envía con el teclado; al fallar, el foco va al primer campo con error.
- [ ] El pie y el botón flotante de WhatsApp se alcanzan y se activan con el teclado.
- [ ] El foco es **siempre visible** y nunca queda tapado por la cabecera fija al desplazarse.

Hecho por: ____ · Fecha: ____

## Zoom 200 %

Con el zoom del navegador al 200 % en escritorio:

- [ ] Las siete páginas (portada, Servicios, Tienda, Contacto, Aviso legal, Privacidad y 404) se leen sin texto cortado ni solapado.
- [ ] No aparece scroll horizontal.
- [ ] El menú, los botones y el formulario siguen siendo utilizables.

Hecho por: ____ · Fecha: ____

## Reflow a 320 px

Con la ventana (o el modo móvil de las herramientas del navegador) a 320 px de ancho:

- [ ] Sin scroll horizontal en ninguna de las siete páginas.
- [ ] Sin texto cortado, solapado ni salido de su caja (revisa títulos largos, precios y la tarjeta de horario).
- [ ] Las fotos y el mapa no desbordan.
- [ ] Los botones se pueden pulsar sin acertar a otro elemento.

Hecho por: ____ · Fecha: ____

## Anchos 375, 768 y 1440

Captura de las siete páginas a 375 px (móvil), 768 px (tablet) y 1440 px (escritorio):

- [ ] Portada: la tarjeta de horario va debajo de la foto en móvil y flotando sobre ella desde 900 px.
- [ ] Servicios y Tienda: filas, tarjetas y ficha destacada bien repartidas en cada ancho.
- [ ] Contacto: tarjetas, mapa y formulario ordenados.
- [ ] Aviso legal, Privacidad y 404: lectura cómoda, sin líneas excesivamente largas.
- [ ] Cabecera y pie coherentes en las siete páginas.

Hecho por: ____ · Fecha: ____

## Lector de pantalla

Con NVDA (Windows) o VoiceOver (macOS / iOS), sobre la portada, Servicios y el formulario de Contacto:

- [ ] Se anuncian los puntos de referencia (cabecera, navegación, contenido principal y pie).
- [ ] Los títulos se leen en un orden lógico, con un solo título principal por página.
- [ ] Los enlaces y botones se entienden fuera de contexto (por ejemplo, "Reservar" dentro de cada servicio dice a cuál se refiere).
- [ ] Las pestañas de Servicios anuncian su estado (seleccionada o no).
- [ ] En el formulario, el mensaje de error de cada campo y el resumen se anuncian al enviar con campos vacíos.
- [ ] Las fotos decorativas no se leen y las informativas tienen una descripción útil.

Hecho por: ____ · Fecha: ____

## Movimiento reducido

Con la preferencia del sistema "Reducir movimiento" activada:

- [ ] Las secciones de la portada aparecen directamente, sin deslizarse ni desvanecerse.
- [ ] No hay transiciones perceptibles en el menú ni en los botones.
- [ ] Nada queda oculto por una animación que no llega a ejecutarse.

Hecho por: ____ · Fecha: ____

## Comparación A/B con la clienta

Esta web es la demo B: una segunda propuesta para que la clienta pueda elegir entre dos diseños. La guía para enseñarlas juntas, con los puertos y el orden sugerido, está en `docs/comparativa-ab.md`.

- [ ] Se han visto las dos demos, la A y la B, con la clienta, en móvil y en escritorio.
- [ ] Se ha anotado qué prefiere de cada una y qué cambiaría.
- [ ] Se ha confirmado con ella el horario, el teléfono, los precios y las fotos que se muestran.

Hecho por: ____ · Fecha: ____

## Opcional: axe automatizado

Comprobación **a demanda, fuera del build**: no forma parte de `npm test` y ningún paso instala nada. El proyecto no tiene dependencias y debe seguir así.

- [ ] Si se quiere una revisión automática adicional, usar axe-core con un navegador automatizado (por ejemplo, playwright), instalándolos fuera del proyecto o en una carpeta temporal.
- [ ] Verificar las versiones disponibles antes de instalar.
- [ ] Pasarlo sobre las siete páginas y revisar a mano cada aviso: una herramienta automática no detecta todos los problemas de accesibilidad ni sustituye a las pruebas de arriba.

Hecho por: ____ · Fecha: ____
