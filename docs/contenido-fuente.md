# Contenido fuente — Centro Aura, demo B

Este documento es la **única fuente de textos** para construir la demo B. El constructor no tiene acceso a la demo A: todo lo que necesita está aquí o en `js/data.js`.

- **PARTE 1** es el texto en español de la demo A, literal, por página y sección (procedencia: demo A, commit `1444fd6`). Los textos de servicios, tienda, contacto, avisos legales y 404 se reutilizan **tal cual**.
- **PARTE 2** son los datos de negocio: precios, duraciones, horario y teléfono viven en `js/data.js` (idéntico al de A). El HTML lleva un texto de respaldo que debe coincidir con ellos (lo comprueban los tests).
- **PARTE 3** son los textos nuevos de la demo B. Son los que comprueban los tests.

Reglas de contenido: no inventar años de experiencia, cifras, premios, reseñas, nombres de clientas, ingredientes ni beneficios médicos que no estén aquí. La marca `Pendiente` de los datos legales es deliberada.

Notas de lectura de la PARTE 1: `@` no se usa; las líneas "Botón/enlace" indican el texto y el destino; `[WhatsApp: X]` es el valor de `data-wa`; los textos sueltos entre títulos son párrafos o elementos de lista en el orden del HTML original; el texto que A repetía en cabecera y pie (marca, navegación, horario) está resumido en la PARTE 3, "Elementos comunes".

---

# PARTE 1 — Textos de la demo A (literal)

## Portada (index.html) — SOLO como referencia de textos; la portada de la demo B se recompone

- **title:** Centro Aura · Spa capilar y tricología en Las Cabezas de San Juan
- **meta description:** Peluquería, spa capilar, barros, alisados y antifrizz en Las Cabezas de San Juan (Sevilla). Cosmética natural Jaldún y tarjetas regalo.
- **og:title:** Centro Aura · Spa Capilar · Tricología
- **og:description:** Cuidamos tu cabello desde la raíz. Peluquería, spa capilar y tricología en Las Cabezas de San Juan.


### Sección hero

**H1:** Centro Aura

Spa Capilar · Tricología

- Botón/enlace: Reservar cita → https://wa.me/34610167764 [WhatsApp: (sin servicio)]



### Sección section #presentacion

Peluquería · Salud capilar

**H2:** Cuidamos tu cabello desde la raíz

Unimos la peluquería de siempre con la tricología y los rituales de spa capilar, para que tu pelo, además de bonito, esté sano.

- Imagen destacado-spa.webp — alt: "Masaje relajante en el cuero cabelludo durante un spa capilar"
**H3:** Spa Esencial

50 min aprox · 40 €

- Imagen destacado-tricologia.webp — alt: "Primer plano del cabello, como se ve con la microcámara en el análisis"
**H3:** Spa Equilibrio

1 h 10 min aprox · 50 €

- Imagen destacado-terapias.webp — alt: "Masaje suave en la cabeza durante un ritual de spa"
**H3:** Spa Aura

1 h 30 min · 70 €

- Botón/enlace: Ver todos los servicios → pages/servicios.html

### Sección section section--alt

Tienda

**H2:** Para cuidarte también en casa

Cosmética capilar Jaldún y tarjetas regalo, para recoger en el salón.

- 
**H3:** Champús Jaldún

Fitoterapia capilar para cada tipo de cuero cabelludo.

Ver champús

- 
**H3:** Regala Aura

Una tarjeta para un spa capilar, un tratamiento o el importe que prefieras.

Ver tarjetas regalo


### Sección section

Para ver el mapa se conectará con Google Maps y Google podrá recibir tu dirección IP.

- Botón: Ver el mapa
- Botón/enlace: Abrir en Google Maps → https://www.google.com/maps/search/?api=1&query=C%2F%20Dr.%20Domingo%20Gallego%203%2C%2041730%20Las%20Cabezas%20de%20San%20Juan
Visítanos

**H2:** Te esperamos en Las Cabezas

C/ Dr. Domingo Gallego, 3 / 41730 Las Cabezas de San Juan, Sevilla

- Lunes – Viernes: 9:30 – 14:00 · 17:00 – 20:30
- Sábado: 9:30 – 14:00
- Domingo: Cerrado
- Botón/enlace: Cómo llegar → https://www.google.com/maps/search/?api=1&query=C%2F%20Dr.%20Domingo%20Gallego%203%2C%2041730%20Las%20Cabezas%20de%20San%20Juan
- Botón/enlace: +34 610 16 77 64 → tel:+34610167764

## Servicios (pages/servicios.html)

- **title:** Servicios · Spa, barros, alisados y peluquería | Centro Aura
- **meta description:** Spa esencial, equilibrio y aura, barros, alisados, antifrizz, tratamientos de la fibra capilar, cortes y peinados en Centro Aura, Las Cabezas de San Juan.
- **og:title:** Servicios · Centro Aura
- **og:description:** Spa capilar, barros, alisados y peluquería en Las Cabezas de San Juan.


### Sección page-hero

**H1:** Servicios

Spa, barros, alisados y peluquería. Todo empieza por escucharte y mirar tu cuero cabelludo.


### Sección section

- Botón: Spa
- Botón: Barros, alisados y antifrizz
- Botón: Peluquería
- Imagen servicio-salud.webp — alt: "Masaje en el cuero cabelludo con la clienta relajada"
**H2:** Spa

Un momento para ti: tres rituales, de menos a más completo.

- 
**H3:** Spa esencial

Un momento para desconectar y disfrutar de un ritual de bienestar.

- Lavado capilar
- Masaje de hombros, cuello, rostro y cabeza
- Secado final
40 €

50 min aprox.

- Botón/enlace: Reservar → https://wa.me/34610167764 [WhatsApp: Spa esencial]
- 
**H3:** Spa equilibrio

Una experiencia que combina relajación y cuidado.

- Análisis del cuero cabelludo con microcámara
- Tratamiento adaptado a tus necesidades
- Masaje de hombros, cuello, rostro y cabeza
- Lavado y secado final
50 €

1 h 10 min aprox.

- Botón/enlace: Reservar → https://wa.me/34610167764 [WhatsApp: Spa equilibrio]
- 
**H3:** Spa aura

El más completo.

- Análisis del cuero cabelludo
- Tratamiento personalizado
- Masaje de hombros, cuello, rostro y cabeza
- Masaje de manos y pies
- Lavado y secado
70 €

1 h 30 min

- Botón/enlace: Reservar → https://wa.me/34610167764 [WhatsApp: Spa aura]
- Imagen servicio-tratamientos.webp — alt: "Melena larga, lisa y brillante vista de espaldas"
**H2:** Barros, alisados y antifrizz

Tratamientos para la fibra capilar, según lo que necesite tu pelo.

Los precios de este apartado son orientativos: varían según los productos que se gasten, el largo y la densidad del pelo.

Barros

- 
**H3:** Barro en raíz

30–40 €

- Botón/enlace: Reservar → https://wa.me/34610167764 [WhatsApp: Barro en raíz]
- 
**H3:** Barro completo

50–70 €

- Botón/enlace: Reservar → https://wa.me/34610167764 [WhatsApp: Barro completo]
Alisados

- 
**H3:** Alisado en pelo corto

100–140 €

- Botón/enlace: Reservar → https://wa.me/34610167764 [WhatsApp: Alisado en pelo corto]
- 
**H3:** Alisado en media melena

140–180 €

- Botón/enlace: Reservar → https://wa.me/34610167764 [WhatsApp: Alisado en media melena]
- 
**H3:** Alisado en pelo largo

180–230 €

- Botón/enlace: Reservar → https://wa.me/34610167764 [WhatsApp: Alisado en pelo largo]
- 
**H3:** Alisado en pelo muy largo

230–270 €

- Botón/enlace: Reservar → https://wa.me/34610167764 [WhatsApp: Alisado en pelo muy largo]
Antifrizz

- 
**H3:** Antifrizz en pelo corto

45–50 €

- Botón/enlace: Reservar → https://wa.me/34610167764 [WhatsApp: Antifrizz en pelo corto]
- 
**H3:** Antifrizz en pelo medio o largo

50–60 €

- Botón/enlace: Reservar → https://wa.me/34610167764 [WhatsApp: Antifrizz en pelo medio o largo]
Fibra capilar

- 
**H3:** Tratamiento de la fibra capilar

Tres opciones según lo que necesite tu pelo.

- Reparación
- Hidratación
- Nutrición
30–50 €

- Botón/enlace: Reservar → https://wa.me/34610167764 [WhatsApp: Tratamiento de la fibra capilar]
- Imagen servicio-peluqueria.webp — alt: "Estilista secando el pelo de una clienta con cepillo redondo"
**H2:** Peluquería

Cortes y peinados con el mismo mimo que todo lo demás.

- 
**H3:** Lavado y peinado

13 €

- Botón/enlace: Reservar → https://wa.me/34610167764 [WhatsApp: Lavado y peinado]
- 
**H3:** Corte

Incluye lavado, corte y secado

15 €

- Botón/enlace: Reservar → https://wa.me/34610167764 [WhatsApp: Corte]
- 
**H3:** Corte y peinado

22 €

- Botón/enlace: Reservar → https://wa.me/34610167764 [WhatsApp: Corte y peinado]

### Sección section section--alt

Paso a paso

**H2:** ¿Cómo es el análisis del cuero cabelludo?

- 
**H3:** Diagnóstico con microcámara

En el Spa equilibrio y el Spa aura vemos tu cuero cabelludo ampliado en pantalla y te explico lo que encontramos.

- 
**H3:** Plan personalizado

Elegimos el tratamiento en cabina y los productos para casa según lo que necesita tu piel.

- 
**H3:** Seguimiento

Revisamos cómo evoluciona y ajustamos el plan hasta ver resultados.


### Sección section

**H2:** ¿Dudas sobre qué necesita tu cabello?

Cuéntamelo y lo vemos, sin compromiso.

- Botón/enlace: Escríbeme → contacto.html#formulario

## Tienda (pages/tienda.html)

- **title:** Tienda · Champús Jaldún y tarjetas regalo | Centro Aura
- **meta description:** Champús naturales Jaldún, y tarjetas regalo de Centro Aura. Pídelos por WhatsApp y recógelos en el salón.
- **og:title:** Tienda · Centro Aura
- **og:description:** Cosmética natural Jaldún y tarjetas regalo.


### Sección page-hero

**H1:** Tienda

Cosmética natural Jaldún y tarjetas regalo.

Jaldún

Tarjetas regalo





Recogida en el salón. Te confirmamos disponibilidad por WhatsApp.


### Sección section #jaldun

Cosmética natural

**H2:** Champús Jaldún

Fitoterapia capilar que devuelve al cuero cabelludo su equilibrio natural. Si no sabes cuál es el tuyo, pregúntame.

- 
- Imagen champu-equilibrante.webp — alt: "Frasco del champú Equilibrante de Jaldún"
**H3:** Champú Equilibrante

Para caspa y exceso de grasa. Equilibra el cuero cabelludo con árbol de té, sauce y aloe vera.

22 €

- Botón/enlace: Lo quiero → https://wa.me/34610167764 [WhatsApp: Champú Equilibrante Jaldún]
- 
- Imagen champu-vitalzen.webp — alt: "Frasco del champú Vitalzen Fortificante de Jaldún"
**H3:** Champú Vitalzen Fortificante

Para la caída. Estimula la microcirculación y fortalece el cabello desde la raíz.

24 €

- Botón/enlace: Lo quiero → https://wa.me/34610167764 [WhatsApp: Champú Vitalzen Fortificante Jaldún]
- 
- Imagen champu-multiefecto.webp — alt: "Frasco del champú Multiefecto Regulador de Jaldún"
**H3:** Champú Multiefecto Regulador

Para cuero cabelludo sensible o desequilibrado. Con limón y aguacate: calma, regula e hidrata.

22 €

- Botón/enlace: Lo quiero → https://wa.me/34610167764 [WhatsApp: Champú Multiefecto Regulador Jaldún]

### Sección section section--alt #tarjetas-regalo

Un detalle con sentido

**H2:** Tarjetas regalo

Elige un importe o regala un servicio concreto. La preparamos a mano y la recoges en el salón.

- 
AURA25 €

**H3:** Tarjeta de 25 €

Para gastar en cualquier servicio o producto.

25 €

- Botón/enlace: Regalar → https://wa.me/34610167764 [WhatsApp: Tarjeta regalo de 25 €]
- 
AURA50 €

**H3:** Tarjeta de 50 €

Para gastar en cualquier servicio o producto.

50 €

- Botón/enlace: Regalar → https://wa.me/34610167764 [WhatsApp: Tarjeta regalo de 50 €]
- 
AURA75 €

**H3:** Tarjeta de 75 €

Para gastar en cualquier servicio o producto.

75 €

- Botón/enlace: Regalar → https://wa.me/34610167764 [WhatsApp: Tarjeta regalo de 75 €]
- 
AURAUn servicio

**H3:** El servicio que elijas

Un spa capilar, un tratamiento o un peinado para una ocasión especial.

A elegir

- Botón/enlace: Regalar → https://wa.me/34610167764 [WhatsApp: Tarjeta regalo de un servicio]

## Contacto (pages/contacto.html)

- **title:** Contacto y horario | Centro Aura, Las Cabezas de San Juan
- **meta description:** Teléfono, WhatsApp, horario y cómo llegar a Centro Aura: C/ Dr. Domingo Gallego, 3, Las Cabezas de San Juan (Sevilla). Pide cita o pregúntanos lo que necesites.
- **og:title:** Contacto · Centro Aura
- **og:description:** Pide cita por WhatsApp o visítanos en Las Cabezas de San Juan.


### Sección page-hero

**H1:** Contacto

Escríbeme, llámame o pásate por el salón. Te respondo lo antes posible.


### Sección section

- 


**H2:** Llámame

+34 610 16 77 64

- 


**H2:** WhatsApp

Pide cita o pregúntame

- 


- 
**H2:** Instagram

@centro__aura

- 


**H2:** Cómo llegar

C/ Dr. Domingo Gallego, 3


### Sección section section--alt

Horario

**H2:** Cuándo encontrarnos

C/ Dr. Domingo Gallego, 3 / 41730 Las Cabezas de San Juan, Sevilla

- Lunes – Viernes: 9:30 – 14:00 · 17:00 – 20:30
- Sábado: 9:30 – 14:00
- Domingo: Cerrado
Para ver el mapa se conectará con Google Maps y Google podrá recibir tu dirección IP.

- Botón: Ver el mapa
- Botón/enlace: Abrir en Google Maps → https://www.google.com/maps/search/?api=1&query=C%2F%20Dr.%20Domingo%20Gallego%203%2C%2041730%20Las%20Cabezas%20de%20San%20Juan

### Sección section #formulario

Pregúntanos

**H2:** ¿Tienes alguna duda?

Escribe tu mensaje y se abrirá WhatsApp con todo listo para enviar.

Nombre



Servicio de interés

(opcional)

- Opción de selector: Elige una opción
- Opción de selector: Spa esencial
- Opción de selector: Spa equilibrio
- Opción de selector: Spa aura
- Opción de selector: Barros
- Opción de selector: Alisados
- Opción de selector: Antifrizz
- Opción de selector: Tratamiento de la fibra capilar
- Opción de selector: Lavado y peinado
- Opción de selector: Corte
- Opción de selector: Corte y peinado
- Opción de selector: Otro / no lo sé
Mensaje



- Botón: Enviar por WhatsApp
Se abrirá WhatsApp con tu mensaje listo para enviar.


## Aviso legal (pages/aviso-legal.html) — BORRADOR

- **title:** Aviso legal | Centro Aura
- **meta description:** Aviso legal de Centro Aura, spa capilar y tricología en Las Cabezas de San Juan: titular del sitio, condiciones de uso y legislación aplicable.
- **og:title:** Aviso legal · Centro Aura
- **og:description:** Datos del titular y condiciones de uso de la web de Centro Aura.


### Sección page-hero

**H1:** Aviso legal

Quién está detrás de esta web y en qué condiciones puedes usarla.


### Sección section

- Comentario HTML: BORRADOR: rellenar los campos marcados (npm run pendientes los lista), revisarlo con un profesional y quitar este comentario.
**H2:** 1. Titular del sitio web

En cumplimiento del artículo 10 de la Ley 34/2002, de Servicios de la Sociedad de la Información y de Comercio Electrónico (LSSI-CE), se facilitan los datos del titular de este sitio web:

- Titular: [Nombre y apellidos o denominación social]
- NIF / CIF: [NIF o CIF]
- Domicilio: C/ Dr. Domingo Gallego, 3, 41730 Las Cabezas de San Juan (Sevilla)
- Teléfono: +34 610 16 77 64
- Correo electrónico: [Correo electrónico de contacto]
- Actividad: Peluquería, spa capilar y tricología; venta de cosmética capilar.
- Inscripción registral: [Solo si procede: registro, tomo, folio y hoja. Si no, borrar esta fila]
**H2:** 2. Objeto y condiciones de uso

Esta web da a conocer los servicios, productos y el horario de Centro Aura y facilita el contacto con el centro. Navegar por ella no exige registro. Quien la usa se compromete a hacerlo de forma lícita y a no dañar el sitio ni su funcionamiento.

**H2:** 3. Reservas y pedidos

Esta web no realiza ventas ni cobros en línea. Las citas, los bonos, las tarjetas regalo y los productos se solicitan por WhatsApp, por teléfono o en el propio centro, y quedan confirmados cuando el centro responde. Los productos se recogen en el centro.

Los precios mostrados son los vigentes en el centro y pueden cambiar. [Confirmar: los precios incluyen IVA]

**H2:** 4. Propiedad intelectual

Los textos, el diseño, el logotipo y las imágenes de esta web pertenecen a su titular o se usan con licencia. No pueden copiarse ni reutilizarse sin su permiso.

**H2:** 5. Enlaces a terceros

La web enlaza con servicios de terceros (WhatsApp, Instagram y Google Maps). Cada uno tiene sus propias condiciones y políticas, de las que el titular no es responsable.

**H2:** 6. Responsabilidad

El titular procura que la información sea correcta y esté actualizada, pero no garantiza que no contenga errores ni que el sitio funcione sin interrupciones. Los tratamientos y productos descritos son orientativos: la recomendación definitiva se hace tras la consulta en el centro.

**H2:** 7. Legislación aplicable

Este sitio se rige por la legislación española. Para cualquier controversia, las partes se someten a los juzgados y tribunales que correspondan conforme a la normativa de consumidores y usuarios.

Última actualización: [fecha]


## Privacidad y cookies (pages/privacidad.html) — BORRADOR

- **title:** Privacidad y cookies | Centro Aura
- **meta description:** Política de privacidad y cookies de Centro Aura: qué datos tratamos, con qué finalidad, qué servicios de terceros usa la web y cómo ejercer tus derechos.
- **og:title:** Privacidad y cookies · Centro Aura
- **og:description:** Cómo tratamos tus datos y qué cookies usa la web de Centro Aura.


### Sección page-hero

**H1:** Privacidad y cookies

Qué datos tratamos, para qué y cuáles son tus derechos.


### Sección section

- Comentario HTML: BORRADOR: rellenar los campos marcados (npm run pendientes los lista), revisarlo con un profesional y quitar este comentario.
**H2:** 1. Responsable del tratamiento

- Titular: [Nombre y apellidos o denominación social]
- NIF / CIF: [NIF o CIF]
- Domicilio: C/ Dr. Domingo Gallego, 3, 41730 Las Cabezas de San Juan (Sevilla)
- Teléfono: +34 610 16 77 64
- Correo electrónico: [Correo electrónico de contacto]
- Actividad: Peluquería, spa capilar y tricología; venta de cosmética capilar.
- Inscripción registral: [Solo si procede: registro, tomo, folio y hoja. Si no, borrar esta fila]
**H2:** 2. Qué datos tratamos y para qué

Esta web no tiene formularios que envíen datos a un servidor ni cuentas de usuario. Solo tratamos datos cuando te pones en contacto con nosotros:

- Por WhatsApp, teléfono o Instagram: tu nombre, tu número de teléfono y el contenido del mensaje, para responderte y gestionar tu cita o tu pedido.
- Con el formulario de Contacto: el formulario no guarda nada. Compone el mensaje y abre WhatsApp en tu dispositivo; el mensaje solo se envía si tú lo envías desde WhatsApp.
Base jurídica: tu consentimiento al escribirnos y la aplicación de medidas precontractuales o contractuales (reservar una cita o un pedido), artículo 6.1.a) y 6.1.b) del RGPD.

Conservación: mientras dure la gestión de tu solicitud y, después, durante los plazos que exija la ley.

**H2:** 3. Destinatarios

No cedemos tus datos a terceros salvo obligación legal. Usamos WhatsApp (Meta), Instagram (Meta) y, si decides cargarlo, Google Maps: son proveedores independientes con sus propias políticas de privacidad, y pueden tratar datos fuera del Espacio Económico Europeo.

Esta web está alojada en [proveedor de alojamiento], que actúa como encargado del tratamiento.

**H2:** 4. Cookies y almacenamiento

Esta web no usa cookies propias, ni de análisis, ni de publicidad, y no guarda información en tu navegador. Las tipografías se sirven desde este mismo sitio.

El mapa de Google Maps no se carga hasta que pulsas «Ver el mapa». Solo entonces tu navegador se conecta con Google, que puede recibir tu dirección IP y utilizar cookies según su política de privacidad. Si no pulsas el botón, no se contacta con Google.

**H2:** 5. Tus derechos

Puedes ejercer tus derechos de acceso, rectificación, supresión, oposición, limitación del tratamiento y portabilidad escribiendo a [correo electrónico de contacto] o en el propio centro. Si crees que tus datos no se tratan correctamente, puedes reclamar ante la Agencia Española de Protección de Datos.

Última actualización: [fecha]


## Página 404 (404.html)

- **title:** Página no encontrada | Centro Aura
- **meta description:** La página que buscas no existe. Vuelve al inicio de Centro Aura, spa capilar y tricología en Las Cabezas de San Juan.


### Sección notfound



44

Error 404

**H1:** Te has salido del camino

La página que buscas no está aquí, pero tu cabello sigue en buenas manos. Vuelve al inicio o escríbenos y te ayudamos.

- Botón/enlace: Volver al inicio → index.html
- Botón/enlace: Ver servicios → pages/servicios.html


- Botón/enlace: Escríbenos por WhatsApp → https://wa.me/34610167764 [WhatsApp: (sin servicio)]

---

# PARTE 1b — Marcado literal de los cuerpos legales (con sus enlaces)

La PARTE 1 de arriba reduce los textos a líneas; **estos bloques son el marcado literal** (enlaces, negritas y `<mark class="pendiente">`) del cuerpo de cada página legal. Es lo que debe reproducirse dentro de `<div class="container legal">` en los pasos de las páginas legales. Los datos que faltan van siempre como `<mark class="pendiente">[…]</mark>`.

## Aviso legal — cuerpo

```html
<div class="container legal">
        <!-- BORRADOR: rellenar los campos marcados (npm run pendientes los lista), revisarlo con un profesional y quitar este comentario. -->
        <h2>1. Titular del sitio web</h2>
        <p>En cumplimiento del artículo 10 de la Ley 34/2002, de Servicios de la Sociedad de la Información y de Comercio Electrónico (LSSI-CE), se facilitan los datos del titular de este sitio web:</p>
      <dl class="legal-data">
        <dt>Titular</dt><dd><mark class="pendiente">[Nombre y apellidos o denominación social]</mark></dd>
        <dt>NIF / CIF</dt><dd><mark class="pendiente">[NIF o CIF]</mark></dd>
        <dt>Domicilio</dt><dd>C/ Dr. Domingo Gallego, 3, 41730 Las Cabezas de San Juan (Sevilla)</dd>
        <dt>Teléfono</dt><dd><a href="tel:+34610167764" data-phone>+34 610 16 77 64</a></dd>
        <dt>Correo electrónico</dt><dd><mark class="pendiente">[Correo electrónico de contacto]</mark></dd>
        <dt>Actividad</dt><dd>Peluquería, spa capilar y tricología; venta de cosmética capilar.</dd>
        <dt>Inscripción registral</dt><dd><mark class="pendiente">[Solo si procede: registro, tomo, folio y hoja. Si no, borrar esta fila]</mark></dd>
      </dl>

        <h2>2. Objeto y condiciones de uso</h2>
        <p>Esta web da a conocer los servicios, productos y el horario de Centro Aura y facilita el contacto con el centro. Navegar por ella no exige registro. Quien la usa se compromete a hacerlo de forma lícita y a no dañar el sitio ni su funcionamiento.</p>

        <h2>3. Reservas y pedidos</h2>
        <p>Esta web no realiza ventas ni cobros en línea. Las citas, los bonos, las tarjetas regalo y los productos se solicitan por WhatsApp, por teléfono o en el propio centro, y quedan confirmados cuando el centro responde. Los productos se recogen en el centro.</p>
        <p>Los precios mostrados son los vigentes en el centro y pueden cambiar. <mark class="pendiente">[Confirmar: los precios incluyen IVA]</mark></p>

        <h2>4. Propiedad intelectual</h2>
        <p>Los textos, el diseño, el logotipo y las imágenes de esta web pertenecen a su titular o se usan con licencia. No pueden copiarse ni reutilizarse sin su permiso.</p>

        <h2>5. Enlaces a terceros</h2>
        <p>La web enlaza con servicios de terceros (WhatsApp, Instagram y Google Maps). Cada uno tiene sus propias condiciones y políticas, de las que el titular no es responsable.</p>

        <h2>6. Responsabilidad</h2>
        <p>El titular procura que la información sea correcta y esté actualizada, pero no garantiza que no contenga errores ni que el sitio funcione sin interrupciones. Los tratamientos y productos descritos son orientativos: la recomendación definitiva se hace tras la consulta en el centro.</p>

        <h2>7. Legislación aplicable</h2>
        <p>Este sitio se rige por la legislación española. Para cualquier controversia, las partes se someten a los juzgados y tribunales que correspondan conforme a la normativa de consumidores y usuarios.</p>

        <p class="legal-date">Última actualización: <mark class="pendiente">[fecha]</mark></p>
      </div>
```

## Privacidad y cookies — cuerpo

```html
<div class="container legal">
        <!-- BORRADOR: rellenar los campos marcados (npm run pendientes los lista), revisarlo con un profesional y quitar este comentario. -->
        <h2>1. Responsable del tratamiento</h2>
      <dl class="legal-data">
        <dt>Titular</dt><dd><mark class="pendiente">[Nombre y apellidos o denominación social]</mark></dd>
        <dt>NIF / CIF</dt><dd><mark class="pendiente">[NIF o CIF]</mark></dd>
        <dt>Domicilio</dt><dd>C/ Dr. Domingo Gallego, 3, 41730 Las Cabezas de San Juan (Sevilla)</dd>
        <dt>Teléfono</dt><dd><a href="tel:+34610167764" data-phone>+34 610 16 77 64</a></dd>
        <dt>Correo electrónico</dt><dd><mark class="pendiente">[Correo electrónico de contacto]</mark></dd>
        <dt>Actividad</dt><dd>Peluquería, spa capilar y tricología; venta de cosmética capilar.</dd>
        <dt>Inscripción registral</dt><dd><mark class="pendiente">[Solo si procede: registro, tomo, folio y hoja. Si no, borrar esta fila]</mark></dd>
      </dl>

        <h2>2. Qué datos tratamos y para qué</h2>
        <p>Esta web <strong>no tiene formularios que envíen datos a un servidor</strong> ni cuentas de usuario. Solo tratamos datos cuando te pones en contacto con nosotros:</p>
        <ul>
          <li><strong>Por WhatsApp, teléfono o Instagram:</strong> tu nombre, tu número de teléfono y el contenido del mensaje, para responderte y gestionar tu cita o tu pedido.</li>
          <li><strong>Con el formulario de Contacto:</strong> el formulario no guarda nada. Compone el mensaje y abre WhatsApp en tu dispositivo; el mensaje solo se envía si tú lo envías desde WhatsApp.</li>
        </ul>
        <p><strong>Base jurídica:</strong> tu consentimiento al escribirnos y la aplicación de medidas precontractuales o contractuales (reservar una cita o un pedido), artículo 6.1.a) y 6.1.b) del RGPD.</p>
        <p><strong>Conservación:</strong> mientras dure la gestión de tu solicitud y, después, durante los plazos que exija la ley.</p>

        <h2>3. Destinatarios</h2>
        <p>No cedemos tus datos a terceros salvo obligación legal. Usamos WhatsApp (Meta), Instagram (Meta) y, si decides cargarlo, Google Maps: son proveedores independientes con sus propias políticas de privacidad, y pueden tratar datos fuera del Espacio Económico Europeo.</p>
        <p>Esta web está alojada en <mark class="pendiente">[proveedor de alojamiento]</mark>, que actúa como encargado del tratamiento.</p>

        <h2>4. Cookies y almacenamiento</h2>
        <p>Esta web <strong>no usa cookies propias</strong>, ni de análisis, ni de publicidad, y no guarda información en tu navegador. Las tipografías se sirven desde este mismo sitio.</p>
        <p>El mapa de Google Maps <strong>no se carga hasta que pulsas «Ver el mapa»</strong>. Solo entonces tu navegador se conecta con Google, que puede recibir tu dirección IP y utilizar cookies según su <a href="https://policies.google.com/privacy" target="_blank" rel="noopener">política de privacidad</a>. Si no pulsas el botón, no se contacta con Google.</p>

        <h2>5. Tus derechos</h2>
        <p>Puedes ejercer tus derechos de acceso, rectificación, supresión, oposición, limitación del tratamiento y portabilidad escribiendo a <mark class="pendiente">[correo electrónico de contacto]</mark> o en el propio centro. Si crees que tus datos no se tratan correctamente, puedes reclamar ante la <a href="https://www.aepd.es" target="_blank" rel="noopener">Agencia Española de Protección de Datos</a>.</p>

        <p class="legal-date">Última actualización: <mark class="pendiente">[fecha]</mark></p>
      </div>
```

---

# PARTE 2 — Datos de negocio (se leen de `js/data.js`)

| Dato | Valor |
|---|---|
| Nombre | Centro Aura (Spa Capilar · Tricología) |
| Titular de la marca | Paula, peluquera titulada y fundadora |
| Dirección | C/ Dr. Domingo Gallego, 3, 41730 Las Cabezas de San Juan (Sevilla) |
| Teléfono / WhatsApp | +34 610 16 77 64 (`34610167764`) |
| Instagram | https://www.instagram.com/centro__aura/ (@centro__aura) |
| Horario (orientativo, pendiente de confirmar por Paula) | Lunes – Viernes 9:30 – 14:00 · 17:00 – 20:30 · Sábado 9:30 – 14:00 · Domingo cerrado |
| Categorías | `spa` (Spa) · `tratamientos` (Barros, alisados y antifrizz) · `peluqueria` (Peluquería) |

Precios, duraciones y los ids de cada servicio, producto y tarjeta: `js/data.js` (`AURA_DATA.items`). No se duplican aquí para que no se desincronicen.

Enlace de Google Maps (dirección): `https://www.google.com/maps/search/?api=1&query=C%2F%20Dr.%20Domingo%20Gallego%203%2C%2041730%20Las%20Cabezas%20de%20San%20Juan`
Mapa embebido (solo tras pulsar "Ver el mapa"): `https://www.google.com/maps?q=C%2F%20Dr.%20Domingo%20Gallego%203%2C%2041730%20Las%20Cabezas%20de%20San%20Juan&output=embed`
Geo para JSON-LD: latitud 36.9853, longitud -5.9395.

---

# PARTE 3 — Textos NUEVOS de la demo B (redactados para este diseño)

Solo usan hechos de la demo A y de `js/data.js`. No hay años de experiencia, cifras, premios, reseñas, nombres de clientas, ingredientes nuevos ni beneficios médicos. Si un texto necesita pulido, se hace con la skill `/humanizalo` sin cambiar ningún hecho. **Estos son los textos exactos que comprueban los tests.**

## Elementos comunes (todas las páginas)

- **Barra superior (`.topbar`):** `Las Cabezas de San Juan` · `L–V 9:30–14:00 · 17:00–20:30` (atributo `data-hours-summary`; `js/main.js` lo recompone desde `data.js`) · teléfono con `data-phone`.
- **Marca:** `AURA` / `Spa Capilar · Tricología` (sin cambios respecto a A).
- **Botón de la cabecera:** `Reservar` (WhatsApp, `data-wa=""`).
- **Navegación principal:** `Inicio`, `Servicios`, `Tienda`, `Contacto`.
- **Pie:** columna de marca con la frase `Peluquería y salud capilar en Las Cabezas de San Juan.` y el botón `Reservar por WhatsApp`; columnas `Visítanos` (dirección + `Cómo llegar`), `Horario` (`data-hours`) y `Contacto` (teléfono, `WhatsApp`, `Instagram`); fila inferior con la navegación, `© 2026 Centro Aura` y `Aviso legal` · `Privacidad y cookies`.
- **Botón flotante de WhatsApp (solo móvil):** nombre accesible `Reservar por WhatsApp`.
- **Enlace de saltar:** `Saltar al contenido`.

## Portada (`index.html`) — ocho secciones dentro de `<main>`, en este orden

1. **`.hero`** — eyebrow `Spa capilar · Tricología`; h1 `Cuidamos tu cabello <em>desde la raíz</em>`; botón principal `Reservar cita` (WhatsApp); botón secundario `Ver servicios` → `pages/servicios.html`. Foto `hero-salon.webp`, alt `Sillones de peluquería frente a espejos ovalados en el salón`. Tarjeta `.hero__card`: título `Horario`, el horario (`data-hours`) y el enlace `Ver contacto` → `pages/contacto.html`.
2. **`.pillars`** (h2 oculto visualmente: `Lo que hacemos en Aura`). Cuatro pilares:
   - `Peluquería titulada` — `Paula, peluquera titulada y fundadora de Centro Aura.` (icono `tijeras`)
   - `Spa capilar` — `Tres rituales: esencial, equilibrio y aura.` (icono `spa`)
   - `Tricología con microcámara` — `Vemos tu cuero cabelludo ampliado en pantalla y te explico lo que encontramos.` (icono `tricologia`)
   - `Cosmética natural Jaldún` — `Fitoterapia capilar para cada tipo de cuero cabelludo.` (icono `barro`)
3. **`.icon-row`** — eyebrow `Servicios y tienda`; h2 `Elige por dónde <em>empezar</em>`. Cuatro enlaces:
   - `Spa` — `Tres rituales, de menos a más completo.` → `pages/servicios.html#spa` (icono `spa`)
   - `Barros, alisados y antifrizz` — `Tratamientos para la fibra capilar.` → `pages/servicios.html#barros-alisados-antifrizz` (icono `barro`)
   - `Peluquería` — `Cortes y peinados con el mismo mimo que todo lo demás.` → `pages/servicios.html#peluqueria` (icono `tijeras`)
   - `Tienda` — `Cosmética Jaldún y tarjetas regalo, para recoger en el salón.` → `pages/tienda.html` (icono `regalo`)
4. **`.service-cards`** — eyebrow `Spa capilar`; h2 `Tres rituales para <em>desconectar</em>`; texto `De menos a más completo: elige el que mejor encaje con lo que necesitas hoy.` Tres tarjetas (chip de categoría `Spa`, chip de duración desde `data-duration`, precio desde `data-price`, enlace de la tarjeta en el h3):
   - `Spa esencial` — `Un momento para desconectar y disfrutar de un ritual de bienestar.` — foto `destacado-spa.webp`, alt `Masaje relajante en el cuero cabelludo durante un spa capilar` → `pages/servicios.html#spa-esencial`
   - `Spa equilibrio` — `Una experiencia que combina relajación y cuidado.` — foto `destacado-tricologia.webp`, alt `Primer plano del cabello, como se ve con la microcámara en el análisis` → `pages/servicios.html#spa-equilibrio`
   - `Spa aura` — `El más completo.` — foto `destacado-terapias.webp`, alt `Masaje suave en la cabeza durante un ritual de spa` → `pages/servicios.html#spa-aura`
   - Enlace bajo las tarjetas: `Ver todos los servicios` → `pages/servicios.html`.
5. **`.spotlight`** — eyebrow `Cosmética natural`; h2 `Champús <em>Jaldún</em> para cada cuero cabelludo`; texto `Fitoterapia capilar que devuelve al cuero cabelludo su equilibrio natural. Si no sabes cuál es el tuyo, pregúntame.`; lista con check:
   - `<strong>Equilibrante</strong> para caspa y exceso de grasa.`
   - `<strong>Vitalzen Fortificante</strong> para la caída.`
   - `<strong>Multiefecto Regulador</strong> para cuero cabelludo sensible o desequilibrado.`
   - Botón `Ver tienda` → `pages/tienda.html#jaldun`. Fotos: las tres `champu-*.webp` con los alt de la tienda de A (`Frasco del champú Equilibrante de Jaldún`, `Frasco del champú Vitalzen Fortificante de Jaldún`, `Frasco del champú Multiefecto Regulador de Jaldún`).
6. **`.mosaic`** — eyebrow `Sobre Aura`; h2 `Que tu pelo, además de bonito, esté <em>sano</em>`; texto `Centro Aura es el espacio de Paula, peluquera titulada y fundadora, en Las Cabezas de San Juan. Unimos la peluquería de siempre con la tricología y los rituales de spa capilar.`; cita de marca `Aura, <em>la energía del interior y la que envuelve al cuerpo físico</em>.` Tres fotos: `servicio-salud.webp` (alt `Masaje en el cuero cabelludo con la clienta relajada`), `destacado-terapias.webp` (alt `Masaje suave en la cabeza durante un ritual de spa`) y `servicio-peluqueria.webp` (alt `Estilista secando el pelo de una clienta con cepillo redondo`). Sin retrato de Paula.
7. **`.gift-banner`** — eyebrow `Tarjetas regalo`; h2 `Regala <em>Aura</em>`; texto `Una tarjeta para un spa capilar, un tratamiento o el importe que prefieras.`; botón `Pedir tarjeta regalo` (WhatsApp, `data-wa="Tarjeta regalo"` `data-wa-kind="producto"`). Foto `tarjeta-regalo.webp` decorativa (`alt=""`) bajo un velo oscuro.
8. **`.visit`** — eyebrow `Visítanos`; h2 `Te esperamos en <em>Las Cabezas</em>`; dirección, horario (`data-hours`), botón `Cómo llegar`, teléfono (`data-phone`), mapa con carga bajo demanda (botón `Ver el mapa`, aviso y enlace `Abrir en Google Maps`: textos de la portada de A).

## Servicios (`pages/servicios.html`)

- Cabecera de página: h1 `Servicios`; texto `Spa, barros, alisados y peluquería. Todo empieza por escucharte y mirar tu cuero cabelludo.`; imagen `textura-lino.webp` decorativa.
- Pestañas (chips): `Spa`, `Barros, alisados y antifrizz`, `Peluquería`. Paneles con id `spa`, `barros-alisados-antifrizz`, `peluqueria`.
- Todos los textos de servicios, listas "incluye", avisos y precios: los de la PARTE 1 (A). Cada servicio es una fila-tarjeta con el mismo id que en A.
- Bloque de análisis: eyebrow `Paso a paso`; h2 `¿Cómo es el análisis del cuero cabelludo?`; tres tarjetas numeradas con los textos de A (`Diagnóstico con microcámara`, `Plan personalizado`, `Seguimiento`).
- Llamada final: h2 `¿Dudas sobre qué necesita tu cabello?`; texto `Cuéntamelo y lo vemos, sin compromiso.`; botón `Escríbeme` → `contacto.html#formulario`.

## Tienda (`pages/tienda.html`)

- Cabecera: h1 `Tienda`; texto `Cosmética natural Jaldún y tarjetas regalo.`
- Nota: `Recogida en el salón. Te confirmamos disponibilidad por WhatsApp.`
- Mosaico de dos categorías (enlaces): `Champús Jaldún` — `Fitoterapia capilar para cada tipo de cuero cabelludo.` → `#jaldun`; `Tarjetas regalo` — `Una tarjeta para un spa capilar, un tratamiento o el importe que prefieras.` → `#tarjetas-regalo`.
- Fichas, textos, precios y botones: los de la PARTE 1 (A). Primera ficha Jaldún (Equilibrante) destacada en arco.

## Contacto (`pages/contacto.html`)

- Cabecera: h1 `Contacto`; texto `Escríbeme, llámame o pásate por el salón. Te respondo lo antes posible.`
- Tarjetas: `Llámame`, `WhatsApp`, `Instagram`, `Cómo llegar` (textos de A).
- Horario y mapa: textos de A. Formulario: textos de A más un resumen de errores en una región `aria-live` (`id="form-summary"`) que empieza por `Revisa el formulario:` y enumera los errores de campo.

## Legales y 404

- Textos de la PARTE 1 (A), sin cambios. La demo B no añade ni quita datos legales.
