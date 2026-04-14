
const shapes = [
  { id: "round", name: "Кругле", price: 20, image: "images/round.jpg" },
  { id: "heart", name: "Серце", price: 30, image: "images/heart.jpg" }
];

const flavors = [
  { id: "chocolate", name: "Шоколад", price: 15, image: "images/choco.jpg" },
  { id: "vanilla", name: "Ваніль", price: 10, image: "images/vanilla.jpg" }
];

const icings = [
  { id: "white", name: "Біла", price: 5, image: "images/white.jpg" },
  { id: "pink", name: "Рожева", price: 10, image: "images/pink.jpg" }
];

// Стан
let selected = {
  shape: null,
  flavor: null,
  icing: null
};

// Рендер карточок
function renderOptions(list, containerId, type) {
  const container = document.getElementById(containerId);
  container.innerHTML = "";

  list.forEach(item => {
    const card = document.createElement("div");

    card.classList.add("card");
    card.dataset.id = item.id;

    card.innerHTML = `
      <img src="${item.image}" width="120">
      <h3>${item.name}</h3>
      <p>${item.price} грн</p>
      <small>Натисни щоб обрати</small>
    `;

    card.addEventListener("click", () => {
      selectOption(type, item.id);
    });

    container.appendChild(card);
  });
}

// Вибір
function selectOption(type, id) {
  selected[type] = id;
  updateUI();
}

//Оновлення UI
function updateUI() {
  document.querySelectorAll(".options").forEach(container => {
    const type = container.id; 

    const cards = container.querySelectorAll(".card");

    cards.forEach(card => {
      const itemId = card.dataset.id;

      card.classList.remove("active");

      if (selected[type.slice(0, -1)] === itemId) {
        card.classList.add("active");
      }
    });
  });

  updateSummary();
}

//Підсумок і ціна
function updateSummary() {
  let text = "";
  let total = 0;

  const shape = shapes.find(s => s.id === selected.shape);
  const flavor = flavors.find(f => f.id === selected.flavor);
  const icing = icings.find(i => i.id === selected.icing);

  if (shape) {
    text += "Форма: " + shape.name + "\n";
    total += shape.price;
  }

  if (flavor) {
    text += "Смак: " + flavor.name + "\n";
    total += flavor.price;
  }

  if (icing) {
    text += "Глазур: " + icing.name + "\n";
    total += icing.price;
  }

  document.getElementById("summaryText").innerText =
    text || "Нічого не вибрано";

  document.getElementById("totalPrice").innerText =
    total + " грн";
}

function addCustomToCart() {
  if (!selected.shape || !selected.flavor || !selected.icing) {
    alert("Обери всі параметри");
    return;
  }

  const shape = shapes.find(s => s.id === selected.shape);
  const flavor = flavors.find(f => f.id === selected.flavor);
  const icing = icings.find(i => i.id === selected.icing);

  addToCart({
    name: "Кастомне печиво 🍪",
    price: shape.price + flavor.price + icing.price,
    description: `
Форма: ${shape.name}
Смак: ${flavor.name}
Глазур: ${icing.name}
    `
  });
}

//Запуск
renderOptions(shapes, "shapes", "shape");
renderOptions(flavors, "flavors", "flavor");
renderOptions(icings, "icings", "icing");