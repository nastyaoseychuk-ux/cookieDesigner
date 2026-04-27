// ===== ДАНІ =====

const shapes = [
  { id: "round", name: "Кругле", price: 20, image: "images/shapes/round.png" },
  { id: "heart", name: "Серце", price: 30, image: "images/shapes/heart.png" },
  { id: "star", name: "Зірка", price: 30, image: "images/shapes/star.png" },
  { id: "square", name: "Зірка", price: 30, image: "images/shapes/square.png" }
];

const doughTypes = [
  { id: "classic", name: "Класичне", price: 0, image: "images/dough/classic.png" },
  { id: "choco", name: "Шоколадне", price: 10, image: "images/dough/choco.png" }
];

const flavors = [
  { id: "chocolate", name: "Шоколад", price: 15, image: "images/choco.png" },
  { id: "vanilla", name: "Ваніль", price: 10, image: "images/vanilla.png" }
];

const icings = [
  { id: "white", name: "Біла", price: 5, image: "images/icings/white.png" },
  { id: "pink", name: "Рожева", price: 10, image: "images/icings/pink.png" }
];


// ===== СТАН =====

let selected = {
  shape: null,
  dough: null,
  flavor: null,
  icing: null
};


// ===== PREVIEW =====

function updatePreview() {
  console.log("SELECTED:", selected);

  const base = document.getElementById("base");
  const shape = shapes.find(s => s.id === selected.shape);

  if (!shape) return;

  let path = "images/shapes/" + shape.id;

  if (selected.dough === "choco") {
    path += "-choco";
  }
  
  if (selected.icing === "white") {
  path += "-white";
}

if (selected.icing === "pink") {
  path += "-pink";
}

  console.log("IMAGE PATH:", path + ".png");

  base.src = path + ".png";

  base.onerror = () => {
    console.log("FALLBACK TRIGGERED");
    base.src = "images/shapes/" + shape.id + ".png";
  };
}


// ===== РЕНДЕР =====

function renderOptions(list, containerId, type) {
  const container = document.getElementById(containerId);
  container.innerHTML = "";

  list.forEach(item => {
    const card = document.createElement("div");

    card.classList.add("card");
    card.dataset.id = item.id;

    card.innerHTML = `
      <img class="card-image" src="${item.image}" alt="${item.name}">

      <div class="card-body">
        <div class="card-top">
          <h3 class="card-title">${item.name}</h3>
          <p class="card-description">Обери цей варіант</p>
        </div>

        <div class="card-bottom">
          <span class="card-price">${item.price} грн</span>
        </div>
      </div>
    `;

    card.addEventListener("click", () => {
      selectOption(type, item.id);
    });

    container.appendChild(card);
  });
}


// ===== ВИБІР =====

function selectOption(type, id) {
  selected[type] = id;
  updateUI();
}


// ===== UI =====

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
  updatePreview();
}


// ===== ПІДСУМОК =====

function updateSummary() {
  let text = "";
  let total = 0;

  const shape = shapes.find(s => s.id === selected.shape);
  const dough = doughTypes.find(d => d.id === selected.dough);
  const flavor = flavors.find(f => f.id === selected.flavor);
  const icing = icings.find(i => i.id === selected.icing);

  if (shape) {
    text += "Форма: " + shape.name + "\n";
    total += shape.price;
  }

  if (dough) {
    text += "Тісто: " + dough.name + "\n";
    total += dough.price;
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


// ===== КОШИК =====

function addCustomToCart() {
  if (!selected.shape || !selected.flavor || !selected.icing) {
    alert("Обери всі параметри");
    return;
  }

  const shape = shapes.find(s => s.id === selected.shape);
  const dough = doughTypes.find(d => d.id === selected.dough);
  const flavor = flavors.find(f => f.id === selected.flavor);
  const icing = icings.find(i => i.id === selected.icing);

  addToCart({
    name: "Кастомне печиво 🍪",
    price: shape.price + flavor.price + icing.price + (dough?.price || 0),
    description: `
      Форма: ${shape.name}
      Тісто: ${dough?.name || "Класичне"}
      Смак: ${flavor.name}
      Глазур: ${icing.name}
    `
  });
}

// ===== СТАРТ =====

renderOptions(shapes, "shapes", "shape");
renderOptions(doughTypes, "doughs", "dough");
renderOptions(flavors, "flavors", "flavor");
renderOptions(icings, "icings", "icing");

