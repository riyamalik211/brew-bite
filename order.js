// order.js - requires cart.js to be included first

// safe DOM refs
const cartTableBody = document.querySelector("#cart-table tbody");
const grandTotalEl = document.getElementById("grand-total");
const checkoutBtn = document.getElementById("checkout-btn");
const cartCountEls = document.querySelectorAll("#cart-count");
const popup = document.getElementById("popup");

// utility: rebuild cart table
function renderCartTable() {
  if (!cartTableBody) return;
  cartTableBody.innerHTML = "";
  let grand = 0;
  window.cart.forEach((it, idx) => {
    const rowTotal = (it.price * it.qty);
    grand += rowTotal;
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${it.name}</td>
      <td>₹${it.price}</td>
      <td>
        <button class="qty-btn" data-index="${idx}" data-delta="-1">-</button>
        <span class="qty">${it.qty}</span>
        <button class="qty-btn" data-index="${idx}" data-delta="1">+</button>
      </td>
      <td>₹${rowTotal}</td>
      <td><button class="remove-btn" data-index="${idx}">Remove</button></td>
    `;
    cartTableBody.appendChild(tr);
  });
  if (grandTotalEl) grandTotalEl.textContent = grand;
  // update cart-count elements too
  cartCountEls.forEach(el => el.textContent = window.cart.reduce((s,i)=>s+(i.qty||0),0));
}

// delegate clicks in cart table (qty and remove)
document.addEventListener('click', (e) => {
  const qtyBtn = e.target.closest('.qty-btn');
  if (qtyBtn) {
    const idx = Number(qtyBtn.dataset.index);
    const delta = Number(qtyBtn.dataset.delta);
    if (window.cart[idx]) {
      window.cart[idx].qty += delta;
      if (window.cart[idx].qty <= 0) window.cart.splice(idx, 1);
      saveCart();
      renderCartTable();
    }
  }
  const removeBtn = e.target.closest('.remove-btn');
  if (removeBtn) {
    const idx = Number(removeBtn.dataset.index);
    if (window.cart[idx]) {
      window.cart.splice(idx, 1);
      saveCart();
      renderCartTable();
    }
  }
});

// initial render
document.addEventListener('DOMContentLoaded', () => {
  renderCartTable();
  // wire add buttons on this page too (for products present here)
  document.querySelectorAll('.add-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const item = btn.closest('.item');
      const name = item?.dataset.name || item.querySelector('h3')?.innerText;
      const price = Number(item?.dataset.price || item.querySelector('.price')?.innerText.replace(/[^0-9]/g,''));
      addToCart(name, price, 1);
      renderCartTable();
    });
  });
});

// checkout popup
if (checkoutBtn) {
  checkoutBtn.addEventListener('click', () => {
    if (!window.cart.length) return alert('Your cart is empty!');
    if (popup) popup.style.display = 'flex';
  });
}

const closePopupBtn = document.getElementById('close-popup');
if (closePopupBtn) closePopupBtn.addEventListener('click', () => popup.style.display = 'none');

// place order
const placeOrderBtn = document.getElementById('place-order');
if (placeOrderBtn) {
  placeOrderBtn.addEventListener('click', () => {
    const name = document.getElementById('cust-name')?.value?.trim();
    const phone = document.getElementById('cust-phone')?.value?.trim();
    const address = document.getElementById('cust-address')?.value?.trim();
    // support textarea id used on dark theme
    const addressTA = document.getElementById('cust-address')?.value?.trim();

    if (!name || !phone || !addressTA) {
      return alert('Please fill all details to place the order.');
    }
    // simulate order success
    alert('🎉 Order placed! We will contact you shortly.');
    window.cart = [];
    saveCart();
    renderCartTable();
    if (popup) popup.style.display = 'none';
    updateCartCount();
  });
}

// search function
const searchInput = document.getElementById('search');
if (searchInput) {
  searchInput.addEventListener('input', () => {
    const q = searchInput.value.trim().toLowerCase();
    document.querySelectorAll('.menu-grid .item').forEach(card => {
      const name = (card.dataset.name || card.querySelector('h3')?.innerText || '').toLowerCase();
      card.style.display = name.includes(q) ? '' : 'none';
    });
  });
}

// filter buttons
document.querySelectorAll('.filter-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    const filter = btn.dataset.filter;
    document.querySelectorAll('.menu-grid .item').forEach(card => {
      if (filter === 'all' || card.classList.contains(filter)) card.style.display = '';
      else card.style.display = 'none';
    });
  });
});

// floating cart click scroll to cart table (if present)
const floating = document.getElementById('cart-link');
if (floating) floating.addEventListener('click', (e) => {
  e.preventDefault();
  const target = document.querySelector('#cart-table');
  if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
});

// mobile menu toggle (works on both pages)
const menuToggle = document.getElementById('menu-toggle');
const navLinks = document.getElementById('nav-links');
if (menuToggle && navLinks) {
  menuToggle.addEventListener('click', () => navLinks.classList.toggle('show'));
}
