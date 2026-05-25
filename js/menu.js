const allFilter = document.getElementById("allFilter");
const checkboxes = document.querySelectorAll(".category-filter");
const container = document.getElementById("products");
const priceSelect = document.getElementById("priceFilter");

let products = []; // Тут будуть зберігатися всі товари з JSON
let activeCategories = [];
let activePrice = "all";

// 1. Завантаження товарів
function loadProducts() {
    fetch("products.json")
        .then(res => res.json())
        .then(data => {
            products = data;
            applyFilters();
        })
        .catch(err => {
            console.error("Помилка завантаження:", err);
            container.innerHTML = "<p>Не вдалося завантажити товари. Перевірте products.json</p>";
        });
}

// 2. Рендер карток
function renderProducts(list) {
    container.innerHTML = "";

    if (list.length === 0) {
        container.innerHTML = "<p>Товарів не знайдено 🔍</p>";
        return;
    }

    list.forEach(product => {
        const card = document.createElement("div");
        card.className = "card";

        // Додаємо onclick="addProductToCart(${product.id})" на кнопку
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
            <button class="card-btn" onclick="addProductToCart(${product.id})">
                <i class="ti ti-shopping-cart"></i>
            </button>
        `;

        container.appendChild(card);
    });
}

// 3. Функція додавання в кошик (викликає функцію з cart.js)
function addProductToCart(productId) {
    // Шукаємо об'єкт товару в нашому масиві products за його ID
    const product = products.find(p => p.id === productId);
    
    if (product) {
        // Викликаємо addToCart, яка прописана у файлі cart.js
        addToCart({
            id: product.id,
            name: product.name,
            price: product.price,
            description: product.description,
            image: product.image
        });
    } else {
        console.error("Товар не знайдено:", productId);
    }
}

// 4. Логіка фільтрації
function applyFilters() {
    let filtered = products;

    // Фільтр по категоріях
    if (activeCategories.length > 0) {
        filtered = filtered.filter(p => activeCategories.includes(p.category));
    }

    // Фільтр по ціні
    if (activePrice !== "all") {
        if (activePrice === "0-50") {
            filtered = filtered.filter(p => p.price <= 50);
        } else if (activePrice === "50-60") {
            filtered = filtered.filter(p => p.price > 50 && p.price <= 60);
        } else if (activePrice === "60") {
            filtered = filtered.filter(p => p.price > 60);
        }
    }

    renderProducts(filtered);
}

// 5. Обробники подій для фільтрів
priceSelect.addEventListener("change", () => {
    activePrice = priceSelect.value;
    applyFilters();
});

checkboxes.forEach(cb => {
    cb.addEventListener("change", () => {
        if (cb.checked) {
            activeCategories.push(cb.value);
            allFilter.checked = false;
        } else {
            activeCategories = activeCategories.filter(c => c !== cb.value);
            if (activeCategories.length === 0) allFilter.checked = true;
        }
        applyFilters();
    });
});

allFilter.addEventListener("change", () => {
    if (allFilter.checked) {
        activeCategories = [];
        checkboxes.forEach(cb => cb.checked = false);
        applyFilters();
    }
});

// Запуск при завантаженні сторінки
document.addEventListener('DOMContentLoaded', loadProducts);