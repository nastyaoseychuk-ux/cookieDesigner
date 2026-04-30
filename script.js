// ===== 1. ДАНІ (Конфігурація інгредієнтів) =====
const ingredients = {
    shapes: [
        { id: "round", name: "Кругле", price: 20, image: "images/shapes/round.png" },
        { id: "heart", name: "Серце", price: 30, image: "images/shapes/heart.png" },
        { id: "star", name: "Зірка", price: 30, image: "images/shapes/star.png" },
        { id: "square", name: "Квадрат", price: 25, image: "images/shapes/square.png" }
    ],
    doughs: [
        { id: "classic", name: "Класичне", price: 0, image: "images/dough/classic.png" },
        { id: "choco", name: "Шоколадне", price: 15, image: "images/dough/choco.png" }
    ],
    icings: [
        { id: "none", name: "Без глазурі", price: 0, image: "images/icings/none.png" },
        { id: "white", name: "Біла", price: 10, image: "images/icings/white.png" },
        { id: "pink", name: "Рожева", price: 15, image: "images/icings/pink.png" }
    ],
    toppings: [
        { id: "none", name: "Без посипки", price: 0, image: "images/toppings/none.png" },
        { id: "chocolate", name: "Шоколад", price: 10, image: "images/toppings/chocolate.png" },
        { id: "nuts", name: "Горіхи", price: 15, image: "images/toppings/nuts.png" }
    ]
};

// ===== 2. СТАН =====
let selected = {
    shape: null,
    dough: null,
    icing: null,
    topping: null
};

// ===== 3. ЛОГІКА ВИБОРУ =====
function selectOption(type, id) {
    selected[type] = id;
    updateUI();
}

// ===== 4. ОНОВЛЕННЯ ІНТЕРФЕЙСУ =====
function updateUI() {
    renderAllOptions(); 
    updatePreview();    
    updateSummary();    
}

// ===== 5. ПОПЕРЕДНІЙ ПЕРЕГЛЯД (Головне фото) =====
function updatePreview() {
    const previewImg = document.getElementById("base");
    if (!previewImg) return;

    // Картинка оновиться, тільки якщо вибрано ФОРМУ та ТІСТО
    if (selected.shape && selected.dough) {
        const icingId = selected.icing || "none";
        const toppingId = selected.topping || "none";
        
        // Файли мають назву: round-classic-white-none.png
        const fileName = `${selected.shape}-${selected.dough}-${icingId}-${toppingId}.png`;
        
        previewImg.src = `images/constructor/${fileName}`;
        previewImg.style.opacity = "1";
        previewImg.style.filter = "none";
    } else {
        previewImg.src = "images/constructor/placeholder.png";
        previewImg.style.opacity = "0.3";
        previewImg.style.filter = "grayscale(1)";
    }
}

// ===== 6. РЕНДЕР КАРТОК =====
function renderAllOptions() {
    renderGroup(ingredients.shapes, "shapes", "shape");
    renderGroup(ingredients.doughs, "doughs", "dough");
    renderGroup(ingredients.icings, "icings", "icing");
    renderGroup(ingredients.toppings, "toppings", "topping");
}

function renderGroup(items, containerId, type) {
    const container = document.getElementById(containerId);
    if (!container) return;
    container.innerHTML = "";

    items.forEach(item => {
        const card = document.createElement("div");
        const isActive = selected[type] === item.id;
        card.className = `card-custom ${isActive ? 'active' : ''}`;
        
        card.innerHTML = `
            ${isActive ? '<i class="ti ti-check check-icon"></i>' : ''}
            <img class="card-custom-img" src="${item.image}" alt="${item.name}">
            <div class="card-custom-body">
                <span class="card-custom-title">${item.name}</span>
                <p class="card-custom-price">${item.price === 0 ? 'Безкоштовно' : '+ ' + item.price + ' грн'}</p>
            </div>
        `;

        card.onclick = () => selectOption(type, item.id);
        container.appendChild(card);
    });
}

// ===== 7. БЛОК ПІДСУМКУ =====
function updateSummary() {
    const summaryText = document.getElementById("summaryText");
    const totalPriceEl = document.getElementById("totalPrice");
    const addToCartBtn = document.getElementById("addToCartBtn");

    let textParts = [];
    let total = 0;

    const config = [
        { key: 'shape', group: 'shapes', label: 'Форма' },
        { key: 'dough', group: 'doughs', label: 'Тісто' },
        { key: 'icing', group: 'icings', label: 'Глазур' },
        { key: 'topping', group: 'toppings', label: 'Посипка' }
    ];

    config.forEach(item => {
        const id = selected[item.key];
        if (id) {
            const data = ingredients[item.group].find(i => i.id === id);
            textParts.push(`<b>${item.label}:</b> ${data.name}`);
            total += data.price;
        }
    });

    summaryText.innerHTML = textParts.length > 0 ? textParts.join('<br>') : "Оберіть параметри...";
    totalPriceEl.innerText = `${total} грн`;

    // Кнопка активна, якщо вибрано всі 4 параметри
    if (selected.shape && selected.dough && selected.icing && selected.topping) {
        addToCartBtn.disabled = false;
    } else {
        addToCartBtn.disabled = true;
    }
}

// ===== 8. КОШИК =====
function addCustomToCart() {
    const shape = ingredients.shapes.find(i => i.id === selected.shape);
    const dough = ingredients.doughs.find(i => i.id === selected.dough);
    const icing = ingredients.icings.find(i => i.id === selected.icing);
    const topping = ingredients.toppings.find(i => i.id === selected.topping);

    const total = shape.price + dough.price + icing.price + topping.price;
    const desc = `Печиво: ${shape.name}, ${dough.name} тісто, глазур ${icing.name}, посипка ${topping.name}`;

    addToCart({
        id: `custom_${Date.now()}`,
        name: "Кастомне печиво 🍪",
        price: total,
        description: desc,
        image: document.getElementById("base").src
    });
}

document.addEventListener("DOMContentLoaded", updateUI);