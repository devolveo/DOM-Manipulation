let cardsContainer;
let form;
let searchInput;
let filterSelect;
let cards = [
  {
    id: 1,
    title: "Learn DOM Manipulation",
    description: "Master the fundamentals of DOM",
    category: "study",
    createdAt: new Date().toISOString(),
  },
  {
    id: 2,
    title: "Build a Project",
    description: "Apply knowledge in real project",
    category: "work",
    createdAt: new Date().toISOString(),
  },
];

let nextId = 3;

// Test: Log data to console
console.log("Initial cards loaded:", cards);

function getFilteredCards() {
  console.log("filtering cards");

  const searchTerm = searchInput?.value.toLowerCase() || "";
  const category = filterSelect?.value || "all";

  console.log("Search term: ", searchTerm);
  console.log("Category filter: ", category);

  const filtered = cards.filter((card) => {
    const matchesSearch =
      card.title.toLowerCase().includes(searchTerm) ||
      card.description.toLowerCase().includes(searchTerm);

    const matchesCategory = category === "all" || card.category === category;
    console.log(
      `matchedSearch data: ${matchesSearch} and  matchedCategory data: ${matchesCategory}`
    );
    return matchesSearch && matchesCategory;
  });

  console.log(`Filtered ${filtered.length} of ${cards.length} cards`);
  return filtered;
}

// wait for DOM to load
document.addEventListener("DOMContentLoaded", function () {
  console.log("DOM fully loaded");
  cardsContainer = document.querySelector("#cards-container");
  form = document.querySelector("#create-card-form");
  searchInput = document.querySelector("#search-input");
  filterSelect = document.querySelector("#filter-category");

  console.log("cards container: ", cardsContainer);
  console.log("Form:", form);
  console.log("Search input:", searchInput);
  console.log("Filter select:", filterSelect);

  if (!cardsContainer) {
    console.error("could not find #cards-container element!");
    return;
  }

  if (!loadCards()) {
    console.log("using default cards");
  }

  renderCards();
  setupEventListener();
});

function renderCards(cardsToRender = null) {
  const displayCards = cardsToRender || getFilteredCards();
  console.log("renderCards called with:", displayCards);

  if (!Array.isArray(displayCards)) {
    console.error("renderCards: invalid cards data");
    return;
  }

  if (!cardsContainer) {
    console.error("renderCards: cards container not found");
    return;
  }

  // handle special case
  if (displayCards.length === 0) {
    cardsContainer.innerHTML = `
    <div style="grid-column: 1/-1; text-align: center; color: #999;">
                <p>No cards yet. Create your first card!</p>
            </div>
    `;
    return;
  }

  // main logic - transform data to ui
  const cardsHTML = displayCards
    .map((card) => {
      return `
        <div class="card" data-card-id="${card.id}">
        <button class="delete-btn">x</button>
            <h3>${card.title}</h3>
            <p>${card.description}</p>
            <span class="category category-${card.category}">${card.category}</span>
        </div>
    `;
    })
    .join("");

  // single DOM update for performance
  cardsContainer.innerHTML = cardsHTML;

  const cardElements = cardsContainer.querySelectorAll(".card");
  cardElements.forEach((card, index) => {
    card.style.animationDelay = `${index * 50}ms`;
  });

  console.log(`renderCards: Rendered ${cards.length} cards`);
}

function setupEventListener() {
  console.log("Setting up event listener");

  if (!cardsContainer) {
    console.error("setupEventListener: Cards container not found");
    return;
  }

  if (form) {
    form.addEventListener("submit", handleCreateCard);
    console.log("Form listener attached");
  }

  if (searchInput) {
    searchInput.addEventListener("input", handleSearch);
    console.log("Search listener attached");
  }

  if (filterSelect) {
    filterSelect.addEventListener("change", handleFilter);
    console.log("Filter listener attached");
  }

  cardsContainer.addEventListener("click", handleCardClick);
  console.log("event listeners attached");
}

function handleSearch() {
  console.log("Search triggered: ", searchInput.value);
  renderCards();
}

function handleFilter() {
  console.log("filter changed: ", filterSelect.value);
  renderCards();
}

function getNextId() {
  if (cards.length === 0) return 1;
  return Math.max(...cards.map((card) => card.id)) + 1;
}

/****************************************/
/*           handleCreateCard           */
/****************************************/

function handleCreateCard(event) {
  console.log("Form submitted");

  if (!event) {
    console.error("handleCreateCard: No event object");
    return;
  }

  event.preventDefault();

  const formData = new FormData(event.target);
  const title = formData.get("title")?.trim();
  const description = formData.get("description")?.trim();
  const category = formData.get("category");

  console.log("Form data:", { title, description, category });

  if (!title || !description || !category) {
    console.error("handleCreateCard: missing required field");
    alert("Please fill all fields");
    return;
  }

  if (title.length > 50) {
    alert("title must be less than 50 characters");
    return;
  }

  if (description.length > 200) {
    alert("description must be less than 200 characters");
    return;
  }

  // 🧠 THINKING: "Create the new card object"
  // Create new card object
  const newCard = {
    id: getNextId(), // Use current nextId, then increment
    title: title,
    description: description,
    category: category,
    createdAt: new Date().toISOString(),
  };

  console.log("Creating new card:", newCard);

  // 🧠 THINKING: "Add to beginning so newest shows first"
  // Update state (add to beginning)
  cards.unshift(newCard);

  saveCards();

  form.classList.add("form-success");
  setTimeout(() => {
    form.classList.remove("form-success");
  }, 500);

  // 🧠 THINKING: "Clear form for next entry"
  // Clear form
  event.target.reset();

  // 🧠 THINKING: "Update UI to show new card"
  // Re-render
  renderCards();

  // 🧠 THINKING: "Good UX - ready for next entry"
  // Focus back to title field for quick entry
  event.target.querySelector('[name="title"]').focus();

  console.log("Card created successfully. Total cards:", cards.length);
}

/********************/
/*  handleCardClick */
/********************/
function handleCardClick(event) {
  console.log("Card container clicked:", event.target);

  if (!event || !event.target) {
    console.error("handleCardClick: invalid event");
    return;
  }

  // check if the close button was clicked
  const deleteBtn = event.target.closest(".delete-btn");
  if (deleteBtn) {
    const card = event.target.closest(".card");

    if (card) {
      const cardId = parseInt(card.dataset.cardId);
      console.log("Delete button clicked for card: ", cardId);
      deleteCard(cardId);
    }
  }
}

function deleteCard(cardId) {
  console.log("deleteCard called with ID: ", cardId);

  if (!cardId || typeof cardId !== "number") {
    console.error("deleteCard: Invalid card ID");
    return false;
  }

  const cardExists = cards.some((card) => card.id === cardId);
  if (!cardExists) {
    console.warn("deleteCard: cannot find card with cardId: ", cardId);
    return false;
  }

  const initialLength = cards.length;

  // animation
  // find the element for animation
  const cardElement = document.querySelector(`[data-card-id="${cardId}"]`);

  if (cardElement) {
    cardElement.classList.add("card-exit");
    // listen for annimation end
    cardElement.addEventListener("animationend", () => {
      cards = cards.filter((card) => card.id !== cardId);
      saveCards();

      // state changed, then re-render the ui
      renderCards();
      console.log("deleteCard: Successfully removed card:", cardId);
      console.log("remaining cards: ", cards.length);
    }),
      { once: true };
  } else {
    // No element found, just remove from state
    cards = cards.filter((card) => card.id !== cardId);
    saveCards();
    renderCards();
    console.log("deleteCard: Successfully removed card:", cardId);
  }

  if (cards.length === initialLength) {
    console.error("deleteCard: Faied to remove card with cardId: ", cardId);
    return false;
  }

  return true;
}

function saveCards() {
  console.log("Saving cards to localStorage");
  try {
    const cardJSON = JSON.stringify(cards);

    localStorage.setItem("cardManager_cards", cardJSON);
    console.log(`Saved ${cards.length} cards`);
    return true;
  } catch (error) {
    console.error("saveCards: Failed to save.", error);
    if (error.name === "QuotaExceededError") {
      alert("Storage is full. Please delete some cards.");
    }
  }
}

function loadCards() {
  console.log("Loading cards from localStorage");
  try {
    const cardsJSON = localStorage.getItem("cardManager_cards");

    if (!cardsJSON) {
      console.log("No saved cards found!.");
      return false;
    }

    const savedCards = JSON.parse(cardsJSON);

    if (!Array.isArray(savedCards)) {
      console.error("loadCards: invalid data format");
      return false;
    }

    const isValidData = savedCards.every(
      (card) =>
        card.hasOwnProperty("id") &&
        card.hasOwnProperty("title") &&
        card.hasOwnProperty("category")
    );

    if (!isValidData) {
      console.error("loadCards: corrupted card data");
      return false;
    }

    cards = savedCards;

    return true;
  } catch (error) {
    console.error("Failed to load data", error);
    if (error instanceof SyntaxError) {
      console.error("Corrupted localStorage data, using defaults");
      localStorage.removeItem("cardManager_cards");
    }
    return false;
  }
}
