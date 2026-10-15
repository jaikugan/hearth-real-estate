// Replace these placeholders with your real details before publishing.
const business = {
  name: "Harvika Real Estate Groups",
  whatsapp: "910000000000", // country code + number, digits only
  phone: "+91 00000 00000",
  email: "hello@harvika.example",
  address: "Office address, City, State PIN",
  team: [
    { name: "Founder Name", role: "Founder & Principal Advisor", focus: "Homes and bank auction properties" },
    { name: "Advisor Name", role: "Commercial & Land Advisor", focus: "Offices, shops, plots and farmland" },
    { name: "Manager Name", role: "Property Manager", focus: "Tenants, rent collection and upkeep" },
  ],
};

const categoryLabels = { home: "Home", commercial: "Commercial", land: "Land", auction: "Bank auction" };

// Sample listings – replace with your own.
const properties = [
  {
    id: "HRV-101",
    category: "home",
    title: "3 BHK apartment with clubhouse",
    type: "Apartment",
    price: 11500000,
    area: 1650,
    beds: 3,
    baths: 3,
    location: "Whitefield, Bengaluru",
    image: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=900&q=80",
    alt: "Apartment towers with balconies",
    description: "East-facing apartment on a high floor in a gated community, close to the metro and IT parks.",
    features: ["Gated community", "2 covered parking", "Clubhouse & pool", "Ready to move"],
  },
  {
    id: "HRV-102",
    category: "home",
    title: "4 BHK independent villa",
    type: "Villa",
    price: 28000000,
    area: 3200,
    beds: 4,
    baths: 4,
    location: "Sarjapur Road, Bengaluru",
    image: "https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&w=900&q=80",
    alt: "Modern villa with a pool and lawn",
    description: "Spacious villa with a private garden and terrace in a low-density villa community.",
    features: ["Private garden", "Home office", "Solar water heating", "24×7 security"],
  },
  {
    id: "HRV-201",
    category: "commercial",
    title: "Furnished office floor",
    type: "Office",
    price: 19000000,
    area: 2400,
    location: "Koramangala, Bengaluru",
    image: "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=900&q=80",
    alt: "Bright open-plan office interior",
    description: "Plug-and-play office with 40 workstations, two cabins and a meeting room on a main road.",
    features: ["40 workstations", "Power backup", "Lift access", "Visitor parking"],
  },
  {
    id: "HRV-202",
    category: "commercial",
    title: "Ground-floor retail shop",
    type: "Shop",
    price: 8500000,
    area: 600,
    location: "Jayanagar, Bengaluru",
    image: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=900&q=80",
    alt: "Retail store interior with display shelves",
    description: "High-footfall shop front on a busy shopping street, suitable for retail or a clinic.",
    features: ["Main-road frontage", "Rented – steady income", "Washroom", "Clear title"],
  },
  {
    id: "HRV-301",
    category: "land",
    title: "30×40 residential plot",
    type: "Plot",
    price: 6200000,
    area: 1200,
    location: "Devanahalli, Bengaluru",
    image: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=900&q=80",
    alt: "Open green land under a clear sky",
    description: "Approved layout plot near the airport road with internal roads, water and electricity lines.",
    features: ["Approved layout", "East facing", "Bank loan available", "Ready for registration"],
  },
  {
    id: "HRV-302",
    category: "land",
    title: "2 acres agricultural land",
    type: "Agricultural land",
    price: 14000000,
    area: 87120,
    location: "Doddaballapur, Bengaluru Rural",
    image: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=900&q=80",
    alt: "Farmland with green fields",
    description: "Fertile land with a borewell and road access, suitable for farming or a farmhouse.",
    features: ["Borewell", "Road access", "Fenced", "Clear title documents"],
  },
  {
    id: "HRV-401",
    category: "auction",
    title: "2 BHK apartment – bank auction",
    type: "Apartment",
    price: 4800000,
    area: 1100,
    beds: 2,
    baths: 2,
    location: "Electronic City, Bengaluru",
    image: "https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?auto=format&fit=crop&w=900&q=80",
    alt: "Bright apartment interior with natural finishes",
    description: "Bank-auctioned apartment priced below market value. We can arrange a site inspection before you bid.",
    features: ["Below market price", "Site inspection possible", "Loan eligible"],
    auction: { bank: "Public sector bank", date: "2026-11-20", emd: 480000, possession: "Physical" },
  },
  {
    id: "HRV-402",
    category: "auction",
    title: "Commercial building – bank auction",
    type: "Building",
    price: 32000000,
    area: 6500,
    location: "Peenya, Bengaluru",
    image: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=900&q=80",
    alt: "Commercial office building facade",
    description: "Three-floor commercial building in an industrial area, offered through an e-auction.",
    features: ["Three floors", "Industrial area", "Wide road access"],
    auction: { bank: "Private sector bank", date: "2026-12-05", emd: 3200000, possession: "Symbolic" },
  },
];

const grid = document.querySelector("#property-grid");
const form = document.querySelector("#search-form");
const locationInput = document.querySelector("#location");
const priceSelect = document.querySelector("#max-price");
const sortSelect = document.querySelector("#sort-order");
const countLabel = document.querySelector("#results-count");
const emptyState = document.querySelector("#empty-state");
const savedToggle = document.querySelector("#saved-toggle");
const savedCount = document.querySelector("#saved-count");
const categoryButtons = document.querySelectorAll(".mode-button");
const dialog = document.querySelector("#property-dialog");
const dialogBody = document.querySelector("#dialog-body");
const contactForm = document.querySelector("#contact-form");
const savedIds = new Set();
let currentCategory = "all";
let showSavedOnly = false;

function escapeHtml(value) {
  return String(value).replace(/[&<>"']/g, (char) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[char]);
}

const trimNumber = (value) => Number(value.toFixed(2)).toString();

function formatPrice(amount) {
  if (amount >= 1e7) return `₹${trimNumber(amount / 1e7)} Cr`;
  if (amount >= 1e5) return `₹${trimNumber(amount / 1e5)} L`;
  return `₹${amount.toLocaleString("en-IN")}`;
}

function formatArea(sqft) {
  return sqft >= 43560 ? `${trimNumber(sqft / 43560)} acres` : `${sqft.toLocaleString("en-IN")} sq ft`;
}

function formatDate(isoDate) {
  return new Date(`${isoDate}T00:00:00`).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
}

function whatsappUrl(text) {
  return `https://wa.me/${business.whatsapp}?text=${encodeURIComponent(text)}`;
}

const phoneHref = `tel:${business.phone.replace(/\s/g, "")}`;

function getVisibleProperties() {
  const query = locationInput.value.trim().toLowerCase();
  const maxPrice = priceSelect.value === "any" ? Infinity : Number(priceSelect.value);
  const matching = properties.filter((property) => {
    const matchesQuery = `${property.title} ${property.type} ${property.location}`.toLowerCase().includes(query);
    const matchesCategory = currentCategory === "all" || property.category === currentCategory;
    const matchesSaved = !showSavedOnly || savedIds.has(property.id);
    return matchesQuery && matchesCategory && property.price <= maxPrice && matchesSaved;
  });

  if (sortSelect.value === "low") matching.sort((a, b) => a.price - b.price);
  if (sortSelect.value === "high") matching.sort((a, b) => b.price - a.price);
  return matching;
}

function cardMeta(property) {
  const parts = [];
  if (property.beds) parts.push(`<span><strong>${property.beds}</strong> BHK</span>`);
  if (property.baths) parts.push(`<span><strong>${property.baths}</strong> baths</span>`);
  if (property.auction) parts.push(`<span>Auction <strong>${formatDate(property.auction.date)}</strong></span>`);
  parts.push(`<span class="property-type">${escapeHtml(property.type)}</span>`);
  return parts.join("");
}

function renderProperties() {
  const visible = getVisibleProperties();
  grid.innerHTML = visible.map((property, index) => {
    const saved = savedIds.has(property.id);
    const isAuction = property.category === "auction";
    return `
      <article class="property-card" style="animation-delay:${index * 65}ms">
        <div class="property-image-wrap">
          <img class="property-image" src="${escapeHtml(property.image)}" alt="${escapeHtml(property.alt)}" loading="lazy" />
          <span class="property-badge${isAuction ? " is-auction" : ""}">${categoryLabels[property.category]}</span>
          <button class="favorite-button" type="button" data-favorite="${property.id}" aria-label="${saved ? "Remove from" : "Add to"} saved properties" aria-pressed="${saved}">
            <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1.1-1.1a5.5 5.5 0 0 0-7.8 7.8l1.1 1.1L12 21l7.8-7.5 1.1-1.1a5.5 5.5 0 0 0-.1-7.8Z" /></svg>
          </button>
        </div>
        <div class="property-info">
          <div class="property-price"><strong>${isAuction ? "<small>Reserve </small>" : ""}${formatPrice(property.price)}</strong><span>${formatArea(property.area)}</span></div>
          <h3 class="property-title"><button class="card-link" type="button" data-open="${property.id}">${escapeHtml(property.title)}</button></h3>
          <p class="property-address">${escapeHtml(property.location)}</p>
          <div class="property-meta">${cardMeta(property)}</div>
        </div>
      </article>`;
  }).join("");

  const noun = visible.length === 1 ? "property" : "properties";
  countLabel.textContent = showSavedOnly ? `${visible.length} saved ${noun}` : `Showing ${visible.length} ${noun}`;
  emptyState.hidden = visible.length > 0;
  grid.hidden = visible.length === 0;
  savedCount.textContent = String(savedIds.size);
}

function openProperty(id) {
  const property = properties.find((item) => item.id === id);
  if (!property) return;
  const { auction } = property;
  const specs = [
    ["Type", property.type],
    ["Area", formatArea(property.area)],
    property.beds && ["Bedrooms", `${property.beds} BHK`],
    property.baths && ["Bathrooms", property.baths],
    ["Listing ID", property.id],
  ].filter(Boolean);
  const enquiry = `Hi ${business.name}, I'm interested in ${property.title} (${property.id}) at ${property.location}. Please share more details.`;

  dialogBody.innerHTML = `
    <img class="dialog-image" src="${escapeHtml(property.image)}" alt="${escapeHtml(property.alt)}" />
    <div class="dialog-content">
      <span class="property-badge${auction ? " is-auction" : ""}">${categoryLabels[property.category]}</span>
      <h2 id="dialog-title">${escapeHtml(property.title)}</h2>
      <p class="property-address">${escapeHtml(property.location)}</p>
      <p class="dialog-price">${auction ? "<span>Reserve price</span>" : ""}<strong>${formatPrice(property.price)}</strong></p>
      <dl class="dialog-specs">${specs.map(([label, value]) => `<div><dt>${label}</dt><dd>${escapeHtml(value)}</dd></div>`).join("")}</dl>
      <p>${escapeHtml(property.description)}</p>
      <ul class="dialog-features">${property.features.map((feature) => `<li>${escapeHtml(feature)}</li>`).join("")}</ul>
      ${auction ? `
        <div class="auction-box">
          <h3>Auction details</h3>
          <dl class="dialog-specs">
            <div><dt>Bank</dt><dd>${escapeHtml(auction.bank)}</dd></div>
            <div><dt>Auction date</dt><dd>${formatDate(auction.date)}</dd></div>
            <div><dt>EMD</dt><dd>${formatPrice(auction.emd)}</dd></div>
            <div><dt>Possession</dt><dd>${escapeHtml(auction.possession)}</dd></div>
          </dl>
          <p>Details are from the bank's sale notice. We help you verify documents, inspect the property and register for the e-auction.</p>
        </div>` : ""}
      <div class="dialog-actions">
        <a class="whatsapp-button" href="${escapeHtml(whatsappUrl(enquiry))}" target="_blank" rel="noopener">Enquire on WhatsApp</a>
        <a class="secondary-button" href="${phoneHref}">Call ${escapeHtml(business.phone)}</a>
      </div>
    </div>`;
  dialog.showModal();
}

function setCategory(category) {
  currentCategory = category;
  categoryButtons.forEach((button) => {
    const active = button.dataset.category === category;
    button.classList.toggle("is-active", active);
    button.setAttribute("aria-pressed", String(active));
  });
  renderProperties();
}

function renderTeam() {
  document.querySelector("#team-grid").innerHTML = business.team.map((member) => {
    const initials = member.name.split(/\s+/).map((part) => part[0]).join("").slice(0, 2).toUpperCase();
    return `
      <article class="team-card">
        <span class="team-avatar" aria-hidden="true">${escapeHtml(initials)}</span>
        <div><h3>${escapeHtml(member.name)}</h3><p class="team-role">${escapeHtml(member.role)}</p><p>${escapeHtml(member.focus)}</p></div>
      </article>`;
  }).join("");
}

function fillContactDetails() {
  const greeting = whatsappUrl(`Hi ${business.name}, I'd like to know more about your properties.`);
  document.querySelectorAll("[data-whatsapp-link]").forEach((link) => { link.href = greeting; });
  document.querySelectorAll("[data-phone-link]").forEach((link) => { link.href = phoneHref; });
  document.querySelectorAll("[data-phone-text]").forEach((link) => { link.textContent = business.phone; });
  const email = document.querySelector("#contact-email");
  email.href = `mailto:${business.email}`;
  email.textContent = business.email;
  document.querySelector("#contact-address").textContent = business.address;
  document.querySelector("#year").textContent = String(new Date().getFullYear());
}

form.addEventListener("submit", (event) => {
  event.preventDefault();
  renderProperties();
  document.querySelector("#properties").scrollIntoView({ behavior: "smooth", block: "start" });
});

[locationInput, priceSelect, sortSelect].forEach((control) => {
  control.addEventListener("input", renderProperties);
  control.addEventListener("change", renderProperties);
});

categoryButtons.forEach((button) => button.addEventListener("click", () => setCategory(button.dataset.category)));
document.querySelectorAll(".nav-link[data-category]").forEach((link) => {
  link.addEventListener("click", () => setCategory(link.dataset.category));
});

grid.addEventListener("click", (event) => {
  const favorite = event.target.closest("[data-favorite]");
  if (favorite) {
    const id = favorite.dataset.favorite;
    if (savedIds.has(id)) savedIds.delete(id);
    else savedIds.add(id);
    renderProperties();
    return;
  }
  const opener = event.target.closest("[data-open]");
  if (opener) openProperty(opener.dataset.open);
});

document.querySelector("#dialog-close").addEventListener("click", () => dialog.close());
dialog.addEventListener("click", (event) => {
  if (event.target === dialog) dialog.close();
});

savedToggle.addEventListener("click", () => {
  showSavedOnly = !showSavedOnly;
  savedToggle.setAttribute("aria-pressed", String(showSavedOnly));
  renderProperties();
  document.querySelector("#properties").scrollIntoView({ behavior: "smooth", block: "start" });
});

document.querySelector("#clear-filters").addEventListener("click", () => {
  locationInput.value = "";
  priceSelect.value = "any";
  showSavedOnly = false;
  savedToggle.setAttribute("aria-pressed", "false");
  setCategory("all");
});

contactForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const data = new FormData(contactForm);
  const message = [
    `Hi ${business.name}, I'm ${data.get("name")}.`,
    `Interested in: ${data.get("interest")}`,
    `Phone: ${data.get("phone")}`,
    data.get("message") ? `Requirement: ${data.get("message")}` : "",
  ].filter(Boolean).join("\n");
  window.open(whatsappUrl(message), "_blank", "noopener");
  contactForm.reset();
});

fillContactDetails();
renderTeam();
renderProperties();

renderHomes();