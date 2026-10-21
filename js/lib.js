/* Centro Aura — funciones puras (sin DOM).
   En el navegador quedan en window.AuraLib; en Node se exportan para los tests. */
(function (root) {
  'use strict';

  const NBSP = ' ';

  function formatEuros(amount) {
    return amount + NBSP + '€';
  }

  function formatPrice(item) {
    if (!item || typeof item.price !== 'number') return 'Consultar';
    const amount = typeof item.priceMax === 'number' ? item.price + '–' + item.priceMax : item.price;
    return (item.from ? 'desde' + NBSP : '') + formatEuros(amount);
  }

  function formatSaving(item) {
    if (!item || typeof item.saving !== 'number') return '';
    return 'ahorras' + NBSP + formatEuros(item.saving);
  }

  function waMessage(kind, subject) {
    const text = (subject || '').trim();
    if (kind === 'producto') {
      return text ? 'Hola Paula, me interesa: ' + text : 'Hola Paula, me gustaría información.';
    }
    return text ? 'Hola Paula, me gustaría reservar: ' + text : 'Hola Paula, me gustaría reservar una cita.';
  }

  function buildWaUrl(phoneDigits, message) {
    const url = 'https://wa.me/' + phoneDigits;
    return message ? url + '?text=' + encodeURIComponent(message) : url;
  }

  function hoursToRows(hours) {
    return hours.map((h) => ({
      days: h.days,
      text: h.slots.length ? h.slots.join(' · ') : 'Cerrado'
    }));
  }

  function categoryOf(items, id) {
    const item = items[id];
    return item && item.category ? item.category : null;
  }

  function composeContactMessage(fields) {
    const parts = ['Hola Paula, soy ' + fields.name.trim() + '.'];
    if (fields.service) parts.push('Me interesa: ' + fields.service + '.');
    parts.push(fields.message.trim());
    return parts.join(' ');
  }

  const AuraLib = {
    formatPrice,
    formatSaving,
    waMessage,
    buildWaUrl,
    hoursToRows,
    categoryOf,
    composeContactMessage
  };

  root.AuraLib = AuraLib;
  if (typeof module !== 'undefined' && module.exports) module.exports = AuraLib;
})(typeof window !== 'undefined' ? window : globalThis);
