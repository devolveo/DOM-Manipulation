// DOM element references (declare here, assign later)
let cardsContainer;

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
  return cards;
}

// wait for DOM to load
document.addEventListener("DOMContentLoaded", function () {
  console.log("DOM fully loaded");
  cardsContainer = document.querySelector("#cards-container");

  console.log("cards container: ", cardsContainer);

  if (!cardsContainer) {
    console.error("could not find #cards-container element!");
    return;
  }

  renderCards(cards);
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
  console.log(`renderCards: Rendered ${cards.length} cards`);
}

function setupEventListener() {
  console.log("Setting up event listener");

  if (!cardsContainer) {
    console.error("setupEventListener: Cards container not found");
    return;
  }

  cardsContainer.addEventListener("click", handleCardClick);
  console.log("event listeners attached");

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
  cards = cards.filter((card) => card.id !== cardId);

  if (cards.length === initialLength) {
    console.error("deleteCard: Faied to remove card with cardId: ", cardId);
    return false;
  }

  // state changed, then re-render the ui
  renderCards();

  console.log("deleteCard: Successfully remove card: ", cardId);
  console.log("remaining cards: ", cards.length);
  return true;
}
