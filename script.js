// ============ Utilities & State ============
const $ = (sel) => document.querySelector(sel);
const $$ = (sel) => Array.from(document.querySelectorAll(sel));
const money = (n) => `${n.toFixed(0)} lei`;

const State = {
  lang: localStorage.getItem("lang") || "ro",
  theme: localStorage.getItem("theme") || "light",
  user: JSON.parse(localStorage.getItem("user") || "null"),
  cart: JSON.parse(localStorage.getItem("cart") || "[]"),
  owned: JSON.parse(localStorage.getItem("owned") || "[]"), // purchased recipe IDs
};

function saveState() {
  localStorage.setItem("lang", State.lang);
  localStorage.setItem("theme", State.theme);
  localStorage.setItem("cart", JSON.stringify(State.cart));
  localStorage.setItem("owned", JSON.stringify(State.owned));
  if (State.user) localStorage.setItem("user", JSON.stringify(State.user));
  else localStorage.removeItem("user");
}

// i18n strings (extend as needed)
const I18N = {
  ro: {
    // nav
    "nav.home": "Acasă",
    "nav.about": "Despre",
    "nav.products": "Rețete",
    "nav.blog": "Blog",
    "nav.shop": "Coș",
    "nav.sale": "Reduceri",
    // about page
    "about.pageTitle": "Despre",
    "about.me.title": "Despre mine",
    "about.me.text":
      "Eu sunt <strong>FoodieR</strong>, pasionată de nutriție și gătit creativ. Am regândit rețete clasice în versiuni echilibrate caloric, fără a sacrifica gustul.",
    "about.me.check1": "Rețete testate, cu pași clari",
    "about.me.check2": "Alternative mai sănătoase pentru ingrediente",
    "about.me.check3": "Focus pe echilibru: sațietate + savoare",
    "about.foodier.title": "Despre FoodieR",
    "about.story":
      "FoodieR este proiectul meu de suflet: un magazin de rețete low-calorie, structurat pe nevoi, momente ale zilei și preferințe alimentare.",
    "about.stats.timep": "economie de timp la gatit",
    "about.stats.rating": "scor mediu recenzii",
    "about.stats.steps": "instrucțiuni clare, pas cu pas",
    // footer
    "footer.quickLinks": "Linkuri rapide",
    "footer.contactInfo": "Contact",
    "footer.tagline":
      "Rețete low-calorie, regândite ca să fie sănătoase și gustoase. Calitate, echilibru și savoare, pe înțelesul tuturor.",
    "footer.rights": "Toate drepturile rezervate.",
    // search
    "search.placeholder": "Search...",
    "search.aria": "Caută...",
  },
  en: {
    // nav
    "nav.home": "Home",
    "nav.about": "About",
    "nav.products": "Recipes",
    "nav.blog": "Blog",
    "nav.shop": "Shop",
    "nav.sale": "Sale",
    // about page
    "about.pageTitle": "About",
    "about.me.title": "About me",
    "about.me.text":
      "I’m <strong>FoodieR</strong>, passionate about nutrition and creative cooking. I reimagine classic recipes into balanced, lower-calorie versions without sacrificing flavor.",
    "about.me.check1": "Tried-and-tested recipes with clear steps",
    "about.me.check2": "Healthier ingredient alternatives",
    "about.me.check3": "Balance first: satiety + taste",
    "about.foodier.title": "About FoodieR",
    "about.story":
      "FoodieR is my passion project: a low-calorie recipe shop organized by needs, time of day, and dietary preferences.",
    "about.stats.premium": "premium recipes",
    "about.stats.rating": "average review score",
    "about.stats.steps": "step by step instructions",
    "about.stats.users": "members in comunity",
    // footer
    "footer.quickLinks": "Quick Links",
    "footer.contactInfo": "Contact Info",
    "footer.tagline":
      "Your low-calorie recipes, reimagined to be healthy and tasty. Quality, balance, and flavor for everyone.",
    "footer.rights": "All rights reserved.",
    // search
    "search.placeholder": "Search recipes, ingredients, etc…",
    "search.aria": "Search recipes",
  },
};

function applyI18n() {
  const dict = I18N[State.lang] || {};
  document.documentElement.lang = State.lang;

  // texte
  document.querySelectorAll("[data-i18n]").forEach((el) => {
    const key = el.getAttribute("data-i18n");
    if (dict[key]) el.innerHTML = dict[key]; // ← înlocuit textContent cu innerHTML
  });

  // atribute (placeholder, aria-label etc.)
  const si = document.getElementById("search-input");
  if (si) {
    si.setAttribute(
      "placeholder",
      dict["search.placeholder"] || si.getAttribute("placeholder")
    );
    si.setAttribute(
      "aria-label",
      dict["search.aria"] || si.getAttribute("aria-label")
    );
  }
}

function applyTheme() {
  document.documentElement.setAttribute("data-theme", State.theme);
}

function setYear() {
  const y = new Date().getFullYear();
  $$("#year").forEach((n) => (n.textContent = y));
}

// ============ Header, Auth, Cart ============
function initHeader() {
  const burger = $("#burger");
  if (burger) {
    burger.addEventListener("click", () => {
      const list = $("#nav-list");
      list.classList.toggle("show");
      burger.setAttribute("aria-expanded", list.classList.contains("show"));
    });
  }
  $("#toggle-lang")?.addEventListener("click", () => {
    State.lang = State.lang === "ro" ? "en" : "ro";
    saveState();
    applyI18n();
    renderAll();
  });
  $("#toggle-theme")?.addEventListener("click", () => {
    State.theme = State.theme === "light" ? "dark" : "light";
    saveState();
    applyTheme();
  });

  // Auth buttons
  const loginBtn = $("#login-btn");
  const logoutBtn = $("#logout-btn");
  const modal = $("#auth-modal");
  const form = $("#auth-form");

  function refreshAuthUI() {
    if (State.user) {
      loginBtn?.classList.add("hidden");
      logoutBtn?.classList.remove("hidden");
    } else {
      loginBtn?.classList.remove("hidden");
      logoutBtn?.classList.add("hidden");
    }
  }

  loginBtn?.addEventListener("click", () => modal.showModal());
  $("#footer-login")?.addEventListener("click", (e) => {
    e.preventDefault();
    modal.showModal();
  });
  logoutBtn?.addEventListener("click", () => {
    State.user = null;
    saveState();
    refreshAuthUI();
  });

  form?.addEventListener("submit", (e) => {
    e.preventDefault();
  });
  $("#auth-login")?.addEventListener("click", () => {
    const email = $("#auth-email").value.trim();
    const pass = $("#auth-pass").value.trim();
    if (email && pass) {
      State.user = { email };
      saveState();
      modal.close();
      refreshAuthUI();
      alert("Bun venit, " + email);
    }
  });
  $("#auth-signup")?.addEventListener("click", () => {
    const email = $("#auth-email").value.trim();
    const pass = $("#auth-pass").value.trim();
    if (email && pass) {
      State.user = { email, new: true };
      saveState();
      modal.close();
      refreshAuthUI();
      alert("Cont creat pentru " + email);
    }
  });

  refreshAuthUI();
}

// Cart
function openCart() {
  $("#cart-drawer").setAttribute("aria-hidden", "false");
  renderCart();
}
function closeCart() {
  $("#cart-drawer").setAttribute("aria-hidden", "true");
}

function addToCart(id) {
  const item = State.cart.find((i) => i.id === id);
  if (item) item.qty++;
  else State.cart.push({ id, qty: 1 });
  saveState();
  renderCart();
  openCart();
}
function removeFromCart(id) {
  State.cart = State.cart.filter((i) => i.id !== id);
  saveState();
  renderCart();
}
function updateQty(id, delta) {
  const it = State.cart.find((i) => i.id === id);
  if (!it) return;
  it.qty = Math.max(1, it.qty + delta);
  saveState();
  renderCart();
}

function renderCart() {
  const box = $("#cart-items");
  if (!box) return;
  box.innerHTML = "";
  let subtotal = 0;
  const saleItems = [];
  State.cart.forEach((ci) => {
    const r = RECIPES.find((r) => r.id === ci.id);
    const price = r.price * ci.qty;
    subtotal += price;
    if (r.sale) saleItems.push(ci);
    const row = document.createElement("div");
    row.className = "cart-item";
    row.innerHTML = `
      <img src="${r.img}" alt="${r.title}">
      <div><strong>${
        r.lang[State.lang] || r.title
      }</strong><div class="muted">${money(r.price)}</div></div>
      <div class="qty">
        <button class="ghost" aria-label="-">−</button>
        <span>${ci.qty}</span>
        <button class="ghost" aria-label="+">+</button>
        <button class="link" aria-label="remove">Remove</button>
      </div>`;
    const [minus, , plus, remove] = row.querySelectorAll("button");
    minus.addEventListener("click", () => updateQty(ci.id, -1));
    plus.addEventListener("click", () => updateQty(ci.id, 1));
    remove.addEventListener("click", () => removeFromCart(ci.id));
    box.appendChild(row);
  });

  // BOGO: if any sale item bought, allow one free item selection from sale group
  const bogoMsg = $("#bogo-msg");
  const paidSaleQty = saleItems.reduce((s, ci) => s + ci.qty, 0);
  bogoMsg.textContent =
    paidSaleQty > 0
      ? `Ai ${paidSaleQty} bonus GRATUIT din "Special Sale" la checkout.`
      : "";
  $("#cart-total").textContent = money(subtotal);
}

function checkout() {
  if (!State.user) {
    alert("Te rog autentifică-te înainte de plată.");
    return;
  }
  if (State.cart.length === 0) {
    alert("Coșul este gol.");
    return;
  }
  // simulate success
  const paid = [];
  State.cart.forEach((ci) => {
    for (let i = 0; i < ci.qty; i++) {
      paid.push(ci.id);
    }
  });
  // Unlock purchased
  State.owned = Array.from(new Set([...State.owned, ...paid]));
  saveState();
  alert("Plată reușită! Rețetele au fost deblocate în contul tău.");
  State.cart = [];
  saveState();
  renderCart();
}

// ============ Home rendering ============
function renderHero() {
  const track = $("#hero-track");
  if (!track) return;
  track.innerHTML = "";
  CATEGORIES.forEach((cat) => {
    const slide = document.createElement("div");
    slide.className = "carousel-slide";
    slide.innerHTML = `
      <div class="copy">
        <h3>${State.lang === "ro" ? cat.nameRO : cat.nameEN}</h3>
        <p class="muted">${State.lang === "ro" ? cat.descRO : cat.descEN}</p>
        <button class="accent" onclick="location.href='products.html#${
          cat.id
        }'">Shop</button>
      </div>
      <img src="${cat.img}" alt="${cat.nameRO}" loading="lazy">`;
    track.appendChild(slide);
  });

  // după ce am pus slide-urile, pornim autoplay-ul
  const hero = document.querySelector('[data-carousel="hero"]');
  if (hero) setupCarousel(hero, { interval: 4000, pauseOnHover: true });
}

/* Generic carousel initializer: autoplay + dots + swipe */
function setupCarousel(root, opts = {}) {
  const interval = opts.interval ?? 4000;
  const pauseOnHover = opts.pauseOnHover ?? true;

  const track = root.querySelector(".carousel-track");
  const prev = root.querySelector(".carousel-prev");
  const next = root.querySelector(".carousel-next");
  const slides = Array.from(track.children);
  if (!slides.length) return;

  // dots
  const dotsWrap = document.createElement("div");
  dotsWrap.className = "carousel-dots";
  const dots = slides.map((_, i) => {
    const b = document.createElement("button");
    b.className = "dot";
    b.type = "button";
    b.setAttribute("aria-label", `Slide ${i + 1}`);
    b.addEventListener("click", () => {
      goTo(i);
      restart();
    });
    dotsWrap.appendChild(b);
    return b;
  });
  root.appendChild(dotsWrap);

  let index = 0,
    timer;

  function updateDots() {
    dots.forEach((d, i) => d.classList.toggle("active", i === index));
  }
  function goTo(i) {
    index = (i + slides.length) % slides.length;
    const x = slides[index].offsetLeft;
    track.scrollTo({ left: x, behavior: "smooth" });
    updateDots();
  }
  function nextSlide() {
    goTo(index + 1);
  }
  function prevSlide() {
    goTo(index - 1);
  }

  function start() {
    stop();
    timer = setInterval(nextSlide, interval);
  }
  function stop() {
    if (timer) clearInterval(timer);
  }
  function restart() {
    start();
  }

  // buttons
  prev?.addEventListener("click", () => {
    prevSlide();
    restart();
  });
  next?.addEventListener("click", () => {
    nextSlide();
    restart();
  });

  // pause on hover/focus
  if (pauseOnHover) {
    root.addEventListener("mouseenter", stop);
    root.addEventListener("mouseleave", start);
  }
  root.addEventListener("focusin", stop);
  root.addEventListener("focusout", start);

  // pause when tab hidden
  document.addEventListener("visibilitychange", () => {
    document.hidden ? stop() : start();
  });

  // swipe on touch
  let startX = 0,
    dx = 0;
  track.addEventListener(
    "touchstart",
    (e) => {
      startX = e.touches[0].clientX;
      dx = 0;
      stop();
    },
    { passive: true }
  );
  track.addEventListener(
    "touchmove",
    (e) => {
      dx = e.touches[0].clientX - startX;
    },
    { passive: true }
  );
  track.addEventListener("touchend", () => {
    if (Math.abs(dx) > 40) dx < 0 ? nextSlide() : prevSlide();
    start();
  });

  // keyboard (when carousel is focused)
  root.setAttribute("tabindex", "0");
  root.addEventListener("keydown", (e) => {
    if (e.key === "ArrowRight") {
      nextSlide();
      restart();
    }
    if (e.key === "ArrowLeft") {
      prevSlide();
      restart();
    }
  });

  // init
  updateDots();
  start();
}

function renderPaidCarousel() {
  const track = $("#paid-track");
  if (!track) return;
  track.innerHTML = "";
  RECIPES.filter((r) => !r.free).forEach((r) => {
    const card = document.createElement("div");
    card.className = "carousel-slide";
    const owned = State.owned.includes(r.id);
    card.innerHTML = `
      <img src="${r.img}" alt="${r.title}">
      <div class="copy">
        <h3>${r.lang[State.lang] || r.title}</h3>
        <p class="muted">${r.teaser}</p>
        <div class="badges">
          ${r.sale ? '<span class="badge">SALE</span>' : ""}
          <span class="badge">${money(r.price)}</span>
        </div>
        <div class="actions">
          <button class="accent">${owned ? "Vizualizează" : "Cumpără"}</button>
          <button class="ghost" onclick="location.href='recipe.html?id=${
            r.id
          }'">Citește mai mult</button>
        </div>
      </div>`;
    card.querySelector(".accent").addEventListener("click", () => {
      if (owned) location.href = `recipe.html?id=${r.id}`;
      else addToCart(r.id);
    });
    track.appendChild(card);
  });
}

function renderFreeGrid() {
  const grid = $("#free-grid");
  if (!grid) return;
  grid.innerHTML = "";
  RECIPES.filter((r) => r.free).forEach((r) => {
    const el = document.createElement("article");
    el.className = "card";
    el.innerHTML = `
      <img src="${r.img}" alt="${r.title}">
      <div class="pad">
        <h4>${r.lang[State.lang] || r.title}</h4>
        <p class="muted">${r.teaser}</p>
        <button class="pill" onclick="location.href='recipe.html?id=${
          r.id
        }'">Deschide</button>
      </div>`;
    grid.appendChild(el);
  });
}

function renderSaleGrid() {
  const grid = $("#sale-grid");
  if (!grid) return;
  grid.innerHTML = "";
  RECIPES.filter((r) => r.sale).forEach((r) => {
    const el = document.createElement("article");
    el.className = "card";
    el.innerHTML = `
      <img src="${r.img}" alt="${r.title}">
      <div class="pad">
        <h4>${r.lang[State.lang] || r.title}</h4>
        <p class="muted">${r.teaser}</p>
        <div class="badges"><span class="badge">SALE</span><span class="badge">${money(
          r.price
        )}</span></div>
        <div class="actions">
          <button class="accent">Adaugă în coș</button>
        </div>
      </div>`;
    el.querySelector(".accent").addEventListener("click", () =>
      addToCart(r.id)
    );
    grid.appendChild(el);
  });
}

// ============ Products page ============
function renderProducts() {
  const tabs = $$(".tab");
  if (!tabs.length) return;
  const areas = {
    frupt: $("#tab-frupt"),
    post: $("#tab-post"),
    speciale: $("#tab-speciale"),
  };
  function fill() {
    areas.frupt.innerHTML = "";
    areas.post.innerHTML = "";
    areas.speciale.innerHTML = "";
    RECIPES.forEach((r) => {
      const card = document.createElement("article");
      card.className = "card";
      const owned = State.owned.includes(r.id);
      card.innerHTML = `
        <img src="${r.img}" alt="${r.title}">
        <div class="pad">
          <h4>${r.lang[State.lang] || r.title}</h4>
          <p class="muted">${r.teaser}</p>
          <div class="badges">
            ${
              r.free
                ? '<span class="badge">FREE</span>'
                : `<span class="badge">${money(r.price)}</span>`
            }
            ${r.vegan ? '<span class="badge">VEGAN</span>' : ""}
          </div>
          <div class="actions">
            ${
              r.free
                ? `<button class="pill" onclick="location.href='recipe.html?id=${r.id}'">Deschide</button>`
                : `<button class="accent">${
                    owned ? "Vizualizează" : "Cumpără"
                  }</button>`
            }
            <button class="ghost" onclick="location.href='recipe.html?id=${
              r.id
            }'">Detalii</button>
          </div>
        </div>`;
      if (!r.free) {
        card.querySelector(".accent").addEventListener("click", () => {
          owned ? (location.href = `recipe.html?id=${r.id}`) : addToCart(r.id);
        });
      }
      if (r.category === "main" || r.category === "dessert")
        areas.frupt.appendChild(card);
      if (r.vegan) areas.post.appendChild(card);
      if (r.sale) areas.speciale.appendChild(card);
    });
  }
  fill();
  tabs.forEach((t) =>
    t.addEventListener("click", () => {
      tabs.forEach((x) => x.classList.remove("active"));
      t.classList.add("active");
      $$(".tab-content").forEach((c) => c.classList.add("hidden"));
      $("#tab-" + t.dataset.tab).classList.remove("hidden");
    })
  );
}

// ============ Blog page ============
function renderBlog() {
  const blogList = $("#blog-list");
  if (blogList) {
    blogList.innerHTML = "";
    BLOG.forEach((p) => {
      const el = document.createElement("article");
      el.className = "card";
      el.innerHTML = `<img src="${p.img}" alt="${p.title}">
        <div class='pad'><h4>${p.title}</h4><p class='muted'>${p.excerpt}</p>
        <button class='pill'>Citește</button></div>`;
      blogList.appendChild(el);
    });
  }
  const alpha = $("#alpha-index");
  if (alpha) {
    const letters = "AĂÂBCDEFGHIÎJKLMNOPQRSȘTȚUVWXYZ".split("");
    letters.forEach((L) => {
      const b = document.createElement("button");
      b.textContent = L;
      b.addEventListener("click", () => {
        const zone = $("#alpha-results");
        zone.innerHTML = "";
        RECIPES.filter((r) =>
          (r.lang.ro || r.title).toUpperCase().startsWith(L)
        ).forEach((r) => {
          const item = document.createElement("article");
          item.className = "card";
          item.innerHTML = `<img src="${r.img}">
            <div class='pad'><h4>${r.lang.ro}</h4><p class='muted'>${r.teaser}</p>
            <button class='pill' onclick="location.href='recipe.html?id=${r.id}'">Deschide</button></div>`;
          zone.appendChild(item);
        });
      });
      alpha.appendChild(b);
    });
  }
  const menus = $("#menus-grid");
  if (menus) {
    MENUS.forEach((m) => {
      const el = document.createElement("article");
      el.className = "card";
      el.innerHTML = `<div class='pad'><h4>${m.title}</h4><ul>${m.items
        .map((i) => `<li>${i}</li>`)
        .join("")}</ul></div>`;
      menus.appendChild(el);
    });
  }
}

// ============ Recipe page ============
function renderRecipePage() {
  const wrap = document.getElementById("recipe-article");
  if (!wrap) return;

  // Verifică lista de rețete
  if (!Array.isArray(RECIPES) || RECIPES.length === 0) {
    wrap.innerHTML = `<p class="muted">Nu găsesc lista de rețete. Verifică <code>data.js</code>.</p>`;
    return;
  }
  // ID din URL (string!)
  const id = new URLSearchParams(location.search).get("id") || "";
  const params = new URLSearchParams(location.search);

  // Fără ID → oferă sugestii
  if (!id) {
    // fără id: oferă linkuri de test
    wrap.innerHTML = `
      <div class="pad">
        <h1>Rețetă</h1>
        <p class="muted">Nu ai specificat niciun ID de rețetă (<code>?id=...</code>).</p>
        <p>Încearcă unul dintre exemple:</p>
        <div class="chips">
          ${RECIPES.slice(0, 5)
            .map(
              (r) =>
                `<a class="chip" href="recipe.html?id=${r.id}">${
                  r.lang?.ro || r.title
                }</a>`
            )
            .join("")}
        </div>
      </div>`;
    return;
  }

  // Caută rețeta după ID (convertit la string)
  const r = RECIPES.find((x) => x.id === id);
  if (!r) {
    wrap.innerHTML = `
      <div class="pad">
        <h1>Rețetă</h1>
        <p class="muted">Nu găsesc rețeta cu id <code>${id}</code>.</p>
        <p>Exemple disponibile:</p>
        <div class="chips">
          ${RECIPES.slice(0, 5)
            .map(
              (r) =>
                `<a class="chip" href="recipe.html?id=${r.id}">${
                  r.lang?.ro || r.title
                }</a>`
            )
            .join("")}
        </div>
      </div>`;
    return;
  }

  const owned = r.free || State.owned.includes(r.id);
  document.title = (r.lang?.[State.lang] || r.title) + " • FoodieR";

  // Tabel nutrițional (suportă r.nutrition sau fallback pe carbs/protein/fat)
  const hasClassicMacros =
    r.carbs != null || r.protein != null || r.fat != null;
  const nutriTable = r.nutrition
    ? `<h3>Valori nutriționale (per porție)</h3>
         <table class="nutri-table"><tbody>
           ${Object.entries(r.nutrition)
             .map(([k, v]) => `<tr><th>${k}</th><td>${v}</td></tr>`)
             .join("")}
         </tbody></table>`
    : hasClassicMacros
    ? `<h3>Repartiție calorică</h3>
         <p>Carbo: ${r.carbs ?? "-"}g • Proteină: ${
        r.protein ?? "-"
      }g • Grăsime: ${r.fat ?? "-"}g</p>`
    : "";

  wrap.innerHTML = `
    <div class="hero">
      <img src="${r.img}" alt="${
    r.title
  }" onerror="this.src='assets/photos/placeholder.jpg'; this.alt='Imagine indisponibilă';">
      <div>
        <h1>${r.lang?.[State.lang] || r.title}</h1>
        <p class="muted">${r.teaser || ""}</p>
        <div class="badges">
          ${
            r.free
              ? '<span class="badge">FREE</span>'
              : `<span class="badge">${money(r.price)}</span>`
          }
          ${r.sale ? '<span class="badge">SALE</span>' : ""}
          ${r.vegan ? '<span class="badge">VEGAN</span>' : ""}
          ${r.kcal ? `<span class="badge">${r.kcal} kcal</span>` : ""}
        </div>
        ${
          r.free
            ? ""
            : `
          <div class="actions">
            <button class="accent" id="buyBtn">${
              owned ? "Deschide" : "Cumpără acum"
            }</button>
            <button class="ghost" onclick="addToCart('${
              r.id
            }')">Adaugă în coș</button>
          </div>`
        }
      </div>
    </div>

    <section class="pad ${owned ? "" : "locked"}" id="recipe-content">
      <h3>Ingrediente</h3>
      <ul>${(r.ingredients || []).map((i) => `<li>${i}</li>`).join("")}</ul>
      <h3>Mod de preparare</h3>
      <ol>${(r.steps || []).map((s) => `<li>${s}</li>`).join("")}</ol>
      ${
        r.carbs != null
          ? `<h3>Repartiție calorică</h3>
        <p>Carbo: ${r.carbs}g • Proteină: ${r.protein}g • Grăsime: ${r.fat}g</p>`
          : ""
      }
    </section>
  `;

  // Deblocare la cumpărare
  if (!r.free) {
    document.getElementById("buyBtn")?.addEventListener("click", () => {
      const alreadyOwned = State.owned.includes(r.id);
      if (alreadyOwned) {
        document.getElementById("recipe-content").classList.remove("locked");
      } else {
        addToCart(r.id);
      }
    });
  }

  // Recenzii
  const list = document.getElementById("reviews-list");
  const form = document.getElementById("review-form");
  if (list && form) {
    function loadReviews() {
      return JSON.parse(localStorage.getItem("reviews:" + r.id) || "[]");
    }
    function saveReviews(arr) {
      localStorage.setItem("reviews:" + r.id, JSON.stringify(arr));
    }
    function renderReviews() {
      const revs = loadReviews();
      list.innerHTML = revs.length
        ? ""
        : '<p class="muted">Fii primul care lasă o recenzie.</p>';
      revs.forEach((rv) => {
        const el = document.createElement("div");
        el.className = "card";
        el.innerHTML = `<div class='pad'><strong>${"★".repeat(
          rv.stars
        )}${"☆".repeat(5 - rv.stars)}</strong>
          <p>${rv.text}</p><div class='muted'>de ${rv.user} • ${new Date(
          rv.ts
        ).toLocaleString()}</div></div>`;
        list.appendChild(el);
      });
    }
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      if (!State.user) return alert("Autentifică-te pentru a lăsa o recenzie.");
      const stars = parseInt(document.getElementById("review-stars").value, 10);
      const text = document.getElementById("review-text").value.trim();
      if (!text) return;
      const revs = loadReviews();
      revs.unshift({ stars, text, user: State.user.email, ts: Date.now() });
      saveReviews(revs);
      document.getElementById("review-text").value = "";
      renderReviews();
    });
    renderReviews();
  }
}

// ============ Search ============
function initSearch() {
  const input = $("#search-input");
  if (!input) return;
  input.addEventListener("input", () => {
    const q = input.value.toLowerCase();
    const results = RECIPES.filter(
      (r) =>
        (r.lang.ro || r.title).toLowerCase().includes(q) ||
        (r.lang.en || "").toLowerCase().includes(q)
    );
    const grid = $("#free-grid");
    if (!grid) return;
    if (!q) {
      renderFreeGrid();
      return;
    }
    grid.innerHTML = "";
    results.forEach((r) => {
      const el = document.createElement("article");
      el.className = "card";
      el.innerHTML = `<img src="${r.img}">
        <div class='pad'><h4>${r.lang[State.lang] || r.title}</h4>
        <p class='muted'>${r.teaser}</p>
        <button class='pill' onclick="location.href='recipe.html?id=${
          r.id
        }'">Deschide</button></div>`;
      grid.appendChild(el);
    });
  });
}

// ============ Boot ============
function renderAll() {
  renderHero();
  renderPaidCarousel();
  renderFreeGrid();
  renderSaleGrid();
}

function initCartButtons() {
  $("#open-cart")?.addEventListener("click", openCart);
  $("#close-cart")?.addEventListener("click", closeCart);
  $("#checkout")?.addEventListener("click", checkout);
}

function init() {
  // base
  applyTheme();
  applyI18n();
  setYear();
  initHeader();
  initCartButtons();
  // per-page
  renderAll();
  renderProducts();
  renderBlog();
  renderRecipePage();
  initSearch();
}

document.addEventListener("DOMContentLoaded", init);

// ===== Helpers pentru carduri =====
function recipeTags(r) {
  const tags = [];
  // poți adapta după câmpurile tale
  if (r.category === "main") tags.push("entree");
  if (r.category === "dessert") tags.push("dessert");
  if (r.category === "soup") tags.push("soup");
  if (r.vegan) tags.push("vegan");
  if (r.glutenFree) tags.push("gluten-free");
  if (r.rice) tags.push("rice");
  return tags;
}

function recipeCardHTML(r, section) {
  const owned = State.owned.includes(r.id);
  const title = r.lang?.[State.lang] || r.title;

  const saleTag =
    section === "sale" && r.sale
      ? `<span class="tag tag-accent">SALE</span>`
      : "";

  const price = r.free
    ? ""
    : section === "sale" && r.oldPrice
    ? `<span class="price-old">${money(r.oldPrice)}</span>
         <span class="price-badge">${money(r.price)}</span>`
    : `<span class="price-badge">${money(r.price)}</span>`;

  // ⇩⇩⇩ schimbă CTA pentru FREE
  const cta = r.free
    ? `<a class="pill" href="recipe.html?id=${r.id}">Vizualizează</a>`
    : `<button class="accent" data-buy="${r.id}">${
        owned ? "Vizualizează" : "Cumpără"
      }</button>`;

  return `
    <article class="recipe-card ${r.free ? "is-free" : ""}" data-id="${r.id}">
      <div class="thumb"><img src="${
        r.img
      }" alt="${title}" loading="lazy"></div>
      <div class="body">
        <h3 class="title">${title}</h3>
        <p class="excerpt">"${r.teaser || ""}"</p>
        <div class="tags">
          ${saleTag}
          ${recipeTags(r)
            .map((t) => `<span class="tag">${t}</span>`)
            .join("")}
          ${
            r.vegetarian && !r.vegan
              ? '<span class="tag">vegetarian</span>'
              : ""
          }
        </div>
        <div class="meta">Autor: ${r.author || "FoodieR"}</div>
      </div>
      <div class="footer">
        ${price}
        <div class="card-actions">${cta}</div>
      </div>
    </article>`;
}

function bindCardActions(wrapper) {
  wrapper.querySelectorAll("[data-buy]").forEach((btn) => {
    const id = btn.getAttribute("data-buy");
    btn.addEventListener("click", () => {
      const r = RECIPES.find((x) => x.id === id);
      const owned = State.owned.includes(id);
      if (owned) location.href = `recipe.html?id=${id}`;
      else addToCart(id);
    });
  });
}

// ====== Renderers noi ======
function renderPaidCarousel() {
  // păstrăm numele pentru compatibilitate
  const grid = document.getElementById("paid-grid");
  if (!grid) return;
  grid.innerHTML = RECIPES.filter((r) => !r.free)
    .map((r) => recipeCardHTML(r, "paid"))
    .join("");
  bindCardActions(grid);
}

function renderFreeGrid() {
  const grid = document.getElementById("free-grid");
  if (!grid) return;
  grid.innerHTML = RECIPES.filter((r) => r.free)
    .map((r) => recipeCardHTML(r, "free"))
    .join("");
  bindCardActions(grid);
}

function renderSaleGrid() {
  const grid = document.getElementById("sale-grid");
  if (!grid) return;
  grid.innerHTML = RECIPES.filter((r) => r.sale)
    .map((r) => recipeCardHTML(r, "sale"))
    .join("");
  bindCardActions(grid);
}

function markActiveNav() {
  const normalize = (p) => p.replace(/\/index\.html?$/, "/").replace(/\/$/, "");
  const here = normalize(location.pathname);

  document.querySelectorAll("#nav-list a[href]").forEach((a) => {
    const aPath = normalize(
      new URL(a.getAttribute("href"), location.origin).pathname
    );
    const match =
      aPath === here ||
      (aPath === "" && here === "") ||
      (aPath === "/" && here === "/");
    a.classList.toggle("current", match);
    if (match) a.setAttribute("aria-current", "page");
    else a.removeAttribute("aria-current");
  });
}

// ----- Filter state -----
const Filter = {
  // author: "",
  tag: "",
  ingredient: "",
  // priceMin: "",
  // priceMax: "",
  // from: "",
  // to: "",
};

// returnează tag-urile pe care le folosești pe card
function recipeTags(r) {
  const tags = [];
  if (r.category === "main") tags.push("entree");
  if (r.category === "dessert") tags.push("dessert");
  if (r.category === "soup") tags.push("soup");
  if (r.vegan) tags.push("vegan");
  if (r.glutenFree) tags.push("gluten-free");
  if (r.vegetarian && !r.vegan) tags.push("vegetarian");
  if (r.rice) tags.push("rice");
  return tags;
}

//Inițializare: umple datalist-urile și leagă evenimente

function initFilters() {
  const by = (id) => document.getElementById(id);
  // const authors = new Set();
  const tags = new Set();
  const ingredients = new Set();

  (RECIPES || []).forEach((r) => {
    // authors.add((r.author || "FoodieR").trim());
    recipeTags(r).forEach((t) => tags.add(t));
    (Array.isArray(r.ingredients) ? r.ingredients : []).forEach((i) =>
      ingredients.add(i)
    );
  });

  // by("authors").innerHTML = [...authors]
  //   .sort()
  //   .map((a) => `<option value="${a}">`)
  //   .join("");
  by("tags").innerHTML = [...tags]
    .sort()
    .map((t) => `<option value="${t}">`)
    .join("");
  by("ingredients").innerHTML = [...ingredients]
    .sort()
    .map((i) => `<option value="${i}">`)
    .join("");

  const inputs = [
    // "f-author",
    "f-tag",
    "f-ingredient",
    // "f-price-min",
    // "f-price-max",
    // "f-date-from",
    // "f-date-to",
  ]
    .map((id) => by(id))
    .filter(Boolean);

  inputs.forEach((inp) => {
    inp.addEventListener("input", () => {
      // Filter.author = by("f-author")?.value.trim().toLowerCase() || "";
      Filter.tag = by("f-tag")?.value.trim().toLowerCase() || "";
      Filter.ingredient = by("f-ingredient")?.value.trim().toLowerCase() || "";
      // Filter.priceMin = by("f-price-min")?.value || "";
      // Filter.priceMax = by("f-price-max")?.value || "";
      // Filter.from = by("f-date-from")?.value || "";
      // Filter.to = by("f-date-to")?.value || "";
      rerenderWithFilters();
    });
  });

  by("f-clear")?.addEventListener("click", () => {
    inputs.forEach((i) => (i.value = ""));
    Object.keys(Filter).forEach((k) => (Filter[k] = ""));
    rerenderWithFilters();
  });
}

//Funcția care aplică filtrele
function getFiltered(list) {
  return list.filter((r) => {
    // author
    if (Filter.author) {
      const a = (r.author || "FoodieR").toLowerCase();
      if (!a.includes(Filter.author)) return false;
    }
    // tag
    if (Filter.tag) {
      const tgs = recipeTags(r).map((t) => t.toLowerCase());
      if (!tgs.some((t) => t.includes(Filter.tag))) return false;
    }
    // ingredient
    if (Filter.ingredient) {
      const ings = (r.ingredients || []).map((i) => String(i).toLowerCase());
      if (!ings.some((i) => i.includes(Filter.ingredient))) return false;
    }
    // price (doar pentru rețete cu preț)
    const price = r.free ? 0 : Number(r.price || 0);
    if (Filter.priceMin && price < Number(Filter.priceMin)) return false;
    if (Filter.priceMax && price > Number(Filter.priceMax)) return false;

    // date (așteaptă r.date = 'YYYY-MM-DD')
    // const d = r.date ? new Date(r.date) : null;
    // if (Filter.from && d && d < new Date(Filter.from)) return false;
    // if (Filter.to && d && d > new Date(Filter.to)) return false;

    return true;
  });
}

//Re-randare când se schimbă filtrele (nu îți stric funcțiile existente)
function rerenderWithFilters() {
  // păstrăm numele funcțiilor tale, dar filtrăm lista înainte
  const paidGrid = document.getElementById("paid-grid");
  if (paidGrid) {
    paidGrid.innerHTML = getFiltered(RECIPES.filter((r) => !r.free))
      .map((r) => recipeCardHTML(r, "paid"))
      .join("");
    bindCardActions(paidGrid);
  }

  const freeGrid = document.getElementById("free-grid");
  if (freeGrid) {
    freeGrid.innerHTML = getFiltered(RECIPES.filter((r) => r.free))
      .map((r) => recipeCardHTML(r, "free"))
      .join("");
    bindCardActions(freeGrid);
  }

  const saleGrid = document.getElementById("sale-grid");
  if (saleGrid) {
    saleGrid.innerHTML = getFiltered(RECIPES.filter((r) => r.sale))
      .map((r) => recipeCardHTML(r, "sale"))
      .join("");
    bindCardActions(saleGrid);
  }
}
// Pornește filtrele
function init() {
  applyTheme();
  applyI18n();
  setYear();
  initHeader();
  initCartButtons();

  initFilters(); // <— PORNEȘTE filtrele

  renderAll();
  renderProducts();
  renderBlog();
  renderRecipePage();
  initSearch();
}

function adjustForFixedHeader() {
  const h = document.getElementById("site-header");
  if (!h) return;
  if (window.matchMedia("(min-width: 992px)").matches) {
    document.documentElement.style.setProperty(
      "--header-h",
      h.offsetHeight + "px"
    );
  } else {
    document.documentElement.style.removeProperty("--header-h");
  }
}
window.addEventListener("load", adjustForFixedHeader);
window.addEventListener("resize", adjustForFixedHeader);

function labelMacro(k) {
  const map = {
    kcal: "Calorii",
    protein: "Proteină (g)",
    carbs: "Carbohidrați (g)",
    fat: "Grăsimi (g)",
    fiber: "Fibre (g)",
    sugar: "Zaharuri (g)",
  };
  return map[k] || k;
}

function renderRecipePage() {
  const wrap = $("#recipe-article");
  if (!wrap) return;

  const id = new URLSearchParams(location.search).get("id");
  const r = RECIPES.find((x) => x.id === id) || RECIPES[0];
  const owned = r.free || State.owned.includes(r.id);

  document.title = (r.lang?.[State.lang] || r.title) + " • FoodieR";

  const mainMedia =
    (r.gallery && r.gallery[0]) || r.img || "assets/photos/placeholder.jpg";

  wrap.innerHTML = `
    <header class="recipe-hero">
      <div class="media" id="mediaBox">
        ${
          r.video
            ? `<iframe class="video" src="${r.video}" title="Video" frameborder="0" allowfullscreen></iframe>`
            : `<img id="media-main" src="${mainMedia}" alt="${r.title}">`
        }
        <div class="thumbs" id="thumbs">
          ${
            r.gallery
              ? r.gallery
                  .map(
                    (src) => `
            <button class="t" data-type="img" data-src="${src}">
              <img src="${src}" alt="">
            </button>`
                  )
                  .join("")
              : ""
          }
          ${
            r.video
              ? `<button class="t" data-type="video" data-src="${r.video}">▶</button>`
              : ""
          }
        </div>
      </div>

      <div class="meta">
        <h1>${r.lang?.[State.lang] || r.title}</h1>
        <p class="muted">${r.teaser || ""}</p>

        <div class="badges">
          ${
            r.free
              ? '<span class="badge">FREE</span>'
              : `<span class="badge">${money(r.price)}</span>`
          }
          ${r.vegan ? '<span class="badge">VEGAN</span>' : ""}
          ${
            r.nutrition?.kcal
              ? `<span class="badge">${r.nutrition.kcal} kcal</span>`
              : ""
          }
        </div>

        ${
          r.free
            ? ""
            : `
        <div class="actions">
          <button class="accent" id="buyBtn">${
            owned ? "Deschide" : "Cumpără acum"
          }</button>
        </div>`
        }

        <div class="fact-grid">
          ${r.time ? `<div><strong>⏱</strong><span>${r.time}</span></div>` : ""}
          ${
            r.servings
              ? `<div><strong>🍽</strong><span>${r.servings} porții</span></div>`
              : ""
          }
          ${
            r.difficulty
              ? `<div><strong>⚙️</strong><span>${r.difficulty}</span></div>`
              : ""
          }
        </div>
      </div>
    </header>

    <section id="recipe-content" class="${owned ? "" : "locked"}">
      <div class="two-col">
        <div>
          <h3>Ingrediente</h3>
          <ul class="ing-list">
            ${r.ingredients
              .map(
                (i) => `<li><label><input type="checkbox"> ${i}</label></li>`
              )
              .join("")}
          </ul>
          <button class="pill" id="copyIng">Copiază lista</button>
        </div>

        <div>
          <h3>Mod de preparare</h3>
          <ol class="steps">${r.steps.map((s) => `<li>${s}</li>`).join("")}</ol>
        </div>
      </div>

      ${
        r.nutrition
          ? `
      <h3>Valori nutriționale (per porție)</h3>
      <table class="nutri-table">
        <tbody>
          ${Object.entries(r.nutrition)
            .map(([k, v]) => `<tr><th>${labelMacro(k)}</th><td>${v}</td></tr>`)
            .join("")}
        </tbody>
      </table>`
          : ""
      }
    </section>
  `;

  // thumbs: schimbă media
  $("#thumbs")
    ?.querySelectorAll(".t")
    .forEach((btn) => {
      btn.addEventListener("click", () => {
        const type = btn.dataset.type;
        const src = btn.dataset.src;
        const box = $("#mediaBox");
        if (type === "video") {
          box.querySelector(".video")?.remove();
          box.querySelector("#media-main")?.remove();
          box.insertAdjacentHTML(
            "afterbegin",
            `<iframe class="video" src="${src}" title="Video" frameborder="0" allowfullscreen></iframe>`
          );
        } else {
          const img = box.querySelector("#media-main");
          if (img) img.src = src;
          else {
            box.querySelector(".video")?.remove();
            box.insertAdjacentHTML(
              "afterbegin",
              `<img id="media-main" src="${src}" alt="${r.title}">`
            );
          }
        }
      });
    });

  // buton cumpărare / deblocare
  if (!r.free) {
    $("#buyBtn")?.addEventListener("click", () => {
      if (owned) {
        $("#recipe-content").classList.remove("locked");
      } else {
        addToCart(r.id);
      }
    });
  }

  // copiere ingrediente
  $("#copyIng")?.addEventListener("click", () => {
    const text = r.ingredients.join("\n");
    navigator.clipboard?.writeText(text);
    alert("Lista de ingrediente a fost copiată.");
  });

  /* === Reviews rămân ca înainte === */
  const list = $("#reviews-list");
  const form = $("#review-form");
  function loadReviews() {
    return JSON.parse(localStorage.getItem("reviews:" + r.id) || "[]");
  }
  function saveReviews(v) {
    localStorage.setItem("reviews:" + r.id, JSON.stringify(v));
  }
  function renderReviews() {
    const revs = loadReviews();
    list.innerHTML = revs.length
      ? ""
      : '<p class="muted">Fii primul care lasă o recenzie.</p>';
    revs.forEach((rv) => {
      const el = document.createElement("div");
      el.className = "card";
      el.innerHTML = `<div class="pad"><strong>${"★".repeat(
        rv.stars
      )}${"☆".repeat(5 - rv.stars)}</strong>
        <p>${rv.text}</p><div class="muted">de ${rv.user} • ${new Date(
        rv.ts
      ).toLocaleString()}</div></div>`;
      list.appendChild(el);
    });
  }
  form?.addEventListener("submit", (e) => {
    e.preventDefault();
    if (!State.user) {
      alert("Autentifică-te pentru a lăsa o recenzie.");
      return;
    }
    const stars = parseInt($("#review-stars").value, 10);
    const text = $("#review-text").value.trim();
    if (!text) return;
    const revs = loadReviews();
    revs.unshift({ stars, text, user: State.user.email, ts: Date.now() });
    saveReviews(revs);
    $("#review-text").value = "";
    renderReviews();
  });
  renderReviews();
}
