// отримати кошик
function getCart() {
  return JSON.parse(localStorage.getItem("cart")) || [];
}

// зберегти кошик
function saveCart(cart) {
  localStorage.setItem("cart", JSON.stringify(cart));
}

// додати товар
function addToCart(item) {
  let cart = getCart();

  const itemId = item.id || Date.now();

  // шукаємо чи вже є такий товар
  const existing = cart.find(p => p.id === itemId);

  if (existing) {
    existing.quantity += 1;
  } else {
    cart.push({
      id: itemId,
      name: item.name,
      price: item.price,
      description: item.description,
      quantity: 1
    });
  }

  saveCart(cart);

  alert("Додано в кошик 🧺");
}