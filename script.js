// ====== Paksa Scroll ke Atas Setiap Refresh ======
// Matikan fitur "restore scroll position" bawaan browser
if ('scrollRestoration' in history) {
  history.scrollRestoration = 'manual';
}

// Scroll ke atas sebelum halaman dirender ulang
window.addEventListener('beforeunload', () => {
  window.scrollTo(0, 0);
});

// Scroll ke atas saat halaman selesai dimuat
window.addEventListener('load', () => {
  window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
});

// Fallback: pastikan langsung scroll ke atas saat DOM siap
document.addEventListener('DOMContentLoaded', () => {
  window.scrollTo(0, 0);
});

// ====== Toggle Tema (Dark/Light) ======
const themeToggle = document.getElementById('themeToggle');
const themeIcon = themeToggle.querySelector('i');

// Cek preferensi tersimpan / sistem
const savedTheme = localStorage.getItem('theme');
const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

if (savedTheme === 'dark' || (!savedTheme && prefersDark)) {
  document.body.classList.add('dark');
  themeIcon.classList.replace('fa-moon', 'fa-sun');
}

// Fungsi ubah tema
themeToggle.addEventListener('click', () => {
  document.body.classList.toggle('dark');
  const isDark = document.body.classList.contains('dark');

  // Ganti ikon
  themeIcon.classList.toggle('fa-moon', !isDark);
  themeIcon.classList.toggle('fa-sun', isDark);

  // Simpan preferensi
  localStorage.setItem('theme', isDark ? 'dark' : 'light');
});

// ====== Toggle Menu Mobile ======
const menuToggle = document.getElementById('menuToggle');
const navLinks = document.getElementById('navLinks');
const menuOverlay = document.getElementById('menuOverlay');
const menuIcon = menuToggle.querySelector('i');

function openMenu() {
  navLinks.classList.add('active');
  menuOverlay.classList.add('active');
  menuIcon.classList.replace('fa-bars', 'fa-times');
  document.body.style.overflow = 'hidden'; // cegah scroll di belakang
}

function closeMenu() {
  navLinks.classList.remove('active');
  menuOverlay.classList.remove('active');
  menuIcon.classList.replace('fa-times', 'fa-bars');
  document.body.style.overflow = '';
}

menuToggle.addEventListener('click', () => {
  if (navLinks.classList.contains('active')) {
    closeMenu();
  } else {
    openMenu();
  }
});

// Tutup menu saat overlay diklik
menuOverlay.addEventListener('click', closeMenu);

// Tutup menu saat link diklik
document.querySelectorAll('.nav-links a').forEach(link => {
  link.addEventListener('click', closeMenu);
});

// Tutup menu saat ukuran layar diperbesar
window.addEventListener('resize', () => {
  if (window.innerWidth > 768) {
    closeMenu();
  }
});

// Tutup menu dengan tombol ESC
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') closeMenu();
});

// ====== Tahun Otomatis di Footer ======
document.getElementById('year').textContent = new Date().getFullYear();

// ====== Simulasi Kirim Pesan ======
function kirimPesan(e) {
  e.preventDefault();
  alert('Terima kasih! Pesan kamu sudah terkirim 🚀');
  e.target.reset();
  return false;
}