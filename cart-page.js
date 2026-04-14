const container = document.getElementById("cartItems");

//Рендер кошика
function renderCart() {
  let cart = getCart();

  container.innerHTML = "";

  //якщо кошик пустий
  if (cart.length === 0) {
    container.innerHTML = "<p>Кошик порожній 🧺</p>";
    document.getElementById("total").innerText = "";
    return;
  }

  let total = 0;

  cart.forEach(item => {
    const div = document.createElement("div");

    div.innerHTML = `
      <h3>${item.name}</h3>
      <p>${item.description}</p>

      <div>
        <button onclick="decrease(${item.id})">-</button>
        <span>${item.quantity}</span>
        <button onclick="increase(${item.id})">+</button>
      </div>

      <p>${item.price} × ${item.quantity} = ${item.price * item.quantity} грн</p>

      <button onclick="removeItem(${item.id})">Видалити</button>
    `;

    container.appendChild(div);

    total += item.price * item.quantity;
  });

  document.getElementById("total").innerText =
    "Загальна сума: " + total + " грн";
}

//Видалення товару
function removeItem(id) {
  let cart = getCart();

  cart = cart.filter(item => item.id !== id);

  saveCart(cart);
  renderCart();
}

//Збільшити кількість
function increase(id) {
  let cart = getCart();

  const item = cart.find(p => p.id === id);
  if (!item) return;

  item.quantity++;

  saveCart(cart);
  renderCart();
}

//Зменшити кількість
function decrease(id) {
  let cart = getCart();

  const item = cart.find(p => p.id === id);
  if (!item) return;

  if (item.quantity > 1) {
    item.quantity--;
  } else {
    cart = cart.filter(p => p.id !== id);
  }

  saveCart(cart);
  renderCart();
}

//Запуск
renderCart();