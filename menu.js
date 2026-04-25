const allFilter = document.getElementById("allFilter");
const checkboxes = document.querySelectorAll(".category-filter");

let products = [];
let activeCategories = [];
let activePrice = "all";

const container = document.getElementById("products");

async function getProducts() {
        let response = await fetch("products.json")
        let products = await response.json()
        return products
}

function renderProducts(list) {
  container.innerHTML = "";

  list.forEach(product => {
    const card = document.createElement("div");
    card.classList.add("product-card");

card.innerHTML = `
  <img class="card-image" src="${product.image}" alt="${product.name}">

  <div class="card-body">
    <div class="card-top">
      <h3 class="card-title">${product.name}</h3>
      <p class="card-description">${product.description || ""}</p>
    </div>

    <div class="card-bottom">
      <span class="card-price">${product.price} ₴</span>
    </div>
  </div>

  <button class="card-btn"><i class="ti ti-shopping-cart"></i></button>
`;

    container.appendChild(card);
  });
}

const buttons = document.querySelectorAll(".filter-btn");

buttons.forEach(btn => {
  btn.addEventListener("click", () => {
    // зняти активний клас з усіх кнопок
    buttons.forEach(b => b.classList.remove("active"));

    // додати активний
    btn.classList.add("active");

    // змінити категорію
    activeCategory = btn.dataset.category;

    applyFilters();
  });
});

const priceSelect = document.getElementById("priceFilter");

priceSelect.addEventListener("change", () => {
  activePrice = priceSelect.value;
  applyFilters();
});

function applyFilters() {
  let filtered = products;

  // якщо вибрані категорії → фільтруємо
  if (activeCategories.length > 0) {
    filtered = filtered.filter(p =>
      activeCategories.includes(p.category)
    );
  }

  //якщо нічого не вибрано → показати всі
  else {
    filtered = products;
  }

  // фільтр по ціні
  if (activePrice !== "all") {
    if (activePrice === "0-50") {
      filtered = filtered.filter(p => p.price <= 50);
    }

    if (activePrice === "50-60") {
      filtered = filtered.filter(p => p.price > 50 && p.price <= 60);
    }

    if (activePrice === "60") {
      filtered = filtered.filter(p => p.price > 60);
    }
  }

  renderProducts(filtered);
}

allFilter.checked = true;

checkboxes.forEach(cb => {
  cb.addEventListener("change", () => {
    const value = cb.value;

    if (cb.checked) {
      activeCategories.push(value);
      allFilter.checked = false;
    } else {
      activeCategories = activeCategories.filter(c => c !== value);
      if (activeCategories.length === 0) {
        allFilter.checked = true;
      }
    }

    applyFilters();
  });
});

allFilter.addEventListener("change", () => {
  if (allFilter.checked) {
    activeCategories = [];
    checkboxes.forEach(cb => cb.checked = false);
  }
  applyFilters();
});

function loadProducts() {
  fetch("products.json")
    .then(res => res.json())
    .then(data => {
      products = data;
      applyFilters();
    })
    .catch(() => {
      container.innerHTML = "<p>Не вдалося завантажити товари.</p>";
    });
}

function addProductToCart(productId) {
  const product = products.find(p => p.id === productId);
  if (!product) return;

  addToCart({
    id: product.id,
    name: product.name,
    price: product.price,
    description: product.description
  });
}

document.addEventListener('DOMContentLoaded', () => {

loadProducts();

});