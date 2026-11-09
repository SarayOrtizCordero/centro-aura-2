/* Centro Aura — datos de negocio.
   Los precios, duraciones, el horario y el teléfono que se muestran en la web
   se leen de aquí. El horario es ORIENTATIVO: pendiente de confirmar por Paula.
   Un precio puede ser un rango: "price" es el mínimo y "priceMax" el máximo
   (se muestra como "30–40 €"). "from: true" muestra "desde 100 €". "approx: true" marca los precios que varían
   según los productos que se gasten.
   Una franja de horario puede llevar "note" (subtítulo bajo la hora).
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
      { days: 'Lunes – Viernes', schemaDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'], slots: ['10:00 – 14:00', '16:00 – 20:00'] },
      { days: 'Sábado', schemaDays: ['Saturday'], slots: ['8:00 – 13:00'], note: 'Se abre dos sábados al mes' },
      { days: 'Domingo', schemaDays: ['Sunday'], slots: [] }
    ],

    categories: [
      { id: 'salud', label: 'Salud capilar' },
      { id: 'spa', label: 'Spa' },
      { id: 'peluqueria', label: 'Peluquería' }
    ],

    items: {
      // Salud capilar: el diagnóstico cuesta 10 €; las oxigenaciones van según el cabello y las necesidades (sin precio fijo).
      'diagnostico':       { type: 'servicio', category: 'salud', name: 'Diagnóstico', price: 10, from: false },

      // Spa
      'spa-esencial':   { type: 'servicio', category: 'spa', name: 'Spa esencial',   duration: '50 min', price: 40, from: false },
      'spa-equilibrio': { type: 'servicio', category: 'spa', name: 'Spa equilibrio', duration: '1 h',           price: 50, from: false },
      'spa-aura':       { type: 'servicio', category: 'spa', name: 'Spa aura',       duration: '1 h 15 min',    price: 70, from: false },

      // Peluquería (incluye barros, alisado y antifrizz). Los precios en rango son orientativos
      // (varían según los productos que se gasten).
      // "contact" es el nombre que aparece en el selector del formulario de Contacto.
      'corte':          { type: 'servicio', category: 'peluqueria', name: 'Corte',            price: 15, from: false },
      'lavado-peinado': { type: 'servicio', category: 'peluqueria', name: 'Lavado y peinado', price: 13, from: false },
      'corte-peinado':  { type: 'servicio', category: 'peluqueria', name: 'Corte y peinado',  price: 25, from: false },
      'barro-raiz':     { type: 'servicio', category: 'peluqueria', name: 'Barro en raíz',    contact: 'Barros', price: 30, priceMax: 40, approx: true },
      'barro-completo': { type: 'servicio', category: 'peluqueria', name: 'Barro completo',   contact: 'Barros', price: 50, priceMax: 70, approx: true },
      'alisado':        { type: 'servicio', category: 'peluqueria', name: 'Alisado',          price: 100, from: true },
      'antifrizz': { type: 'servicio', category: 'peluqueria', name: 'Antifrizz', contact: 'Antifrizz', price: 45, priceMax: 60, approx: true },
      'intensivo-hidratacion': { type: 'servicio', category: 'peluqueria', name: 'Tratamiento intensivo de hidratación y nutrición', contact: 'Tratamiento intensivo de hidratación y nutrición', price: 30, priceMax: 50, approx: true },
      'intensivo-reparacion': { type: 'servicio', category: 'peluqueria', name: 'Tratamiento intensivo de reparación y reconstrucción', contact: 'Tratamiento intensivo de reparación y reconstrucción', price: 30, priceMax: 50, approx: true },
      'tratamiento-fibra': { type: 'servicio', category: 'peluqueria', name: 'Tratamiento para fibra capilar', price: 30, priceMax: 50, approx: true },

      // Productos Jaldún
      'jaldun-equilibrante': { type: 'producto', name: 'Champú Equilibrante Jaldún', price: 31.5 },
      'jaldun-vitalzen':     { type: 'producto', name: 'Champú Vitalzen Fortificante Jaldún', price: 31.5 },
      'jaldun-multiefecto':  { type: 'producto', name: 'Champú Multiefecto Regulador Jaldún', price: 31.5 },
      'jaldun-tonico-equilibrante': { type: 'producto', name: 'Tónico Equilibrante Jaldún', price: 40 },
      // El precio del Actianagen se adapta a cada cliente según su tratamiento
      'jaldun-tonico-actianagen': { type: 'producto', name: 'Tónico Actianagen Jaldún', price: 59, approx: true },
      'jaldun-nutrianagen': { type: 'producto', name: 'Nutrianagen Jaldún', price: 37 },
      'jaldun-aceite-bioregenerador': { type: 'producto', name: 'Aceite Bioregenerador Jaldún', price: 26 },
      'jaldun-emulsion-c3q': { type: 'producto', name: 'Emulsión Equilibrante C3Q Jaldún', price: 27 },
      'jaldun-acondicionador-spray': { type: 'producto', name: 'Acondicionador Spray Equilibrante Jaldún', price: 20 },
      'jaldun-factor-crecimiento': { type: 'producto', name: 'Factor de Crecimiento Capilar Jaldún', price: 70 },
      'jaldun-oxigenador': { type: 'producto', name: 'Oxigenador Jaldún', price: 43 },
      'jaldun-oxigenador-marino': { type: 'producto', name: 'Oxigenador Marino Jaldún', price: 43 },

      // Productos Brazilian Hairtech
      'brazilian-post-alisado':  { type: 'producto', name: 'Post alisado Copa Cabana Brazilian Hairtech', price: 55 },
      'brazilian-healing':       { type: 'producto', name: 'Tratamiento Healing (champú y mascarilla) Brazilian Hairtech', price: 55 },
      'brazilian-aceite-coco':   { type: 'producto', name: 'Aceite de coco Brazilian Hairtech', price: 38 },
      'brazilian-healing-foam':  { type: 'producto', name: 'Healing foam Brazilian Hairtech', price: 38 },

      // Tarjetas regalo
      'regalo-spa-esencial':   { type: 'regalo', name: 'Tarjeta regalo Spa esencial',   price: 40 },
      'regalo-spa-equilibrio': { type: 'regalo', name: 'Tarjeta regalo Spa equilibrio', price: 50 },
      'regalo-spa-aura':       { type: 'regalo', name: 'Tarjeta regalo Spa aura',       price: 70 }
    }
  };

  root.AURA_DATA = AURA_DATA;
  if (typeof module !== 'undefined' && module.exports) module.exports = AURA_DATA;
})(typeof window !== 'undefined' ? window : globalThis);
