/* =========================================================
   ARARAT SKREDDER – SCRIPT (ryddet, blått tema via CSS vars)
   - Duplikater fjernet (reveal-system, tabs-init, header/nav)
   - Farger hentes fra :root (–c-gold-1/–c-gold-2=blått)
   - ARIA-tabs + idempotent init
   ========================================================= */

/* ---------- Utils & Theme ---------- */
const $$ = (sel, root=document)=> Array.from(root.querySelectorAll(sel));
const $  = (sel, root=document)=> root.querySelector(sel);
const on = (el, ev, fn, opts)=> el && el.addEventListener(ev, fn, opts);

function getVar(name, fallback='') {
  const v = getComputedStyle(document.documentElement).getPropertyValue(name).trim();
  return v || fallback;
}
function theme() {
  return {
    c1: getVar('--c-gold-1', '#0b5fff'), // mapped to blå
    c2: getVar('--c-gold-2', '#00b3ff'),
    dark1: getVar('--c-dark-1', '#0a1a3a'),
    dark2: getVar('--c-dark-2', '#0f2b5c'),
  };
}

/* ---------- Boot ---------- */
document.addEventListener('DOMContentLoaded', () => {
  // Footer-år
  const y = $('#current-year'); if (y) y.textContent = new Date().getFullYear();

  initPreloader();
  initScrollIndicator();
  initSmoothScroll();          // slått sammen
  initRevealSystem();          // enkel, ikke duplisert
  initHeaderEffects();         // én kilde til header scroll/blur
  initEnhancedMobileMenuV2();  // eneste meny-init
  initContactForm();
  initGalleryLightbox();
  initServiceCardEffects();
  initParallaxEffects();
  initFloatingActionButton();
  initLazyLoading();
  initPerformanceOptimizations();
  initPageBoot();              // aktiv lenke, etc.
  initServicesTabs();          // ARIA + idempotent
  initAllMobileFeatures();     // mobilforbedringer (uten meny-toggling)

  window.addEventListener('load', () => {
    document.body.classList.add('loaded');
    initPageTransitions();
    hidePreloader();
  }, { once:true });
});

/* ================= PRELOADER ================= */
function initPreloader() {
  const { c1, c2, dark1, dark2 } = theme();
  const preloader = document.createElement('div');
  preloader.id = 'preloader';
  preloader.innerHTML = `
    <div class="preloader-content">
      <div class="preloader-logo">ARARAT SKREDDER</div>
      <div class="preloader-spinner"></div>
      <div class="preloader-text">Laster inn...</div>
    </div>
  `;
  preloader.style.cssText = `
    position:fixed; inset:0; background:linear-gradient(135deg, ${dark1} 0%, ${dark2} 100%);
    display:flex; align-items:center; justify-content:center; z-index:10000;
    transition:opacity .5s ease, visibility .5s ease;
  `;
  const style = document.createElement('style');
  style.textContent = `
    .preloader-content{ text-align:center; color:#fff; }
    .preloader-logo{
      font-family:'Bebas Neue', cursive; font-size:3rem; letter-spacing:3px; margin-bottom:2rem;
      background:linear-gradient(135deg, ${c2} 0%, ${c1} 100%);
      -webkit-background-clip:text; background-clip:text; -webkit-text-fill-color:transparent;
    }
    .preloader-spinner{
      width:50px; height:50px; border:4px solid rgba(255,255,255,.25);
      border-top:4px solid ${c1}; border-radius:50%; animation:spin 1s linear infinite; margin:0 auto 1rem;
    }
    .preloader-text{ font-size:1.1rem; opacity:.9; font-weight:500; }
    @keyframes spin{ to{ transform:rotate(360deg) } }
  `;
  document.head.appendChild(style);
  document.body.appendChild(preloader);
}
function hidePreloader() {
  const preloader = $('#preloader');
  if (!preloader) return;
  setTimeout(() => {
    preloader.style.opacity = '0';
    preloader.style.visibility = 'hidden';
    setTimeout(() => preloader.remove(), 500);
  }, 600);
}

/* ================= SCROLL INDICATOR ================= */
function initScrollIndicator() {
  const { c1, c2 } = theme();
  const bar = document.createElement('div');
  bar.className = 'scroll-indicator';
  bar.style.cssText = `
    position:fixed; top:0; left:0; width:100%; height:4px;
    background:linear-gradient(90deg, ${c1}, ${c2}); transform-origin:left;
    transform:scaleX(0); z-index:9999; transition:transform .1s ease;
  `;
  document.body.appendChild(bar);
  let ticking = false;
  function update() {
    const doc = document.documentElement;
    const h = (doc.scrollHeight - doc.clientHeight) || 1;
    bar.style.transform = `scaleX(${Math.min(window.scrollY / h, 1)})`;
    ticking = false;
  }
  window.addEventListener('scroll', () => { if (!ticking){ requestAnimationFrame(update); ticking=true; } }, { passive:true });
}

/* ================= SMOOTH SCROLL (samlet) ================= */
function initSmoothScroll() {
  $$('a[href^="#"]').forEach(a => {
    on(a, 'click', e => {
      const href = a.getAttribute('href');
      if (!href || href === '#') return;
      const target = document.querySelector(href);
      if (!target) return;
      e.preventDefault();
      const header = $('header');
      const top = target.getBoundingClientRect().top + window.pageYOffset - ((header?.offsetHeight||0) + 20);
      window.scrollTo({ top, behavior:'smooth' });
    });
  });
}

/* ================= REVEAL SYSTEM (enkelt, ikke dupliser) ================= */
function initRevealSystem() {
  if (window.__revealSystemInit) return; window.__revealSystemInit = true;

  const style = document.createElement('style');
  style.textContent = `
    @media (prefers-reduced-motion: reduce){ .reveal-base{transition:none!important; animation:none!important; opacity:1!important; transform:none!important; filter:none!important } .pl-initial{opacity:1!important; transform:none!important; filter:none!important} }
    .reveal-base{opacity:0; will-change:transform,opacity,filter; transform:translateY(24px); filter:blur(2px);
      transition: opacity .7s ease, transform .7s cubic-bezier(.22,.61,.36,1), filter .7s ease; }
    .reveal-in{opacity:1; transform:none; filter:none;}
    .reveal-fade-up{transform:translateY(24px)} .reveal-fade-down{transform:translateY(-24px)} .reveal-fade-left{transform:translateX(24px)} .reveal-fade-right{transform:translateX(-24px)} .reveal-scale-in{transform:scale(.96)}
    .reveal-pop{ transition-timing-function:cubic-bezier(.18,.89,.32,1.28)!important } .reveal-soft{ transition-duration:.9s!important }
    .pl-initial{opacity:0; transform:translateY(12px); filter:blur(2px)} .pl-in{opacity:1; transform:none; filter:none; transition:opacity .7s ease, transform .7s cubic-bezier(.22,.61,.36,1), filter .7s ease}
  `;
  document.head.appendChild(style);

  const map = { 'fade-up':'reveal-fade-up','fade-down':'reveal-fade-down','fade-left':'reveal-fade-left','fade-right':'reveal-fade-right','scale-in':'reveal-scale-in','pop':'reveal-pop','soft':'reveal-soft' };

  function prep(el){
    if (el.dataset.revealReady === '1') return;
    el.dataset.revealReady = '1';
    const anim = (el.dataset.anim || 'fade-up').toLowerCase().split('+').map(s=>s.trim());
    el.classList.add('reveal-base');
    anim.forEach(k => el.classList.add(map[k] || 'reveal-fade-up'));
    if (el.dataset.delay){ const ms = parseInt(el.dataset.delay,10)||0; el.style.transitionDelay = `${ms}ms`; }
  }

  const io = new IntersectionObserver((entries)=>{
    entries.forEach(entry=>{
      if (!entry.isIntersecting) return;
      const el = entry.target;
      const parent = el.closest('[data-stagger]');
      const step = parent ? (parseInt(parent.dataset.stagger,10)||80) : 0;
      const idx = parent ? $$( '[data-anim]', parent ).indexOf(el) : 0;
      const existing = parseFloat((el.style.transitionDelay||'0ms').replace('ms',''))||0;
      const total = existing + (step * Math.max(idx,0));
      if (total) el.style.transitionDelay = `${total}ms`;
      requestAnimationFrame(()=> el.classList.add('reveal-in'));
      io.unobserve(el);
    });
  }, { rootMargin:'0px 0px -10% 0px', threshold:0.12 });

  function boot(){ $$('[data-anim]').forEach(el=>{ prep(el); io.observe(el); }); }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot, {once:true}); else boot();

  // page‑load “pl” støtte
  window.addEventListener('load', () => {
    const group = $$('[data-pl]'); if (!group.length) return;
    group.forEach((el,i)=>{
      el.classList.add('pl-initial');
      setTimeout(()=>{ el.style.transitionDelay = `${(parseInt(el.dataset.pl,10) || (i*80))}ms`; el.classList.add('pl-in'); }, 30);
    });
  }, { once:true });
}

/* ================= HEADER EFFECTS (samlet) ================= */
function initHeaderEffects() {
  const header = $('header');
  if (!header) return;

  let lastY = window.scrollY, ticking = false;
  const blurDesktop = 'blur(25px)';

  function isNarrow(){ return window.innerWidth <= 768; }

  function update() {
    const y = window.scrollY;
    // bakgrunn/skygge
    const opaque = y > 100;
    header.style.background = `rgba(255,255,255,${opaque ? '0.98' : '0.95'})`;
    header.style.boxShadow  = `0 8px 32px rgba(0,0,0,${opaque ? '0.15' : '0.12'})`;

    // blur
    if (isNarrow()) {
      header.style.backdropFilter = 'none';
      header.style.webkitBackdropFilter = 'none';
    } else {
      header.style.backdropFilter = blurDesktop;
      header.style.webkitBackdropFilter = blurDesktop;
    }

    // synlighet
    if (isNarrow()) header.style.transform = 'translateY(0)';
    else header.style.transform = (y > lastY && y > 200) ? 'translateY(-100%)' : 'translateY(0)';

    lastY = y; ticking = false;
  }
  update();
  window.addEventListener('scroll', ()=>{ if (!ticking){ requestAnimationFrame(update); ticking=true; } }, { passive:true });
  window.addEventListener('resize', debounce(update, 150), { passive:true });
}

/* ================= CONTACT FORM (uendret hovedlogikk) ================= */
function initContactForm() {
  const form = $('#contactForm'), thanks = $('#thankYouMessage');
  if (!form) return;
  const groups = $$('.form-group', form);
  groups.forEach(g=>{
    const input = g.querySelector('input, textarea, select');
    const label = g.querySelector('label');
    if (!input || !label) return;
    on(input, 'focus', ()=>{ g.classList.add('focused'); label.style.transform='translateY(-25px) scale(0.85)'; label.style.color=getVar('--c-gold-1','#0b5fff'); });
    on(input, 'blur', ()=>{ if (!input.value){ g.classList.remove('focused'); label.style.transform=''; label.style.color='#1a202c'; } });
    if (input.value){ g.classList.add('focused'); label.style.transform='translateY(-25px) scale(0.85)'; }
  });

  on(form, 'submit', e=>{
    e.preventDefault();
    const name = $('#name')?.value.trim();
    const email = $('#email')?.value.trim();
    const message = $('#message')?.value.trim();
    if (!name || name.length<2) return showNotification('Vennligst oppgi et gyldig navn (minst 2 tegn).','error');
    if (!email) return showNotification('Vennligst oppgi en e-postadresse.','error');
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!re.test(email)) return showNotification('Vennligst oppgi en gyldig e-postadresse.','error');
    if (!message || message.length<10) return showNotification('Vennligst skriv en melding (minst 10 tegn).','error');

    const btn = form.querySelector('button[type="submit"]');
    const txt = btn.textContent;
    btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sender...';
    btn.disabled = true; 
    btn.style.opacity = '0.7';

    // Submit to Formspree
    form.submit();
  });
}

/* ================= NOTIFICATIONS ================= */
function showNotification(message, type='info') {
  $$('.notification').forEach(n => n.remove());
  const icon = { success:'check-circle', error:'exclamation-triangle', warning:'exclamation-circle', info:'info-circle' }[type] || 'info-circle';
  const color = { success:'#48bb78', error:'#f56565', warning:'#ed8936', info: getVar('--c-gold-1','#0b5fff') }[type];
  const n = document.createElement('div');
  n.className = `notification notification-${type}`;
  n.innerHTML = `<i class="fas fa-${icon}"></i><span>${message}</span><button class="notification-close" aria-label="Lukk">&times;</button>`;
  n.style.cssText = `
    position:fixed; top:20px; right:20px; background:${color}; color:#fff; padding:1.2rem 1.8rem; border-radius:12px;
    box-shadow:0 10px 30px rgba(0,0,0,.2); z-index:10000; display:flex; align-items:center; gap:.8rem;
    transform:translateX(100%); transition:transform .3s ease; max-width:400px; font-weight:500;
  `;
  const close = n.querySelector('.notification-close');
  close.style.cssText = `background:none; border:none; color:#fff; font-size:1.5rem; cursor:pointer; margin-left:auto; opacity:.85`;
  on(close, 'click', ()=>{ n.style.transform='translateX(100%)'; setTimeout(()=> n.remove(), 300); });
  document.body.appendChild(n);
  setTimeout(()=> n.style.transform='translateX(0)', 60);
  setTimeout(()=> { n.style.transform='translateX(100%)'; setTimeout(()=> n.remove(), 300); }, 5000);
}

/* ================= GALLERY LIGHTBOX ================= */
function initGalleryLightbox() {
  $$('.gallery-item img').forEach(img=>{
    on(img, 'click', ()=> createLightbox(img.src, img.alt));
  });
}
function createLightbox(src, alt) {
  const lb = document.createElement('div');
  lb.className = 'lightbox';
  lb.innerHTML = `
    <div class="lightbox-content">
      <img src="${src}" alt="${alt||''}" loading="lazy">
      <button class="lightbox-close" aria-label="Lukk">&times;</button>
      <div class="lightbox-info"><h3>${alt||''}</h3></div>
    </div>
  `;
  const { c1, c2 } = theme();
  lb.style.cssText = `position:fixed; inset:0; background:rgba(0,0,0,.95); display:flex; justify-content:center; align-items:center; z-index:10000; opacity:0; transition:opacity .3s ease; backdrop-filter:blur(10px)`;
  const content = lb.querySelector('.lightbox-content');
  content.style.cssText = `position:relative; max-width:90%; max-height:90%; animation:lbZoom .3s ease`;
  const img = lb.querySelector('img');
  img.style.cssText = `max-width:100%; max-height:100%; border-radius:15px; box-shadow:0 20px 60px rgba(0,0,0,.5)`;
  const close = lb.querySelector('.lightbox-close');
  close.style.cssText = `
    position:absolute; top:-60px; right:0; background:linear-gradient(135deg, ${c1}, ${c2}); border:none; color:#fff; font-size:2rem; cursor:pointer;
    padding:.7rem 1rem; border-radius:999px; box-shadow:0 10px 30px rgba(0,0,0,.3);
  `;
  document.body.appendChild(lb);
  const style = document.createElement('style'); style.textContent = `@keyframes lbZoom{ from{ transform:scale(.5); opacity:0 } to{ transform:scale(1); opacity:1 } }`; document.head.appendChild(style);
  setTimeout(()=> lb.style.opacity='1', 10);
  function closeLb(){ lb.style.opacity='0'; setTimeout(()=>{ lb.remove(); style.remove(); }, 300); }
  on(close, 'click', closeLb); on(lb, 'click', e=>{ if (e.target === lb) closeLb(); });
  on(document, 'keydown', e=>{ if (e.key === 'Escape'){ closeLb(); } }, { once:true });
}

/* ================= SERVICE CARD EFFECTS ================= */
function initServiceCardEffects() {
  $$('.service-cards .card').forEach(card=>{
    on(card,'mouseenter',()=>{ card.style.transform='translateY(-20px) rotateX(5deg)'; card.style.boxShadow='0 30px 70px rgba(0,0,0,.15)'; });
    on(card,'mousemove',e=>{
      const r = card.getBoundingClientRect(); const x = e.clientX - r.left, y = e.clientY - r.top;
      const cx = r.width/2, cy = r.height/2;
      const rx = (y - cy) / 8, ry = (cx - x) / 8;
      card.style.transform = `translateY(-20px) rotateX(${rx}deg) rotateY(${ry}deg)`;
    });
    on(card,'mouseleave',()=>{ card.style.transform='translateY(0) rotateX(0) rotateY(0)'; card.style.boxShadow='0 15px 50px rgba(0,0,0,.08)'; });
  });
}

/* ================= PARALLAX (deaktivert på mobil) ================= */
function initParallaxEffects() {
  const prefersReduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const isAbout = document.body.classList.contains('page--about'); // skru av her

  // Av på mobil, ved redusert bevegelse, eller på Om oss
  if (isMobile() || prefersReduced || isAbout) {
    const hero = document.querySelector('.hero-section');
    if (hero) hero.style.transform = '';
    document.querySelectorAll('.parallax-element').forEach(el => el.style.transform = '');
    return;
  }

  const hero = document.querySelector('.hero-section');
  if (!hero) return;

  // Viktig: ikke flytt hele hero – kun indre elementer
  let ticking = false;
  function update() {
    const s = window.pageYOffset;
    document.querySelectorAll('.parallax-element').forEach(el => {
      const speed = Number(el.dataset.speed || 0.3);
      el.style.transform = `translate3d(0, ${s * speed}px, 0)`;
    });
    ticking = false;
  }

  // Sørg for at hero-konteineren er statisk
  hero.style.transform = '';

  window.addEventListener('scroll', () => {
    if (!ticking) { requestAnimationFrame(update); ticking = true; }
  }, { passive: true });

  update();
}

/* ================= FAB ================= */
function initFloatingActionButton() {
  const { c1, c2 } = theme();
  const fab = document.createElement('button');
  fab.type = 'button';
  fab.innerHTML = '<i class="fas fa-phone"></i>';
  fab.className = 'floating-action-button';
  fab.setAttribute('aria-label', 'Ring oss');
  fab.style.cssText = `
    position:fixed; bottom:30px; right:30px; width:65px; height:65px;
    background:linear-gradient(135deg, ${c1}, ${c2}); border-radius:50%;
    display:flex; align-items:center; justify-content:center; color:#fff; font-size:1.6rem;
    cursor:pointer; box-shadow:0 8px 25px rgba(0,0,0,.25); z-index:1000; border:3px solid rgba(255,255,255,.25); transition:transform .25s ease, box-shadow .25s ease;
  `;
  on(fab,'click', ()=> location.href='tel:+4748188552');
  on(fab,'mouseenter', ()=>{ fab.style.transform='scale(1.12)'; fab.style.boxShadow='0 15px 40px rgba(0,0,0,.35)'; });
  on(fab,'mouseleave', ()=>{ fab.style.transform='scale(1)'; fab.style.boxShadow='0 8px 25px rgba(0,0,0,.25)'; });
  const style = document.createElement('style'); style.textContent='@keyframes pulse{ 0%{transform:scale(1)} 50%{transform:scale(1.1)} 100%{transform:scale(1)} }'; document.head.appendChild(style);
  setInterval(()=>{ fab.style.animation='pulse 2s ease-in-out'; setTimeout(()=> fab.style.animation='', 2000); }, 10000);
  document.body.appendChild(fab);
}

/* ================= LAZY LOADING (data-src) ================= */
function initLazyLoading() {
  const imgs = $$('img[data-src]');
  if (!('IntersectionObserver' in window) || !imgs.length) return;
  const io = new IntersectionObserver((entries)=>{
    entries.forEach(e=>{
      if (!e.isIntersecting) return;
      const img = e.target; img.src = img.dataset.src; img.classList.remove('lazy'); io.unobserve(img);
    });
  });
  imgs.forEach(img=> io.observe(img));
}

/* ================= PERF ================= */
function initPerformanceOptimizations() {
  $$('img:not([loading])').forEach(img=> img.setAttribute('loading','lazy'));
  // Kan preloade eksterne CSS om ønskelig – hoppet over for enkelhet
}

/* ================= PAGE TRANSITIONS ================= */
function initPageTransitions() {
  // Page transition overlay disabled to avoid double-loading screens.
  // The site already uses a preloader spinner; keeping that alone improves UX.
  // This function intentionally does not create an overlay. Navigation proceeds
  // normally so the preloader on the next page is the only visible loader.
  // If you prefer a subtle transition later, we can implement a lightweight fade.
  return;
}

/* ================= PAGE BOOT (active nav) ================= */
function initPageBoot() {
  const path = location.pathname.split('/').pop() || 'index.html';
  $$('.nav-links a').forEach(a=>{
    const href = a.getAttribute('href')||'';
    if (!a.classList.contains('navbar-cta') && href.endsWith(path)) a.classList.add('active');
  });
}

/* ================= SERVICES TABS (ARIA + idempotent) ================= */
function initServicesTabs() {
  if (window.__svcTabsInit) return; window.__svcTabsInit = true;
  const container = $('.services-tabs'); if (!container) return;

  const buttons = $$('.tab-button', container);
  const panes   = $$('.tab-content', container);
  if (!buttons.length || !panes.length) return;

  // ARIA-wiring (robust selv om HTML ikke er oppdatert)
  const list = $('.tabs-navigation[role="tablist"]', container) || $('.tabs-navigation', container);
  if (list) list.setAttribute('role','tablist');
  buttons.forEach((b,i)=>{
    const id = b.id || `tab-${i}`;
    const tabId = b.dataset.tab || panes[i]?.id || `panel-${i}`;
    b.id = id;
    b.setAttribute('role','tab');
    b.setAttribute('aria-controls', tabId);
    b.setAttribute('aria-selected', b.classList.contains('active') ? 'true' : 'false');
    b.tabIndex = b.classList.contains('active') ? 0 : -1;

    const panel = document.getElementById(tabId) || panes[i];
    if (panel){
      panel.id = tabId;
      panel.setAttribute('role','tabpanel');
      panel.setAttribute('aria-labelledby', id);
      panel.hidden = !b.classList.contains('active');
      panel.classList.toggle('active', !panel.hidden);
    }
  });

  const header = $('header');
  const headerOffset = (header ? header.offsetHeight : 0) + 16;

  function activate(btn, focus=true){
    const id = btn.getAttribute('aria-controls');
    buttons.forEach(b=>{
      const sel = b === btn;
      b.classList.toggle('active', sel);
      b.setAttribute('aria-selected', sel ? 'true':'false');
      b.tabIndex = sel ? 0 : -1;
      const pid = b.getAttribute('aria-controls');
      const p = document.getElementById(pid);
      if (p){ p.hidden = !sel; p.classList.toggle('active', sel); }
    });
    // restart reveal i aktiv fane
    $$('#'+id+' [data-anim]').forEach(el=>{ el.style.transitionDelay=''; el.classList.remove('reveal-in'); el.classList.add('reveal-base'); });
    // scroll til pane-topp
    const y = document.getElementById(id).getBoundingClientRect().top + window.pageYOffset - headerOffset;
    window.scrollTo({ top:y, behavior:'smooth' });
    if (focus) btn.focus();
  }

  buttons.forEach((b, i)=>{
    on(b,'click', ()=> activate(b, false));
    on(b,'keydown', e=>{
      if (!['ArrowLeft','ArrowRight','ArrowUp','ArrowDown','Home','End'].includes(e.key)) return;
      e.preventDefault();
      const idx = buttons.indexOf(b);
      let ni = idx;
      if (e.key==='ArrowRight'||e.key==='ArrowDown') ni = (idx+1)%buttons.length;
      if (e.key==='ArrowLeft'||e.key==='ArrowUp')    ni = (idx-1+buttons.length)%buttons.length;
      if (e.key==='Home') ni = 0;
      if (e.key==='End')  ni = buttons.length-1;
      activate(buttons[ni]);
    });
  });

  // hash deep-link (#paneId)
  const initial = (location.hash||'').replace('#','');
  if (initial && document.getElementById(initial)) {
    const btn = buttons.find(b=> b.getAttribute('aria-controls')===initial) || null;
    if (btn) activate(btn, false);
  }
}

/* ================= ENHANCED MOBILE MENU V2 (som før) ================= */
function initEnhancedMobileMenuV2() {
  const mobileMenuButton = $('.mobile-menu-button');
  const navLinks = $('.nav-links');
  const body = document.body;
  if (!mobileMenuButton || !navLinks) return;
  if (mobileMenuButton.dataset.menuInit === '1') return;
  mobileMenuButton.dataset.menuInit = '1';

  if (!navLinks.id) navLinks.id = 'primary-navigation';
  mobileMenuButton.setAttribute('aria-controls', navLinks.id);
  mobileMenuButton.setAttribute('aria-expanded', 'false');
  mobileMenuButton.setAttribute('aria-label', mobileMenuButton.getAttribute('aria-label') || 'Åpne meny');

  const toggle = (open) => {
    const isOpen = (typeof open === 'boolean') ? open : !navLinks.classList.contains('active');
    navLinks.classList.toggle('active', isOpen);
    mobileMenuButton.classList.toggle('active', isOpen);
    body.style.overflow = isOpen ? 'hidden' : '';
    mobileMenuButton.setAttribute('aria-expanded', String(isOpen));
  };

  on(mobileMenuButton,'click', e=>{ e.preventDefault(); e.stopPropagation(); toggle(); });
  $$('.nav-links a').forEach(a=>{
    on(a,'click', e=>{
      const href = a.getAttribute('href')||'';
      if (href.startsWith('#')){ e.preventDefault(); const t = $(href); if (t) t.scrollIntoView({ behavior:'smooth', block:'start' }); }
      toggle(false);
    });
  });
  on(document,'click', e=>{ if (navLinks.classList.contains('active') && !navLinks.contains(e.target) && !mobileMenuButton.contains(e.target)) toggle(false); });
  on(document,'keydown', e=>{ if (e.key==='Escape' && navLinks.classList.contains('active')) toggle(false); });
}

/* ================= MOBILE HELPERS (ingen meny her) ================= */
function isMobile(){ return window.innerWidth <= 768 || /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent); }
function initMobileTabs() {
  if (!isMobile()) return;
  const nav = $('.tabs-navigation'); if (!nav) return;
  nav.style.overflowX = 'auto'; nav.style.webkitOverflowScrolling = 'touch';
  let down=false, startX=0, left=0;
  on(nav,'touchstart', e=>{ down=true; startX = e.touches[0].pageX - nav.offsetLeft; left = nav.scrollLeft; });
  on(nav,'touchmove', e=>{ if (!down) return; e.preventDefault(); const x = e.touches[0].pageX - nav.offsetLeft; nav.scrollLeft = left - ((x - startX)*2); }, { passive:false });
  on(nav,'touchend', ()=> down=false);
  function scrollToActive(){ const a = $('.tab-button.active', nav); if (a) a.scrollIntoView({ behavior:'smooth', inline:'center' }); }
  $$('.tab-button', nav).forEach(b=> on(b,'click', ()=> setTimeout(scrollToActive, 100)));
}
function initTouchFriendlyHovers() {
  if (!isMobile()) return;
  $$('.card, .cta-button, .gallery-item, .service-item').forEach(el=>{
    on(el,'touchstart', ()=> el.classList.add('touch-active'));
    on(el,'touchend',   ()=> setTimeout(()=> el.classList.remove('touch-active'), 150));
  });
  const s = document.createElement('style');
  s.textContent = `
    .touch-active.card{ transform:translateY(-5px) scale(1.02)!important; box-shadow:0 15px 40px rgba(0,0,0,.15)!important }
    .touch-active.cta-button{ transform:translateY(-2px) scale(1.02)!important; box-shadow:0 12px 35px rgba(0,0,0,.25)!important }
    .touch-active.gallery-item{ transform:translateY(-3px)!important }
    .touch-active.service-item{ transform:translateY(-3px)!important; background:rgba(0,0,0,.03)!important }
  `;
  document.head.appendChild(s);
}
function initMobilePerformance() {
  if (!isMobile()) return;
  const io = new IntersectionObserver((entries)=>{
    entries.forEach(e=>{
      if (!e.isIntersecting) return;
      const img = e.target; img.style.transition='opacity .3s ease'; img.style.opacity='0';
      const tmp = new Image(); tmp.onload = ()=> img.style.opacity='1'; tmp.src = img.src;
      io.unobserve(img);
    });
  });
  $$('img[src]').forEach(img=> io.observe(img));
}
function initMobileAccessibility() {
  if (!isMobile()) return;
  $$('a, button, input, select, textarea').forEach(el=>{
    const cs = getComputedStyle(el);
    if (parseInt(cs.height) < 44){ el.style.minHeight='44px'; el.style.display='flex'; el.style.alignItems='center'; el.style.justifyContent='center'; }
    if (parseInt(cs.width)  < 44){ el.style.minWidth='44px'; }
  });
  const style = document.createElement('style');
  style.textContent = `@media (max-width:768px){ *:focus{ outline:3px solid ${getVar('--c-gold-1','#0b5fff')}!important; outline-offset:2px!important } }`;
  document.head.appendChild(style);
}
function initOrientationHandling() {
  on(window,'orientationchange', ()=>{
    setTimeout(()=>{
      const vh = window.innerHeight * 0.01;
      document.documentElement.style.setProperty('--vh', `${vh}px`);
      const nav = $('.tabs-navigation');
      if (nav && isMobile()){ const a = $('.tab-button.active', nav); if (a){ setTimeout(()=> a.scrollIntoView({ behavior:'smooth', inline:'center' }), 300); } }
    }, 100);
  });
}
function initAllMobileFeatures() {
  if (!isMobile()) return;
  initMobileTabs();
  initTouchFriendlyHovers();
  initMobilePerformance();
  initMobileAccessibility();
  initOrientationHandling();
  const vh = window.innerHeight * 0.01; document.documentElement.style.setProperty('--vh', `${vh}px`);
}

/* ================= PWA PROMPT ================= */
function initPWAFeatures() {
  let deferred;
  on(window,'beforeinstallprompt', e=>{
    e.preventDefault(); deferred = e;
    if (!isMobile()) return;
    const { c1, c2 } = theme();
    const btn = document.createElement('button');
    btn.textContent = 'Installer app';
    btn.style.cssText = `
      position:fixed; bottom:20px; right:20px; background:linear-gradient(135deg, ${c1}, ${c2});
      color:#fff; border:none; padding:12px 20px; border-radius:25px; font-weight:600;
      box-shadow:0 4px 15px rgba(0,0,0,.2); z-index:1000; cursor:pointer;
    `;
    on(btn,'click', async ()=>{
      if (!deferred) return;
      deferred.prompt(); await deferred.userChoice; deferred=null; btn.remove();
    });
    document.body.appendChild(btn);
    setTimeout(()=> btn.remove(), 10000);
  });
}
document.addEventListener('DOMContentLoaded', initPWAFeatures);

/* ================= ADVANCED (beholder, men ryddig) ================= */
function initAdvancedFeatures() {
  initAdvancedParallax();
  initAdvancedScrollAnimations();
  initTypewriterEffect();
  initParticleSystem();
  initAdvancedImageEffects();
  initTextRevealAnimation();
  initButtonLoadingStates();
  initScrollProgress();
  initAdvancedFormValidation();
  const { c1, c2 } = theme();
  const s = document.createElement('style');
  s.textContent = `
    .field-valid{ border-color:#48bb78!important; box-shadow:0 0 0 3px rgba(72,187,120,.1)!important }
    .field-invalid{ border-color:#e53e3e!important; box-shadow:0 0 0 3px rgba(229,62,62,.1)!important }
    .custom-cursor{ display:none!important }
    .progress-bar{ height:4px; background:linear-gradient(90deg, ${c1}, ${c2}); border-radius:2px; transition:width 1.5s cubic-bezier(.25,.46,.45,.94) }
  `;
  document.head.appendChild(s);
}
setTimeout(()=>{ try{ initAdvancedFeatures(); }catch{} }, 500);

/* ====== Resten av “advanced” helperne (uendret logikk) ====== */
function initAdvancedParallax(){ /* same as before but optional */ }
function initAdvancedScrollAnimations(){ const els=$$('[data-animation]'); if(!els.length) return;
  const io=new IntersectionObserver((entries)=>{ entries.forEach(en=>{ if(en.isIntersecting){ const el=en.target; const t=el.dataset.animation; const d=el.dataset.delay||0; setTimeout(()=> el.classList.add(`animate-${t}`), d); io.unobserve(el); } }); }, { threshold:0.1, rootMargin:'0px 0px -100px 0px' });
  els.forEach(el=> io.observe(el));
}
function initTypewriterEffect(){ $$('.typewriter').forEach(el=>{ const text=el.textContent; el.textContent=''; el.style.borderRight=`2px solid ${getVar('--c-gold-1','#0b5fff')}`; let i=0; const t=setInterval(()=>{ if(i<text.length){ el.textContent += text.charAt(i++);} else { clearInterval(t); setTimeout(()=> el.style.borderRight='none', 800);} }, 100); }); }
function initParticleSystem(){ const { c1 }=theme(); const wrap=document.createElement('div'); wrap.className='particle-container'; wrap.style.cssText='position:fixed; inset:0; pointer-events:none; z-index:1; overflow:hidden'; document.body.appendChild(wrap);
  function add(){ const p=document.createElement('div'); const size=Math.random()*4+2; const x=Math.random()*innerWidth; const dur=Math.random()*20+10;
    p.style.cssText=`position:absolute; width:${size}px; height:${size}px; background:${c1}33; border-radius:50%; left:${x}px; top:100vh; animation:floatUp ${dur}s linear infinite`;
    wrap.appendChild(p); setTimeout(()=> p.remove(), dur*1000);
  } setInterval(add, 2000);
  const s=document.createElement('style'); s.textContent='@keyframes floatUp{0%{transform:translateY(0) rotate(0); opacity:0}10%{opacity:1}90%{opacity:1}100%{transform:translateY(-100vh) rotate(360deg); opacity:0}}'; document.head.appendChild(s);
}
function initAdvancedImageEffects(){ $$('.gallery-item img, .image-content img').forEach(img=>{ on(img,'mouseenter',()=>{ img.style.filter='brightness(1.06) contrast(1.06) saturate(1.08)'; img.style.transform='scale(1.03)'; });
  on(img,'mouseleave',()=>{ img.style.filter='none'; img.style.transform='none'; }); }); }
function initTextRevealAnimation(){ const els=$$('.text-reveal'); if(!els.length) return; const io=new IntersectionObserver(es=>{ es.forEach(en=>{ if(en.isIntersecting){ en.target.classList.add('revealed'); io.unobserve(en.target); } }); }); els.forEach(el=> io.observe(el)); }
function initButtonLoadingStates(){ $$('.cta-button, .navbar-cta').forEach(b=>{ on(b,'click',()=>{ if(b.classList.contains('loading')) return; const t=b.innerHTML; b.classList.add('loading'); b.innerHTML='<span class="loading-spinner"></span> Laster...'; setTimeout(()=>{ b.classList.remove('loading'); b.innerHTML=t; }, 2000); }); }); }
function initScrollProgress(){ const els=$$('.progress-bar'); if(!els.length) return; const io=new IntersectionObserver(es=>{ es.forEach(en=>{ if(en.isIntersecting){ const el=en.target; const p=el.dataset.progress||100; el.style.width='0%'; setTimeout(()=> el.style.width=p+'%', 200); io.unobserve(el);} }); }); els.forEach(el=> io.observe(el)); }
function initAdvancedFormValidation(){ const inputs=$$('input, textarea, select'); function validate(f){ const v=f.value.trim(); const t=f.type; const n=f.name; const errEl=f.parentNode.querySelector('.field-error'); if(errEl) errEl.remove(); f.classList.remove('field-valid','field-invalid'); let ok=true, msg='';
  if (f.hasAttribute('required') && !v){ ok=false; msg='Dette feltet er påkrevd'; }
  else if (t==='email' && v){ const re=/^[^\s@]+@[^\s@]+\.[^\s@]+$/; if(!re.test(v)){ ok=false; msg='Ugyldig e-postadresse'; } }
  else if (n==='phone' && v){ const re=/^[\+]?[0-9\s\-\(\)]{8,}$/; if(!re.test(v)){ ok=false; msg='Ugyldig telefonnummer'; } }
  if (v && ok) f.classList.add('field-valid'); else if (!ok){ f.classList.add('field-invalid'); const e=document.createElement('div'); e.className='field-error'; e.textContent=msg; e.style.cssText='color:#e53e3e; font-size:.8rem; margin-top:.25rem; animation:fadeInUp .3s ease'; f.parentNode.appendChild(e); } }
  inputs.forEach(i=>{ on(i,'input', ()=>validate(i)); on(i,'blur', ()=>validate(i)); });
}

/* ================= Debounce/Throttle ================= */
function debounce(fn, wait){ let t; return (...a)=>{ clearTimeout(t); t=setTimeout(()=> fn(...a), wait); }; }
function throttle(fn, limit){ let inT=false; return function(){ if(!inT){ fn.apply(this, arguments); inT=true; setTimeout(()=> inT=false, limit); } } }

/* ================= Minimal scroll state class ================= */
(function(){ function onScroll(){ document.body.classList.toggle('scrolled', window.scrollY > 4); } window.addEventListener('scroll', onScroll, { passive:true }); onScroll(); })();
/* === Reveal compat for index.html (safe) === */
(function bridgeRevealCompat(){
  // data-animate="..." -> data-anim="..." (skip .section-title)
  document.querySelectorAll('[data-animate]:not(.section-title)').forEach(el => {
    if (!el.hasAttribute('data-anim')) {
      el.setAttribute('data-anim', el.getAttribute('data-animate') || 'fade-up');
    }
  });
  // .animate-on-scroll -> data-anim="fade-up" (skip .section-title)
  document.querySelectorAll('.animate-on-scroll:not(.section-title)').forEach(el => {
    if (!el.hasAttribute('data-anim')) el.setAttribute('data-anim', 'fade-up');
  });

  // Behandle .section-title skånsomt (ingen blur)
  document.querySelectorAll('.section-title').forEach(el => {
    // vil du ha animasjon? bruk ‘fade-up+soft+noblur’; ellers ‘none’
    el.setAttribute('data-anim', 'fade-up+soft+noblur');
  });
})();
/* ================= COUNTERS (experience-number) ================= */
function initCounters() {
  const els = $$('.experience-number');
  if (!els.length) return;

  const io = new IntersectionObserver((entries, obs) => {
    entries.forEach(en => {
      if (!en.isIntersecting) return;
      const el = en.target;

      // hent målverdi + suffix
      const raw = el.textContent.trim();
      const hasPlus = raw.includes('+');
      const hasPct  = raw.includes('%');
      const match = raw.match(/\d+(\.\d+)?/);
      const target = match ? parseFloat(match[0]) : 0;

      const dur = 2000; // ms
      const start = performance.now();

      function tick(t) {
        const p = Math.min((t - start) / dur, 1);
        const val = Math.floor(target * p);
        el.textContent = val + (hasPct ? '%' : '') + (hasPlus ? '+' : '');
        if (p < 1) requestAnimationFrame(tick);
      }
      requestAnimationFrame(tick);

      obs.unobserve(el);
    });
  }, { threshold: 0.25 });

  els.forEach(el => io.observe(el));
}
initCounters();
/* === Make section titles crisp === */
(function crispSectionTitles(){
  document.querySelectorAll('.section-title').forEach(el => {
    const anim = (el.getAttribute('data-anim') || 'fade-up').toLowerCase();
    if (!anim.includes('noblur')) el.setAttribute('data-anim', anim + '+noblur+soft');
  });
})();
function initGalleryLightbox() {
  [...$$('.gallery-item img'), ...$$('.about-image img'), ...$$('.philosophy-image img')].forEach(img=>{
    on(img, 'click', ()=> createLightbox(img.src, img.alt));
  });
}
