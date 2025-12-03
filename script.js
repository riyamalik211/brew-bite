// script.js - homepage helpers (mobile menu already handled)
const menuToggle = document.getElementById('menu-toggle');
const navLinks = document.getElementById('nav-links');
if (menuToggle) {
  menuToggle.addEventListener('click', () => {
    navLinks.classList.toggle('show');
  });
}

// smooth anchor scroll for nav links
document.querySelectorAll('.nav-links a[href^="#"]').forEach(a => {
  a.addEventListener('click', function(e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute('href'));
    if (!target) return;
    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    // close nav on mobile
    if (navLinks.classList.contains('show')) navLinks.classList.remove('show');
  });
});

// optional: show a small toast on add (non-blocking)
function showToast(message) {
  let toast = document.createElement('div');
  toast.textContent = message;
  toast.style.position = 'fixed';
  toast.style.bottom = '90px';
  toast.style.right = '24px';
  toast.style.background = 'rgba(75,44,32,0.95)';
  toast.style.color = '#fff';
  toast.style.padding = '10px 14px';
  toast.style.borderRadius = '10px';
  toast.style.boxShadow = '0 6px 18px rgba(0,0,0,0.3)';
  toast.style.zIndex = 9999;
  document.body.appendChild(toast);
  setTimeout(() => { toast.style.opacity = '0'; }, 1200);
  setTimeout(() => toast.remove(), 1500);
}

// listen for add button clicks to show toast (uses cart.js addToCart)
document.addEventListener('click', (e) => {
  if (e.target && e.target.classList.contains('add-btn')) {
    const el = e.target.closest('.item');
    const name = el?.dataset.name || el?.querySelector('h3')?.innerText;
    if (name) showToast(`${name} added to cart`);
  }
});
