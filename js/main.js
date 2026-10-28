/* Centro Aura (demo B) — comportamiento de la web.
   Depende de js/data.js (window.AURA_DATA) y js/lib.js (window.AuraLib).
   Todo es mejora progresiva: sin JavaScript la web se lee entera y los enlaces de respaldo
   (wa.me, tel:, Google Maps) siguen funcionando. */
(function () {
  'use strict';

  const data = window.AURA_DATA;
  const lib = window.AuraLib;
  if (!data || !lib) return;

  const $$ = (selector, context = document) => Array.from(context.querySelectorAll(selector));

  /* "L–V 9:30–14:00 · 17:00–20:30": primera fila del horario, en versión corta */
  function hoursSummary() {
    const first = data.hours[0];
    return 'L–V ' + first.slots.map((slot) => slot.replace(/ – /g, '–')).join(' · ');
  }

  /* Vuelca precios, duraciones, teléfono y horario desde data.js */
  function fillData() {
    $$('[data-price]').forEach((el) => {
      el.textContent = lib.formatPrice(data.items[el.dataset.price]);
    });
    $$('[data-duration]').forEach((el) => {
      const item = data.items[el.dataset.duration];
      if (item && item.duration) el.textContent = item.duration;
    });
    $$('[data-phone]').forEach((el) => {
      el.textContent = data.business.phoneDisplay;
      const link = el.closest('a[href^="tel:"]');
      if (link) link.href = 'tel:+' + data.business.phoneDigits;
    });
    $$('[data-hours-summary]').forEach((el) => {
      el.textContent = hoursSummary();
    });
    $$('[data-hours]').forEach((dl) => {
      dl.replaceChildren(...lib.hoursToRows(data.hours).flatMap((row, i) => {
        const dt = document.createElement('dt');
        const dd = document.createElement('dd');
        dt.textContent = row.days;
        dd.textContent = row.text;
        if (data.hours[i].note) {
          const note = document.createElement('small');
          note.className = 'hours__note';
          note.textContent = data.hours[i].note;
          dd.append(note);
        }
        return [dt, dd];
      }));
    });
  }

  /* Enlaces de WhatsApp con el mensaje ya escrito */
  function wireWhatsApp() {
    $$('[data-wa]').forEach((el) => {
      const message = lib.waMessage(el.dataset.waKind || 'reserva', el.dataset.wa);
      el.href = lib.buildWaUrl(data.business.phoneDigits, message);
      el.target = '_blank';
      el.rel = 'noopener';
      /* Un lector de pantalla recorre los botones fuera de contexto: añade a cuál se refiere */
      const label = el.textContent.replace(/\s+/g, ' ').trim();
      if (el.dataset.wa && label && !el.hasAttribute('aria-label')) el.setAttribute('aria-label', label + ': ' + el.dataset.wa);
    });
  }

  /* Menú móvil desplegable: Esc o un toque fuera lo cierran, el foco queda atrapado en el menú
     y el resto de la página se vuelve inerte mientras está abierto. */
  function initMenu() {
    const toggle = document.querySelector('.nav-toggle');
    const menu = document.getElementById('site-menu');
    if (!toggle || !menu) return;

    const outside = $$('main, .site-footer, .topbar, .wa-float');
    const isOpen = () => toggle.getAttribute('aria-expanded') === 'true';
    const setOpen = (open) => {
      toggle.setAttribute('aria-expanded', String(open));
      toggle.setAttribute('aria-label', open ? 'Cerrar menú' : 'Abrir menú');
      document.body.classList.toggle('menu-open', open);
      outside.forEach((el) => { el.inert = open; });
      if (open) menu.querySelector('a').focus();
    };

    toggle.addEventListener('click', () => setOpen(!isOpen()));
    menu.addEventListener('click', (event) => {
      if (event.target.closest('a') && isOpen()) setOpen(false);
    });
    document.addEventListener('click', (event) => {
      if (isOpen() && !event.target.closest('.site-header')) setOpen(false);
    });
    document.addEventListener('keydown', (event) => {
      if (!isOpen()) return;
      if (event.key === 'Escape') {
        setOpen(false);
        toggle.focus();
        return;
      }
      if (event.key !== 'Tab') return;
      const focusables = [toggle, ...$$('a', menu)];
      const first = focusables[0];
      const last = focusables[focusables.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    });
    window.matchMedia('(min-width: 900px)').addEventListener('change', (event) => {
      if (event.matches && isOpen()) setOpen(false);
    });
  }

  /* Submenús del menú principal (Servicios, Tienda): en escritorio se abren con el botón,
     con el ratón o con el teclado; en móvil y tablet el menú los muestra desplegados. */
  function initSubmenus() {
    const items = $$('.site-nav__list .has-sub');
    if (!items.length) return;
    const setOpen = (item, open) => {
      item.classList.toggle('is-open', open);
      item.querySelector('.sub-toggle').setAttribute('aria-expanded', String(open));
    };
    items.forEach((item) => {
      const toggle = item.querySelector('.sub-toggle');
      toggle.addEventListener('click', () => {
        const open = !item.classList.contains('is-open');
        items.forEach((other) => setOpen(other, false));
        setOpen(item, open);
      });
    });
    document.addEventListener('click', (event) => {
      if (!event.target.closest('.has-sub')) items.forEach((item) => setOpen(item, false));
    });
    document.addEventListener('keydown', (event) => {
      if (event.key !== 'Escape') return;
      const open = items.find((item) => item.classList.contains('is-open'));
      if (!open) return;
      setOpen(open, false);
      if (open.contains(document.activeElement)) open.querySelector('.sub-toggle').focus();
    });
  }

  /* Selector Lista / Cuadrícula (Servicios y Tienda). Cada bloque de elementos ([data-view-block]:
     una categoría de servicios, los champús, las tarjetas regalo) tiene su propia vista, que se
     guarda en el atributo data-view del bloque. Empieza en lista y la elección del visitante se
     recuerda en este navegador. Sin JavaScript los selectores quedan ocultos y se ve la cuadrícula. */
  function initViewToggle() {
    $$('[data-view-block]').forEach((block) => {
      const buttons = $$('.view-bar [data-view]', block);
      if (!buttons.length) return;
      const key = 'aura-vista-' + block.id;
      const read = () => {
        try {
          const value = window.localStorage.getItem(key);
          return value === 'grid' || value === 'list' ? value : null;
        } catch {
          return null;
        }
      };
      const save = (view) => {
        try {
          window.localStorage.setItem(key, view);
        } catch {
          /* sin almacenamiento: la elección vale solo para esta visita */
        }
      };
      const apply = (view) => {
        block.dataset.view = view;
        buttons.forEach((button) => button.setAttribute('aria-pressed', String(button.dataset.view === view)));
      };

      apply(read() || 'list');
      buttons.forEach((button) => {
        button.addEventListener('click', () => {
          apply(button.dataset.view);
          save(button.dataset.view);
        });
      });
      $$('.view-bar', block).forEach((bar) => { bar.hidden = false; });
    });
  }

  /* Cuadrícula de servicios en móvil: las tarjetas muestran solo lo esencial y "Ver qué incluye"
     abre una ventana emergente (<dialog>) con la duración, la descripción y la lista. Se cierra con
     la X, con el botón "Cerrar", tocando fuera o con Esc. */
  function initServiceMore() {
    const buttons = $$('.service-row__more');
    if (!buttons.length) return;

    const dialog = document.createElement('dialog');
    dialog.className = 'service-dialog';
    dialog.setAttribute('aria-labelledby', 'service-dialog-title');
    dialog.innerHTML = '<div class="service-dialog__inner">'
      + '<div class="service-dialog__head"><h2 class="service-dialog__title" id="service-dialog-title"></h2>'
      + '<button class="service-dialog__x" type="button" aria-label="Cerrar"><svg class="icon" aria-hidden="true" focusable="false"><use href="#i-cerrar"/></svg></button></div>'
      + '<div class="service-dialog__body"></div>'
      + '<button class="btn btn--outline service-dialog__close" type="button">Cerrar</button>'
      + '</div>';
    document.body.append(dialog);
    const title = dialog.querySelector('.service-dialog__title');
    const body = dialog.querySelector('.service-dialog__body');
    dialog.querySelectorAll('.service-dialog__x, .service-dialog__close').forEach((el) => {
      el.addEventListener('click', () => dialog.close());
    });
    dialog.addEventListener('click', (event) => {
      if (event.target === dialog) dialog.close();
    });

    buttons.forEach((button) => {
      const row = button.closest('.service-row');
      button.addEventListener('click', () => {
        title.textContent = row.querySelector('h3').textContent;
        body.replaceChildren(...['.chips', 'p:not(.service-row__note)', '.includes']
          .map((selector) => row.querySelector(selector))
          .filter(Boolean)
          .map((source) => source.cloneNode(true)));
        dialog.showModal();
      });
    });
  }

  /* Aparición suave al hacer scroll (desactivada si se pide reducir movimiento) */
  function initReveal() {
    const items = $$('.reveal');
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (!items.length || reduced || !('IntersectionObserver' in window)) return;
    document.documentElement.classList.add('reveal-ready');
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      });
    }, { rootMargin: '0px 0px -8% 0px' });
    items.forEach((item) => observer.observe(item));
  }

  /* Pestañas de Servicios: sin JS se ven las tres categorías apiladas.
     "#<id>" abre la pestaña que contiene ese id: el id de un panel (salud-capilar,
     spa, peluqueria) o el de un servicio (spa-esencial…). */
  function initTabs() {
    const tablist = document.querySelector('[role="tablist"]');
    if (!tablist) return;
    const tabs = $$('[role="tab"]', tablist);
    const panels = tabs.map((tab) => document.getElementById(tab.getAttribute('aria-controls')));

    const select = (tab, moveFocus) => {
      tabs.forEach((t, i) => {
        const active = t === tab;
        t.setAttribute('aria-selected', String(active));
        t.tabIndex = active ? 0 : -1;
        panels[i].hidden = !active;
      });
      if (moveFocus) tab.focus();
    };

    tabs.forEach((tab, i) => {
      tab.addEventListener('click', () => select(tab, false));
      tab.addEventListener('keydown', (event) => {
        const last = tabs.length - 1;
        const target = {
          ArrowRight: tabs[i === last ? 0 : i + 1],
          ArrowLeft: tabs[i === 0 ? last : i - 1],
          Home: tabs[0],
          End: tabs[last]
        }[event.key];
        if (!target) return;
        event.preventDefault();
        select(target, true);
      });
    });

    const openFromHash = (isInitial) => {
      let id = '';
      try {
        id = decodeURIComponent(window.location.hash.slice(1));
      } catch {
        id = '';
      }
      const category = lib.categoryOf(data.items, id);
      const tab = tabs.find((t) => t.getAttribute('aria-controls') === id)
        || tabs.find((t) => t.dataset.category === category);
      if (!tab && !isInitial) return;
      select(tab || tabs[0], false);
      const target = tab && document.getElementById(id);
      if (target) target.scrollIntoView({ block: 'start' });
    };

    tablist.hidden = false;
    openFromHash(true);
    window.addEventListener('hashchange', () => openFromHash(false));
  }

  /* Formulario de Contacto: valida, avisa junto al campo y en un resumen (aria-live)
     y abre WhatsApp con el mensaje compuesto. Sin JS queda la validación nativa (required). */
  function initContactForm() {
    const form = document.getElementById('contact-form');
    if (!form) return;
    form.noValidate = true;
    const fields = [form.elements.nombre, form.elements.mensaje];
    const summary = document.getElementById('form-summary');

    const setError = (field, message) => {
      field.setAttribute('aria-invalid', message ? 'true' : 'false');
      document.getElementById('err-' + field.name).textContent = message;
    };

    fields.forEach((field) => {
      field.addEventListener('input', () => {
        if (field.value.trim()) setError(field, '');
      });
    });

    form.addEventListener('submit', (event) => {
      event.preventDefault();
      const invalid = fields.filter((field) => !field.value.trim());
      fields.forEach((field) => setError(field, invalid.includes(field) ? field.dataset.error : ''));
      if (summary) {
        summary.textContent = invalid.length
          ? 'Revisa el formulario: ' + invalid.map((field) => field.dataset.error).join(' ')
          : '';
      }
      if (invalid.length) {
        invalid[0].focus();
        return;
      }
      const message = lib.composeContactMessage({
        name: form.elements.nombre.value,
        service: form.elements.servicio.value,
        message: form.elements.mensaje.value
      });
      window.open(lib.buildWaUrl(data.business.phoneDigits, message), '_blank', 'noopener');
    });
  }

  /* Mapas de Google: no se contacta con Google hasta que el visitante pulsa el
     botón. Sin JS queda el enlace "Abrir en Google Maps". */
  function initMaps() {
    $$('.map[data-map-src]').forEach((map) => {
      const button = map.querySelector('[data-map-load]');
      if (!button) return;
      button.hidden = false;
      button.addEventListener('click', () => {
        const frame = document.createElement('iframe');
        frame.src = map.dataset.mapSrc;
        frame.title = map.dataset.mapTitle;
        frame.referrerPolicy = 'no-referrer-when-downgrade';
        map.replaceChildren(frame);
        frame.focus();
      });
    });
  }

  fillData();
  wireWhatsApp();
  initMaps();
  initMenu();
  initSubmenus();
  initViewToggle();
  initServiceMore();
  initTabs();
  initContactForm();
  initReveal();
})();
