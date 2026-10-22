/* Centro Aura — datos de negocio.
   Los precios, duraciones, el horario y el teléfono que se muestran en la web
   se leen de aquí. El horario es ORIENTATIVO: pendiente de confirmar por Paula.
   Un precio puede ser un rango: "price" es el mínimo y "priceMax" el máximo
   (se muestra como "30–40 €"). "approx: true" marca los precios que varían
   según los productos que se gasten.
   Si cambias el horario, actualiza también el bloque JSON-LD de index.html
   (npm test avisa si no coinciden).
   Si cambias el teléfono, sustituye también "34610167764" en los enlaces de
   respaldo del HTML (wa.me / tel:) y en el JSON-LD de index.html: este
   archivo no controla esos enlaces fijos. */
(function (root) {
  'use strict';

  const AURA_DATA = {
    business: {
      name: 'Centro Aura',
      owner: 'Paula',
      phoneDisplay: '+34 610 16 77 64',
      phoneDigits: '34610167764',
      address: 'C/ Dr. Domingo Gallego, 3, 41730 Las Cabezas de San Juan (Sevilla)',
      instagram: 'https://www.instagram.com/centro__aura/'
    },

    hours: [
      { days: 'Lunes – Viernes', schemaDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'], slots: ['9:30 – 14:00', '17:00 – 20:30'] },
      { days: 'Sábado', schemaDays: ['Saturday'], slots: ['9:30 – 14:00'] },
      { days: 'Domingo', schemaDays: ['Sunday'], slots: [] }
    ],

    categories: [
      { id: 'spa', label: 'Spa' },
      { id: 'tratamientos', label: 'Barros, alisados y antifrizz' },
      { id: 'peluqueria', label: 'Peluquería' }
    ],

    items: {
      // Spa
      'spa-esencial':   { type: 'servicio', category: 'spa', name: 'Spa esencial',   duration: '50 min aprox.',      price: 40, from: false },
      'spa-equilibrio': { type: 'servicio', category: 'spa', name: 'Spa equilibrio', duration: '1 h 10 min aprox.',  price: 50, from: false },
      'spa-aura':       { type: 'servicio', category: 'spa', name: 'Spa aura',       duration: '1 h 30 min',         price: 70, from: false },

      // Barros, alisados y antifrizz: precios orientativos (varían según los productos que se gasten).
      // "contact" es el nombre que aparece en el selector del formulario de Contacto.
      'barro-raiz':            { type: 'servicio', category: 'tratamientos', name: 'Barro en raíz',                  contact: 'Barros',    price: 30,  priceMax: 40,  approx: true },
      'barro-completo':        { type: 'servicio', category: 'tratamientos', name: 'Barro completo',                 contact: 'Barros',    price: 50,  priceMax: 70,  approx: true },
      'alisado-corto':         { type: 'servicio', category: 'tratamientos', name: 'Alisado en pelo corto',          contact: 'Alisados',  price: 100, priceMax: 140, approx: true },
      'alisado-media-melena':  { type: 'servicio', category: 'tratamientos', name: 'Alisado en media melena',        contact: 'Alisados',  price: 140, priceMax: 180, approx: true },
      'alisado-largo':         { type: 'servicio', category: 'tratamientos', name: 'Alisado en pelo largo',          contact: 'Alisados',  price: 180, priceMax: 230, approx: true },
      'alisado-muy-largo':     { type: 'servicio', category: 'tratamientos', name: 'Alisado en pelo muy largo',      contact: 'Alisados',  price: 230, priceMax: 270, approx: true },
      'antifrizz-corto':       { type: 'servicio', category: 'tratamientos', name: 'Antifrizz en pelo corto',        contact: 'Antifrizz', price: 45,  priceMax: 50,  approx: true },
      'antifrizz-medio-largo': { type: 'servicio', category: 'tratamientos', name: 'Antifrizz en pelo medio o largo', contact: 'Antifrizz', price: 50,  priceMax: 60,  approx: true },
      'tratamiento-fibra':     { type: 'servicio', category: 'tratamientos', name: 'Tratamiento de la fibra capilar', price: 30, priceMax: 50, approx: true },

      // Peluquería
      'lavado-peinado': { type: 'servicio', category: 'peluqueria', name: 'Lavado y peinado', price: 13, from: false },
      'corte':          { type: 'servicio', category: 'peluqueria', name: 'Corte',            price: 15, from: false },
      'corte-peinado':  { type: 'servicio', category: 'peluqueria', name: 'Corte y peinado',  price: 22, from: false },

      // Productos Jaldún
      'jaldun-equilibrante': { type: 'producto', name: 'Champú Equilibrante Jaldún', price: 22 },
      'jaldun-vitalzen':     { type: 'producto', name: 'Champú Vitalzen Fortificante Jaldún', price: 24 },
      'jaldun-multiefecto':  { type: 'producto', name: 'Champú Multiefecto Regulador Jaldún', price: 22 },

      // Tarjetas regalo
      'regalo-25': { type: 'regalo', name: 'Tarjeta regalo de 25 €', price: 25 },
      'regalo-50': { type: 'regalo', name: 'Tarjeta regalo de 50 €', price: 50 },
      'regalo-75': { type: 'regalo', name: 'Tarjeta regalo de 75 €', price: 75 }
    }
  };

  root.AURA_DATA = AURA_DATA;
  if (typeof module !== 'undefined' && module.exports) module.exports = AURA_DATA;
})(typeof window !== 'undefined' ? window : globalThis);
