// cart.js - shared cart logic used by index.html and order.html

// expose cart and helper functions to window so order.js/script.js can use them
window.cart = JSON.parse(localStorage.getItem("brewCart")) || [];

/**
 * saveCart - persist cart to localStorage
 */
function saveCart() {
  localStorage.setItem("brewCart", JSON.stringify(window.cart));
}

/**
 * addToCart(name, price, qty = 1)
 * adds item to cart (increase qty if exists)
 */
function addToCart(name, price, qty = 1) {
  const existing = window.cart.find(i => i.name === name);
  if (existing) existing.qty += qty;
  else window.cart.push({ name, price: Number(price), qty });
  saveCart();
  updateCartCount();
}

/**
 * updateCartCount
 * updates any element with id 'cart-count' to reflect sum qty
 */
function updateCartCount() {
  const countEl = document.getElementById("cart-count");
  const totalQty = window.cart.reduce((s, it) => s + (it.qty || 0), 0);
  if (countEl) countEl.textContent = totalQty;
  return totalQty;
}

// attach add button listeners on DOMContentLoaded for elements with .add-btn
document.addEventListener("DOMContentLoaded", () => {
  // delegate add-btns present on page
  document.querySelectorAll(".add-btn").forEach(btn => {
    btn.addEventListener("click", (e) => {
      const item = btn.closest(".item");
      if (!item) return;
      const name = item.dataset.name || item.querySelector("h3")?.innerText?.trim();
      const price = item.dataset.price || item.querySelector(".price")?.innerText?.replace(/[^0-9]/g,'') || 0;
      addToCart(name, price, 1);
      // small visual confirmation
      btn.animate([{ transform: 'scale(1)' }, { transform: 'scale(1.06)' }, { transform: 'scale(1)' }], { duration: 250 });
    });
  });

  // initial count update
  updateCartCount();
});
