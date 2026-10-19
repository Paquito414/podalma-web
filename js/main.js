/* =========================================================
   PodAlma · interacción
   ========================================================= */

const WHATSAPP = '34638118222';

const waLink = (msg) => `https://wa.me/${WHATSAPP}?text=${encodeURIComponent(msg)}`;

document.documentElement.classList.add('js');
document.getElementById('year').textContent = new Date().getFullYear();

/* ---------- Enlaces de WhatsApp ---------- */
document.querySelectorAll('[data-wa]').forEach((a) => {
  a.href = waLink(a.dataset.wa);
  a.target = '_blank';
  a.rel = 'noopener';
});

/* ---------- Cabecera: se compacta al hacer scroll ---------- */
const header = document.getElementById('header');
const hero = document.querySelector('.hero__video');
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
let ticking = false;

function onScroll() {
  const y = window.scrollY;
  header.classList.toggle('is-scrolled', y > 40);
  // Parallax suave en el hero
  if (hero && !reduceMotion && y < window.innerHeight * 1.2) {
    hero.style.transform = `translate3d(0, ${y * -0.12}px, 0)`;
  }
  ticking = false;
}
window.addEventListener('scroll', () => {
  if (!ticking) { requestAnimationFrame(onScroll); ticking = true; }
}, { passive: true });
onScroll();

/* ---------- Menú móvil ---------- */
const burger = document.getElementById('burger');
const nav = document.getElementById('nav');

function setMenu(open) {
  burger.setAttribute('aria-expanded', String(open));
  burger.setAttribute('aria-label', open ? 'Cerrar menú' : 'Abrir menú');
  nav.classList.toggle('is-open', open);
  document.body.classList.toggle('menu-open', open);
}
burger.addEventListener('click', () => setMenu(burger.getAttribute('aria-expanded') !== 'true'));
nav.addEventListener('click', (e) => { if (e.target.closest('a')) setMenu(false); });
document.addEventListener('keydown', (e) => { if (e.key === 'Escape') setMenu(false); });

/* ---------- Enlace activo en la navegación ---------- */
const navLinks = [...nav.querySelectorAll('a')];
const sections = navLinks
  .filter((a) => a.getAttribute('href').startsWith('#'))
  .map((a) => document.querySelector(a.getAttribute('href')))
  .filter(Boolean);

const navObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (!entry.isIntersecting) return;
    navLinks.forEach((a) => a.classList.toggle('is-active', a.getAttribute('href') === '#' + entry.target.id));
  });
}, { rootMargin: '-45% 0px -50% 0px' });
sections.forEach((s) => navObserver.observe(s));

/* ---------- Aparición suave al hacer scroll ---------- */
const revealEls = document.querySelectorAll('[data-reveal]');
document.querySelectorAll('.services__grid, .journal__grid').forEach((grid) => {
  [...grid.children].forEach((el, i) => el.style.setProperty('--delay', `${(i % 3) * 0.12}s`));
});

if ('IntersectionObserver' in window && !reduceMotion) {
  const io = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
  revealEls.forEach((el) => io.observe(el));
} else {
  revealEls.forEach((el) => el.classList.add('is-visible'));
}

/* ---------- Blog y vídeos (contenido en js/contenido.js) ---------- */
const esc = (s = '') => String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const PLAY_ICON = '<span class="player__icon" aria-hidden="true"><svg viewBox="0 0 24 24" width="22" height="22" fill="currentColor"><path d="M8 5.5v13l11-6.5z"/></svg></span>';

const blogList = document.getElementById('blog-list');
if (blogList && typeof BLOG !== 'undefined') {
  const limit = Number(blogList.dataset.limit) || BLOG.length;
  blogList.innerHTML = BLOG.slice(0, limit).map((p) => `
    <article class="post">
      <p class="post__cat">${esc(p.categoria)}${p.fecha ? ` · ${esc(p.fecha)}` : ''}</p>
      <h3>${esc(p.titulo)}</h3>
      <p>${esc(p.resumen)}</p>
      ${p.enlace
        ? `<a class="post__link" href="${esc(p.enlace)}">Leer artículo</a>`
        : '<span class="post__soon">Próximamente</span>'}
    </article>`).join('');
}

const videoList = document.getElementById('video-list');
if (videoList && typeof VIDEOS !== 'undefined') {
  const limit = Number(videoList.dataset.limit) || VIDEOS.length;
  videoList.innerHTML = VIDEOS.slice(0, limit).map((v) => {
    const label = `Reproducir el vídeo «${esc(v.titulo)}»`;
    let media;
    if (v.tipo === 'youtube') {
      const cover = v.portada || `https://i.ytimg.com/vi/${esc(v.youtube)}/hqdefault.jpg`;
      media = `<div class="player" data-youtube="${esc(v.youtube)}">
          <img src="${esc(cover)}" alt="" loading="lazy">
          <button class="player__play" type="button" aria-label="${label}">${PLAY_ICON}</button>
        </div>`;
    } else if (v.tipo === 'enlace') {
      media = `<a class="player" href="${esc(v.url)}" target="_blank" rel="noopener" aria-label="Ver «${esc(v.titulo)}» (se abre en otra pestaña)">
          <img src="${esc(v.portada)}" alt="" loading="lazy">
          <span class="player__play">${PLAY_ICON}</span>
        </a>`;
    } else {
      media = `<div class="player">
          <video src="${esc(v.archivo)}" poster="${esc(v.portada || '')}" preload="none" playsinline></video>
          <button class="player__play" type="button" aria-label="${label}">${PLAY_ICON}</button>
        </div>`;
    }
    return `
      <article class="vcard${v.vertical ? ' vcard--vertical' : ''}">
        ${media}
        <div class="vcard__body">
          <h3>${esc(v.titulo)}</h3>
          <p>${esc(v.descripcion)}</p>
          ${v.duracion ? `<p class="vcard__meta">${esc(v.duracion)}</p>` : ''}
        </div>
      </article>`;
  }).join('');
}

/* ---------- Reproductores: portada + botón; al pulsar aparece el vídeo con controles ---------- */
document.addEventListener('click', (e) => {
  const btn = e.target.closest('button.player__play');
  if (!btn) return;
  const player = btn.closest('.player');
  if (player.dataset.youtube) {
    player.innerHTML = `<iframe src="https://www.youtube-nocookie.com/embed/${encodeURIComponent(player.dataset.youtube)}?autoplay=1&rel=0" title="Vídeo de YouTube" allow="autoplay; encrypted-media; picture-in-picture" allowfullscreen></iframe>`;
    player.classList.add('is-playing');
    return;
  }
  const v = player.querySelector('video');
  document.querySelectorAll('.player video').forEach((other) => { if (other !== v) other.pause(); });
  v.controls = true;
  player.classList.add('is-playing');
  v.play().catch(() => {});
  v.focus();
});

/* ---------- Pestañas Blog / Vídeos ---------- */
const tabs = [...document.querySelectorAll('.tabs__tab')];

function showTab(panelId, focus = false) {
  tabs.forEach((t) => {
    const on = t.getAttribute('aria-controls') === panelId;
    t.setAttribute('aria-selected', String(on));
    t.tabIndex = on ? 0 : -1;
    document.getElementById(t.getAttribute('aria-controls')).hidden = !on;
    if (on && focus) t.focus();
  });
  // Al salir de la pestaña de vídeos se pausa lo que se esté reproduciendo
  if (panelId !== 'videos') document.querySelectorAll('#videos video').forEach((v) => v.pause());
}

tabs.forEach((t, i) => {
  t.addEventListener('click', () => showTab(t.getAttribute('aria-controls')));
  t.addEventListener('keydown', (e) => {
    const keys = { ArrowRight: i + 1, ArrowLeft: i - 1, Home: 0, End: tabs.length - 1 };
    if (!(e.key in keys)) return;
    e.preventDefault();
    const next = tabs[(keys[e.key] + tabs.length) % tabs.length];
    showTab(next.getAttribute('aria-controls'), true);
  });
});

// Si alguien entra con #blog o #videos en la dirección, se abre esa pestaña
function openTabFromHash(hash) {
  const id = hash.replace('#', '');
  if (!tabs.some((t) => t.getAttribute('aria-controls') === id)) return;
  showTab(id);
  document.getElementById('diario').scrollIntoView();
}
if (location.hash) openTabFromHash(location.hash);

/* ---------- Formulario de contacto → WhatsApp ----------
   La web es estática: el formulario prepara el mensaje y lo abre en WhatsApp.
   Si más adelante se quiere recibir por email, se puede conectar a
   Formspree, Netlify Forms o similar. */
const form = document.getElementById('form');
const errorBox = document.getElementById('form-error');

if (form) form.addEventListener('submit', (e) => {
  e.preventDefault();
  const data = new FormData(form);
  const required = [
    ['nombre', 'Escribe tu nombre.'],
    ['email', 'Escribe un email válido.'],
  ];
  form.querySelectorAll('.is-invalid').forEach((el) => el.classList.remove('is-invalid'));

  for (const [name, msg] of required) {
    const field = form.elements[name];
    const value = String(data.get(name) || '').trim();
    const valid = name === 'email' ? /^\S+@\S+\.\S+$/.test(value) : value.length > 0;
    if (!valid) {
      field.classList.add('is-invalid');
      field.focus();
      errorBox.textContent = msg;
      return;
    }
  }
  if (!form.elements.privacidad.checked) {
    errorBox.textContent = 'Necesitamos que aceptes la política de privacidad.';
    form.elements.privacidad.focus();
    return;
  }
  errorBox.textContent = '';

  const lines = [
    'Hola Gemma, te escribo desde la web de PodAlma.',
    '',
    `Nombre: ${data.get('nombre')} ${data.get('apellidos') || ''}`.trim(),
    `Email: ${data.get('email')}`,
    data.get('telefono') ? `Teléfono: ${data.get('telefono')}` : '',
    data.get('servicio') ? `Servicio de interés: ${data.get('servicio')}` : '',
    data.get('mensaje') ? `\n${data.get('mensaje')}` : '',
  ].filter((line, i) => line || i === 1); // conserva la línea en blanco tras el saludo

  window.open(waLink(lines.join('\n')), '_blank', 'noopener');
});

/* Vídeo de portada: se reproduce solo mientras se ve (y nunca con «reducir movimiento») */
if (hero) {
  if (reduceMotion) {
    hero.removeAttribute('autoplay');
    hero.pause();
  } else {
    new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) hero.play().catch(() => {});
      else hero.pause();
    }, { threshold: 0.05 }).observe(hero);
  }
}

/* ---------- Mapa: Google Maps solo se carga cuando la persona lo pide ---------- */
const mapBox = document.getElementById('map');
const mapBtn = document.getElementById('map-load');
if (mapBox && mapBtn) {
  mapBtn.addEventListener('click', () => {
    mapBox.innerHTML = `<iframe title="Ubicación de la consulta de Gemma Ribas en Google Maps" src="${mapBox.dataset.src}" referrerpolicy="no-referrer-when-downgrade" allowfullscreen></iframe>`;
    mapBox.classList.add('is-loaded');
    mapBox.querySelector('iframe').focus();
  });
}
