// ============================================
// SCROLL HANDLER — Reload vs Navigasi Baru
// ============================================
if ('scrollRestoration' in history) {
  history.scrollRestoration = 'manual';
}

function detectNavigation() {
  const navEntry = performance.getEntriesByType && performance.getEntriesByType("navigation")[0];
  if (navEntry && navEntry.type) return navEntry.type;
  if (performance.navigation) {
    const t = performance.navigation.type;
    if (t === 1) return "reload";
    if (t === 2) return "back_forward";
    return "navigate";
  }
  return "navigate";
}

function forceScrollTop() {
  window.scrollTo(0, 0);
  document.documentElement.scrollTop = 0;
  document.body.scrollTop = 0;
}

function scrollToHash(hash) {
  const target = document.querySelector(hash);
  if (!target) return false;
  const navH = document.querySelector('.navbar-wrap')?.offsetHeight || 70;
  const y = target.getBoundingClientRect().top + window.pageYOffset - navH - 20;
  window.scrollTo({ top: y, behavior: 'smooth' });
  return true;
}

(function handleInitialScroll() {
  const navType = detectNavigation();
  const hasHash = window.location.hash && window.location.hash.length > 1;

  if (navType === "reload") {
    if (hasHash) {
      history.replaceState(null, '', window.location.pathname + window.location.search);
    }
    forceScrollTop();
    document.addEventListener('DOMContentLoaded', forceScrollTop);
    window.addEventListener('load', forceScrollTop);
    [0, 50, 150, 300].forEach(t => setTimeout(forceScrollTop, t));
    requestAnimationFrame(() => {
      forceScrollTop();
      requestAnimationFrame(forceScrollTop);
    });
    window.addEventListener('beforeunload', forceScrollTop);
    return;
  }

  if (hasHash) {
    document.addEventListener('DOMContentLoaded', () => scrollToHash(window.location.hash));
    window.addEventListener('load', () => scrollToHash(window.location.hash));
    [100, 300, 600].forEach(t => setTimeout(() => scrollToHash(window.location.hash), t));
    return;
  }

  forceScrollTop();
  document.addEventListener('DOMContentLoaded', forceScrollTop);
  window.addEventListener('load', forceScrollTop);
})();

document.addEventListener('keydown', (e) => {
  if (e.key === 'F5' || ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'r')) {
    forceScrollTop();
  }
});

// ============================================
// THEME TOGGLE
// ============================================
const themeToggle = document.getElementById('themeToggle');
const themeIcon = themeToggle ? themeToggle.querySelector('i') : null;

const savedTheme = localStorage.getItem('theme');
const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

function updateThemeColor(isDark) {
  const m = document.querySelector('meta[name="theme-color"]');
  if (m) m.content = isDark ? '#0d1520' : '#b8924a';
}

if (savedTheme === 'dark' || (!savedTheme && prefersDark)) {
  document.body.classList.add('dark');
  if (themeIcon) themeIcon.classList.replace('fa-moon', 'fa-sun');
  updateThemeColor(true);
}

if (themeToggle && themeIcon) {
  themeToggle.addEventListener('click', () => {
    document.body.classList.toggle('dark');
    const isDark = document.body.classList.contains('dark');
    themeIcon.classList.toggle('fa-moon', !isDark);
    themeIcon.classList.toggle('fa-sun', isDark);
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
    updateThemeColor(isDark);
  });
}

// ============================================
// MOBILE MENU
// ============================================
const menuToggle = document.getElementById('menuToggle');
const navLinks = document.getElementById('navLinks');
const menuOverlay = document.getElementById('menuOverlay');
const menuIcon = menuToggle ? menuToggle.querySelector('i') : null;

function openMenu() {
  if (!navLinks || !menuOverlay || !menuIcon) return;
  navLinks.classList.add('active');
  menuOverlay.classList.add('active');
  menuIcon.classList.replace('fa-bars', 'fa-times');
  document.body.style.overflow = 'hidden';
}

function closeMenu() {
  if (!navLinks || !menuOverlay || !menuIcon) return;
  navLinks.classList.remove('active');
  menuOverlay.classList.remove('active');
  menuIcon.classList.replace('fa-times', 'fa-bars');
  document.body.style.overflow = '';
}

if (menuToggle) {
  menuToggle.addEventListener('click', () => {
    navLinks.classList.contains('active') ? closeMenu() : openMenu();
  });
}

if (menuOverlay) menuOverlay.addEventListener('click', closeMenu);
document.querySelectorAll('.nav-links a').forEach(l => l.addEventListener('click', closeMenu));

window.addEventListener('resize', () => {
  if (window.innerWidth > 900) closeMenu();
});

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') closeMenu();
});

// ============================================
// SCROLL SPY
// ============================================
const sections = document.querySelectorAll('section[id]');
const navAnchors = document.querySelectorAll('.nav-link');

function updateActiveLink() {
  const scrollPos = window.scrollY + 120;
  let current = '';
  sections.forEach(sec => {
    if (scrollPos >= sec.offsetTop) current = sec.id;
  });
  navAnchors.forEach(a => {
    const href = a.getAttribute('href');
    a.classList.toggle('active', href === `#${current}` || href.endsWith(`#${current}`));
  });
}

if (sections.length) {
  window.addEventListener('scroll', updateActiveLink, { passive: true });
  updateActiveLink();
}

// ============================================
// BACK TO TOP
// ============================================
const backToTop = document.getElementById('backToTop');
if (backToTop) {
  window.addEventListener('scroll', () => {
    backToTop.classList.toggle('show', window.scrollY > 500);
  }, { passive: true });

  backToTop.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

// ============================================
// REVEAL ON SCROLL
// ============================================
if ('IntersectionObserver' in window) {
  const revealEls = document.querySelectorAll('.about-card, .portfolio-card, .timeline-item, .section-head');
  revealEls.forEach(el => el.classList.add('reveal'));

  const io = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('reveal-show');
        io.unobserve(e.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

  revealEls.forEach(el => io.observe(el));
}

// ============================================
// TAHUN
// ============================================
const yearEl = document.getElementById('year');
if (yearEl) yearEl.textContent = new Date().getFullYear();

// ============================================
// KIRIM PESAN
// ============================================
function kirimPesan(e) {
  e.preventDefault();
  const btn = e.target.querySelector('button[type="submit"]');
  const original = btn.innerHTML;
  btn.innerHTML = '<i class="fas fa-check"></i> Terkirim!';
  btn.style.background = '#10b981';
  setTimeout(() => {
    btn.innerHTML = original;
    btn.style.background = '';
    e.target.reset();
    alert('Terima kasih! Pesanmu sudah terkirim 🚀');
  }, 800);
  return false;
}

// ============================================
// LOAD PROJECT DETAIL
// ============================================
function loadProjectDetail() {
  const container = document.getElementById('projectContent');
  if (!container) return;

  const params = new URLSearchParams(window.location.search);
  const projectId = params.get('id');

  if (!projectId || typeof projectsData === 'undefined' || !projectsData[projectId]) {
    container.innerHTML = `
      <div class="empty-state">
        <div class="empty-icon"><i class="fas fa-search"></i></div>
        <h2>Project Tidak Ditemukan</h2>
        <p>Maaf, project yang kamu cari belum tersedia.</p>
        <a href="index.html#portofolio" class="btn btn-primary">
          <i class="fas fa-arrow-left"></i> Kembali ke Portofolio
        </a>
      </div>
    `;
    return;
  }

  const p = projectsData[projectId];

  const tagsHTML = p.tags.map(t => `<span class="tag-pill">${t}</span>`).join('');
  const featuresHTML = p.features.map(f => `<li><i class="fas fa-check"></i> ${f}</li>`).join('');
  const techHTML = p.tech.map(t => `
    <div class="tech-item">
      <span class="tech-name">${t.name}</span>
      <span class="tech-desc">${t.desc}</span>
    </div>
  `).join('');

  container.innerHTML = `
    <div class="project-header">
      <span class="project-category">${p.category}</span>
      <h1 class="project-title">${p.title}</h1>
      <div class="project-tags">${tagsHTML}</div>
    </div>

    <div class="project-hero">
      <img src="${p.image}" alt="${p.title}" />
    </div>

    <div class="project-body">
      <section class="project-section">
        <h2><i class="fas fa-info-circle"></i> Deskripsi</h2>
        <p>${p.description}</p>
      </section>

      <section class="project-section">
        <h2><i class="fas fa-star"></i> Fitur Utama</h2>
        <ul class="feature-list">${featuresHTML}</ul>
      </section>

      <section class="project-section">
        <h2><i class="fas fa-layer-group"></i> Teknologi</h2>
        <div class="tech-grid">${techHTML}</div>
      </section>

      <section class="project-section">
        <h2><i class="fas fa-trophy"></i> Hasil Akhir</h2>
        <p>${p.result}</p>
      </section>

      <div class="project-actions">
        <a href="${p.demoUrl}" class="btn btn-primary" target="_blank" rel="noopener">
          <i class="fas fa-external-link-alt"></i> Live Demo
        </a>
        <a href="${p.codeUrl}" class="btn btn-ghost" target="_blank" rel="noopener">
          <i class="fab fa-github"></i> Source Code
        </a>
      </div>
    </div>
  `;

  document.title = `${p.title} | Texas Bristagi`;
}

document.addEventListener('DOMContentLoaded', loadProjectDetail);