const homes = [
  {
    id: "cedar-house",
    price: 685000,
    rent: 3200,
    address: "1842 Cedar Lane",
    city: "Portland, OR 97205",
    beds: 3,
    baths: 2,
    area: 1840,
    type: "House",
    image: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=900&q=80",
    alt: "Warm modern living room opening onto a garden",
  },
  {
    id: "elm-condo",
    price: 429000,
    rent: 2450,
    address: "72 NW Everett Street",
    city: "Portland, OR 97209",
    beds: 2,
    baths: 2,
    area: 1120,
    type: "Condo",
    image: "https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?auto=format&fit=crop&w=900&q=80",
    alt: "Bright contemporary home interior with natural finishes",
  },
  {
    id: "maple-townhouse",
    price: 558000,
    rent: 2850,
    address: "916 Maplewood Drive",
    city: "Beaverton, OR 97005",
    beds: 3,
    baths: 2.5,
    area: 1565,
    type: "Townhouse",
    image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=900&q=80",
    alt: "Modern townhouse with a welcoming front entry",
  },
  {
    id: "garden-house",
    price: 795000,
    rent: 3750,
    address: "3017 SE Hawthorne Blvd",
    city: "Portland, OR 97214",
    beds: 4,
    baths: 3,
    area: 2210,
    type: "House",
    image: "https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?auto=format&fit=crop&w=900&q=80",
    alt: "Updated craftsman home framed by trees",
  },
];

const grid = document.querySelector("#property-grid");
const form = document.querySelector("#search-form");
const locationInput = document.querySelector("#location");
const typeSelect = document.querySelector("#home-type");
const priceSelect = document.querySelector("#max-price");
const sortSelect = document.querySelector("#sort-order");
const countLabel = document.querySelector("#results-count");
const emptyState = document.querySelector("#empty-state");
const savedToggle = document.querySelector("#saved-toggle");
const savedCount = document.querySelector("#saved-count");
const modeButtons = document.querySelectorAll(".mode-button");
const savedIds = new Set();
let currentMode = "buy";
let showSavedOnly = false;

function formatPrice(price) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(price);
}

function getVisibleHomes() {
  const query = locationInput.value.trim().toLowerCase();
  const maxPrice = priceSelect.value === "any" ? Infinity : Number(priceSelect.value);
  const matching = homes.filter((home) => {
    const matchesLocation = `${home.address} ${home.city}`.toLowerCase().includes(query);
    const matchesType = typeSelect.value === "any" || home.type === typeSelect.value;
    const matchesPrice = (currentMode === "buy" ? home.price : home.rent) <= maxPrice;
    const matchesSaved = !showSavedOnly || savedIds.has(home.id);
    return matchesLocation && matchesType && matchesPrice && matchesSaved;
  });

  if (sortSelect.value === "low") matching.sort((a, b) => a[currentMode === "buy" ? "price" : "rent"] - b[currentMode === "buy" ? "price" : "rent"]);
  if (sortSelect.value === "high") matching.sort((a, b) => b[currentMode === "buy" ? "price" : "rent"] - a[currentMode === "buy" ? "price" : "rent"]);
  return matching;
}

function renderHomes() {
  const visibleHomes = getVisibleHomes();
  grid.innerHTML = visibleHomes.map((home, index) => {
    const price = currentMode === "buy" ? home.price : home.rent;
    const saved = savedIds.has(home.id);
    return `
      <article class="property-card" style="animation-delay:${index * 65}ms">
        <div class="property-image-wrap">
          <img class="property-image" src="${home.image}" alt="${home.alt}" loading="lazy" />
          <span class="property-badge">${currentMode === "buy" ? "For sale" : "For rent"}</span>
          <button class="favorite-button" type="button" data-favorite="${home.id}" aria-label="${saved ? "Remove from" : "Add to"} saved homes" aria-pressed="${saved}">
            <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1.1-1.1a5.5 5.5 0 0 0-7.8 7.8l1.1 1.1L12 21l7.8-7.5 1.1-1.1a5.5 5.5 0 0 0-.1-7.8Z" /></svg>
          </button>
        </div>
        <div class="property-info">
          <div class="property-price"><strong>${formatPrice(price)}${currentMode === "rent" ? "<span>/mo</span>" : ""}</strong><span>${home.area.toLocaleString()} sq ft</span></div>
          <p class="property-address">${home.address}<br />${home.city}</p>
          <div class="property-meta"><span><strong>${home.beds}</strong> beds</span><span><strong>${home.baths}</strong> baths</span><span class="property-type">${home.type}</span></div>
        </div>
      </article>`;
  }).join("");

  const noun = visibleHomes.length === 1 ? "home" : "homes";
  countLabel.textContent = showSavedOnly
    ? `${visibleHomes.length} saved ${noun}`
    : `Showing ${visibleHomes.length} ${noun}`;
  emptyState.hidden = visibleHomes.length > 0;
  grid.hidden = visibleHomes.length === 0;
  savedCount.textContent = String(savedIds.size);
}

function setMode(mode) {
  currentMode = mode;
  modeButtons.forEach((button) => {
    const active = button.dataset.mode === mode;
    button.classList.toggle("is-active", active);
    button.setAttribute("aria-pressed", String(active));
  });
  document.querySelectorAll(".nav-link[data-mode]").forEach((link) => {
    link.classList.toggle("is-current", link.dataset.mode === mode);
  });
  const priceOptions = [...priceSelect.querySelectorAll("option:not([value='any'])")];
  const limits = mode === "buy" ? [500000, 750000, 1000000] : [2000, 3000, 4000];
  const labels = mode === "buy" ? ["$500k", "$750k", "$1m"] : ["$2k/mo", "$3k/mo", "$4k/mo"];
  priceOptions.forEach((option, index) => {
    option.value = String(limits[index]);
    option.textContent = labels[index];
  });
  renderHomes();
}

form.addEventListener("submit", (event) => {
  event.preventDefault();
  renderHomes();
  document.querySelector("#homes").scrollIntoView({ behavior: "smooth", block: "start" });
});

[locationInput, typeSelect, priceSelect, sortSelect].forEach((control) => {
  control.addEventListener("input", renderHomes);
  control.addEventListener("change", renderHomes);
});

modeButtons.forEach((button) => button.addEventListener("click", () => setMode(button.dataset.mode)));
document.querySelectorAll(".nav-link[data-mode]").forEach((link) => {
  link.addEventListener("click", () => setMode(link.dataset.mode));
});

grid.addEventListener("click", (event) => {
  const button = event.target.closest("[data-favorite]");
  if (!button) return;
  const id = button.dataset.favorite;
  if (savedIds.has(id)) savedIds.delete(id);
  else savedIds.add(id);
  renderHomes();
});

savedToggle.addEventListener("click", () => {
  showSavedOnly = !showSavedOnly;
  savedToggle.setAttribute("aria-pressed", String(showSavedOnly));
  renderHomes();
  document.querySelector("#homes").scrollIntoView({ behavior: "smooth", block: "start" });
});

document.querySelector("#clear-filters").addEventListener("click", () => {
  locationInput.value = "";
  typeSelect.value = "any";
  priceSelect.value = "any";
  showSavedOnly = false;
  savedToggle.setAttribute("aria-pressed", "false");
  renderHomes();
});

renderHomes();