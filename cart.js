// --- Функції для роботи з Cookies ---

// Збереження куки
function setCookie(name, value, days) {
    let expires = "";
    if (days) {
        let date = new Date();
        date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
        expires = "; expires=" + date.toUTCString();
    }
    // encodeURIComponent важливий для безпечного зберігання масивів JSON у куках
    document.cookie = name + "=" + encodeURIComponent(value) + expires + "; path=/";
}

// Отримання куки
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

// Отримати кошик
function getCart() {
    const cartCookie = getCookie("cart");
    return cartCookie ? JSON.parse(cartCookie) : [];
}

// Зберегти кошик (зберігаємо на 7 днів)
function saveCart(cart) {
    setCookie("cart", JSON.stringify(cart), 7);
}

// Додати товар (викликається на сторінці каталогу)
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
            image: item.image || '', // Якщо є зображення
            quantity: 1
        });
    }

    saveCart(cart);
    alert("Додано в кошик 🧺");
}

// Рендер кошика
function renderCart() {
    let cart = getCart();
    
    const container = document.getElementById("cartItems");
    const itemsCountEl = document.getElementById("itemsCount");
    const totalPriceEl = document.getElementById("totalPrice");

    // Якщо елементів немає на сторінці (наприклад, ми на сторінці меню), припиняємо виконання
    if (!container) return;

    container.innerHTML = "";

    // Якщо кошик пустий
    if (cart.length === 0) {
        container.innerHTML = `
            <div style="text-align: center; padding: 50px 20px; background: rgba(255,255,255,0.6); border-radius: 20px;">
                <h3 style="color: var(--text2); margin-bottom: 10px;">Кошик порожній 🧺</h3>
                <p style="color: var(--text3);">Додайте товари з каталогу, щоб оформити замовлення.</p>
            </div>
        `;
        // Обнуляємо підсумки
        if (itemsCountEl) itemsCountEl.innerText = "0 шт.";
        if (totalPriceEl) totalPriceEl.innerText = "0 грн";
        return;
    }

    let totalSum = 0;
    let totalItems = 0;

    cart.forEach(item => {
        // Рахуємо загальну суму та кількість
        totalSum += Number(item.price) * item.quantity;
        totalItems += item.quantity;

        const div = document.createElement("div");
        div.className = "cart-item";

        // Заглушка для фото, якщо його немає
        const imgSrc = item.image ? item.image : "https://placehold.co/90x90/fff8f2/8b5e3c?text=Фото";

        div.innerHTML = `
            <img src="${imgSrc}" alt="${item.name}" class="cart-item-img">
            <div class="cart-item-info">
                <h3 class="cart-item-title">${item.name}</h3>
                <p class="cart-item-price">${item.price} грн</p>
            </div>
            <div class="cart-quantity">
                <button onclick="decrease(${item.id})"><i class="ti ti-minus"></i></button>
                <span>${item.quantity}</span>
                <button onclick="increase(${item.id})"><i class="ti ti-plus"></i></button>
            </div>
            <button class="cart-remove-btn" onclick="removeItem(${item.id})" title="Видалити">
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
    cart = cart.filter(item => item.id !== id);
    saveCart(cart);
    renderCart();
}

// Збільшити кількість
function increase(id) {
    let cart = getCart();
    const item = cart.find(p => p.id === id);
    if (!item) return;

    item.quantity++;
    saveCart(cart);
    renderCart();
}

// Зменшити кількість
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

// --- Логіка модального вікна та замовлення ---

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

        // 1. Показуємо успішне повідомлення
        alert(`Дякуємо, ${orderData.name}! Ваше замовлення на суму ${orderData.total} прийнято. Ми зателефонуємо вам найближчим часом.`);

        // 2. Очищаємо кошик у Cookies (ставимо від'ємний час життя)
        setCookie("cart", "", -1);

        // 3. Закриваємо модальне вікно
        var modalElement = document.getElementById('orderModal');
        var modal = bootstrap.Modal.getInstance(modalElement);
        modal.hide();

        // 4. Оновлюємо інтерфейс 
        renderCart();
        
        // 5. Очищаємо поля форми
        document.getElementById("orderForm").reset();
    });
}

// Запуск рендеру, коли сторінка завантажилась
document.addEventListener("DOMContentLoaded", renderCart);