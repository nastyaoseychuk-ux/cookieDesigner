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

  // шукаємо чи вже є такий товар
  const existing = cart.find(p =>
    p.name === item.name && p.description === item.description
  );

  if (existing) {
    existing.quantity += 1;
  } else {
    cart.push({
      id: Date.now(),
      name: item.name,
      price: item.price,
      description: item.description,
      quantity: 1
    });
  }

  saveCart(cart);

  alert("Додано в кошик 🧺");
}