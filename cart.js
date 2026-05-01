// --- Функції для роботи з Cookies ---

function setCookie(name, value, days) {
    let expires = "";
    if (days) {
        let date = new Date();
        date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
        expires = "; expires=" + date.toUTCString();
    }
    document.cookie = name + "=" + encodeURIComponent(value) + expires + "; path=/";
}

function getCookie(name) {
    let nameEQ = name + "=";
    let ca = document.cookie.split(';');
    for(let i = 0; i < ca.length; i++) {
        let c = ca[i];
        while (c.charAt(0) === ' ') c = c.substring(1, c.length);
        if (c.indexOf(nameEQ) === 0) return decodeURIComponent(c.substring(nameEQ.length, c.length));
    }
    return null;
}

// --- Логіка кошика ---

function getCart() {
    const cartCookie = getCookie("cart");
    return cartCookie ? JSON.parse(cartCookie) : [];
}

function saveCart(cart) {
    setCookie("cart", JSON.stringify(cart), 7);
}

function addToCart(item) {
    let cart = getCart();
    const itemId = item.id || Date.now();
    const existing = cart.find(p => String(p.id) === String(itemId));

    if (existing) {
        existing.quantity += 1;
    } else {
        cart.push({
            id: itemId,
            name: item.name,
            price: item.price,
            description: item.description,
            image: item.image || '', 
            quantity: 1
        });
    }

    saveCart(cart);
    alert("Додано в кошик 🧺");
}

function renderCart() {
    let cart = getCart();
    
    const container = document.getElementById("cartItems");
    const itemsCountEl = document.getElementById("itemsCount");
    const totalPriceEl = document.getElementById("totalPrice");

    if (!container) return;

    container.innerHTML = "";

    if (cart.length === 0) {
        container.innerHTML = `
            <div style="text-align: center; padding: 50px 20px; background: rgba(255,255,255,0.6); border-radius: 20px;">
                <h3 style="color: var(--text2); margin-bottom: 10px;">Кошик порожній 🧺</h3>
                <p style="color: var(--text3);">Додайте товари з каталогу, щоб оформити замовлення.</p>
            </div>
        `;
        if (itemsCountEl) itemsCountEl.innerText = "0 шт.";
        if (totalPriceEl) totalPriceEl.innerText = "0 грн";
        return;
    }

    let totalSum = 0;
    let totalItems = 0;

    cart.forEach(item => {
        totalSum += Number(item.price) * item.quantity;
        totalItems += item.quantity;

        const div = document.createElement("div");
        div.className = "cart-item";

        const imgSrc = item.image ? item.image : "https://placehold.co/90x90/fff8f2/8b5e3c?text=Фото";

        // Додано лапки '${item.id}' для безпечного виклику функцій
        div.innerHTML = `
            <img src="${imgSrc}" alt="${item.name}" class="cart-item-img">
            <div class="cart-item-info">
                <h3 class="cart-item-title">${item.name}</h3>
                <p class="cart-item-price">${item.price} грн</p>
            </div>
            <div class="cart-quantity">
                <button onclick="decrease('${item.id}')"><i class="ti ti-minus"></i></button>
                <span>${item.quantity}</span>
                <button onclick="increase('${item.id}')"><i class="ti ti-plus"></i></button>
            </div>
            <button class="cart-remove-btn" onclick="removeItem('${item.id}')" title="Видалити">
                <i class="ti ti-trash"></i>
            </button>
        `;

        container.appendChild(div);
    });

    if (itemsCountEl) itemsCountEl.innerText = totalItems + " шт.";
    if (totalPriceEl) totalPriceEl.innerText = totalSum + " грн";
}

// Видалення товару
function removeItem(id) {
    let cart = getCart();
    cart = cart.filter(item => String(item.id) !== String(id));
    saveCart(cart);
    renderCart();
}

// Збільшити кількість
function increase(id) {
    let cart = getCart();
    const item = cart.find(p => String(p.id) === String(id));
    if (!item) return;

    item.quantity++;
    saveCart(cart);
    renderCart();
}

// Зменшити кількість
function decrease(id) {
    let cart = getCart();
    const item = cart.find(p => String(p.id) === String(id));
    if (!item) return;

    if (item.quantity > 1) {
        item.quantity--;
    } else {
        cart = cart.filter(p => String(p.id) !== String(id));
    }

    saveCart(cart);
    renderCart();
}

// --- Логіка модального вікна та ініціалізація подій ---
// Запускаємо логіку тільки після завантаження всього DOM
document.addEventListener("DOMContentLoaded", () => {
    renderCart();

    const checkoutBtn = document.querySelector(".btn-checkout");
    if (checkoutBtn) {
        checkoutBtn.addEventListener("click", function() {
            let cart = getCart();
            if (cart.length === 0) {
                alert("Кошик порожній! Додайте щось смачненьке спочатку 🥐");
                return;
            }
            
            var myModal = new bootstrap.Modal(document.getElementById('orderModal'));
            myModal.show();
        });
    }

    const orderForm = document.getElementById("orderForm");
    if (orderForm) {
        orderForm.addEventListener("submit", function(e) {
            e.preventDefault(); 

            const orderData = {
                name: document.getElementById("userName").value,
                surname: document.getElementById("userSurname").value,
                phone: document.getElementById("userPhone").value,
                address: document.getElementById("userAddress").value,
                items: getCart(),
                total: document.getElementById("totalPrice").innerText
            };

            console.log("Замовлення прийнято:", orderData);

            alert(`Дякуємо, ${orderData.name}! Ваше замовлення на суму ${orderData.total} прийнято. Ми зателефонуємо вам найближчим часом.`);

            // Очищаємо кошик
            setCookie("cart", "", -1);

            // Закриваємо модальне вікно
            var modalElement = document.getElementById('orderModal');
            var modal = bootstrap.Modal.getInstance(modalElement);
            modal.hide();

            renderCart();
            document.getElementById("orderForm").reset();
        });
    }
});