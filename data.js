const CATEGORIES = [
  {
    id: "main",
    nameRO: "Fel Principal",
    nameEN: "Mains",
    img: "assets/photos/FelPrincipal.jpg",
    descRO: "Preparate sățioase, cu mai puține calorii.",
    descEN: "Hearty mains with fewer calories.",
  },
  {
    id: "dessert",
    nameRO: "Desert",
    nameEN: "Dessert",
    img: "assets/photos/AlbaCaZapada.png",
    descRO: "Dulce fără vină.",
    descEN: "Sweet without the guilt.",
  },
  {
    id: "soup",
    nameRO: "Ciorbă",
    nameEN: "Soup",
    img: "assets/photos/Ciorba.jpg",
    descRO: "Confort în bol.",
    descEN: "Comfort in a bowl.",
  },
  {
    id: "special",
    nameRO: "Rețete speciale",
    nameEN: "Special Recipes",
    img: "assets/photos/ReteteSpeciale.jpg",
    descRO: "Colecții tematice și exclusivități.",
    descEN: "Thematic collections & exclusives.",
  },
];

// Minimal recipe records
const RECIPES = [
  {
    // adaugă în array-ul RECIPES:

    id: "turbo-veggie-soup", // unic!
    title: "Turbo Veggie Soup", // fallback dacă lipsește lang[...]
    lang: { ro: "Supă Turbo de Legume", en: "Turbo Veggie Soup" },
    teaser: "Ușoară și plină de nutrienți.",
    img: "assets/photos/FelPrincipal.jpg", // cale corectă!
    free: true, // ← important pentru Free Recipes
    category: "soup", // "main" | "dessert" | "soup" etc.
    vegan: true, // pentru tag-uri
    author: "FoodieR", // opțional (default: FoodieR)
    price: 15, // prețul redus
    oldPrice: 29, // (opțional) preț vechi pt. tăiat
    // câmpuri pentru pagina de rețetă (se afișează după click):
    kcal: 160,
    carbs: 22,
    protein: 6,
    fat: 3,
    ingredients: ["1 ceapă", "2 morcovi", "1 dovlecel", "apă, sare, piper"],
    steps: ["Călește ceapa", "Adaugă legumele", "Fierbe 20 min", "Blendează."],
  },

  {
    id: "r3",
    title: "Ciorbă de legume turbo",
    lang: { ro: "Ciorbă de legume turbo", en: "Turbo Veggie Soup" },
    category: "soup",
    price: 0,
    sale: false,
    free: true,
    vegan: true,
    kcal: 120,
    carbs: 18,
    protein: 4,
    fat: 3,
    img: "assets/photos/AlbaCaZapada.png",
    teaser: "Ușoară și plină de nutrienți.",
    ingredients: ["morcov", "țelină", "ardei", "dovlecel", "roșii"],
    steps: ["Taie legumele.", "Fierbe 20 min.", "Potrivește de sare."],
  },
  {
    id: "r4",
    title: "Brownie de fasole neagră",
    lang: { ro: "Brownie de fasole neagră", en: "Black Bean Brownie" },
    category: "dessert",
    price: 12,
    sale: false,
    free: false,
    vegan: true,
    kcal: 210,
    carbs: 25,
    protein: 8,
    fat: 7,
    img: "assets/photos/Colaboration.png",
    teaser: "Ciocolatos și surprinzător de lejer.",
    ingredients: ["fasole neagră fiartă", "cacao", "ovăz", "banană"],
    steps: ["Blenduiește.", "Toarnă în tavă.", "Coace 18 min."],
  },

  {
    id: "r5",
    title: "Pizza proteinată la tigaie",
    lang: { ro: "Pizza proteinată la tigaie", en: "Skillet Protein Pizza" },
    category: "main",
    price: 14,
    sale: false,
    free: false,
    vegan: false,
    kcal: 330,
    carbs: 30,
    protein: 30,
    fat: 10,
    img: "assets/placeholders/recipe-5.jpg",
    teaser: "Blat rapid din iaurt și făină integrală.",
    ingredients: [
      "iaurt",
      "făină integrală",
      "sos roșii",
      "șuncă de curcan",
      "mozzarella light",
    ],
    steps: [
      "Frământă blatul.",
      "Prăjește ușor.",
      "Adaugă topping și acoperă 5 min.",
    ],
  },
  {
    id: "lemon-cheesecake-light",
    title: "Lemon Cheesecake Light",
    lang: {
      ro: "Cheesecake cu lămâie",
      en: "Lemon Cheesecake",
    },
    teaser: "Desert fresh, cu mai puțin zahăr.",
    img: "assets/photos/Colaboration.png",
    free: true,
    category: "dessert",
    vegan: false,
    author: "FoodieR",
    kcal: 210,
    carbs: 24,
    protein: 10,
    fat: 8,
    ingredients: [
      "250 g brânză slabă",
      "iaurt grecesc light",
      "gelatină",
      "lămâie",
    ],
    steps: ["Amestecă baza", "Gelatina încorporează", "Toarnă și răcește 3h"],
  },
  {
    id: "veggie-wrap-rapid",
    title: "Veggie Wrap Rapid",
    lang: { ro: "Wrap de legume rapid", en: "Quick Veggie Wrap" },
    teaser: "Prânz la pachet în 10 minute.",
    img: "assets/photos/FelPrincipal.jpg",
    free: true,
    category: "main",
    vegan: true,
    author: "FoodieR",
    kcal: 320,
    carbs: 44,
    protein: 11,
    fat: 10,
    ingredients: ["lipie integrală", "hummus", "salată", "ardei", "roșii"],
    steps: ["Unge lipia cu hummus", "Adaugă legumele", "Rulează și servește"],
  },
  //sale recipes
  // în array-ul RECIPES
  {
    id: "no-bake-cheesecake",
    title: "No-bake Cheesecake",
    lang: { ro: "Cheesecake fără coacere", en: "No-bake Cheesecake" },
    teaser: "Cremă catifelată, îndulcită responsabil.",
    img: "assets/photos/FelPrincipal.jpg", // ← asigură-te că există!
    category: "dessert",
    vegan: false,
    free: false,
    sale: true, // ← face să apară în Special Sale + BOGO
    price: 15, // prețul redus
    oldPrice: 29, // (opțional) preț vechi pt. tăiat
    author: "FoodieR",
    kcal: 260,
    carbs: 21,
    protein: 12,
    fat: 9,
    ingredients: ["..."],
    steps: ["..."],
  },
  {
    id: "green-pasta-sale",
    title: "Green Pasta",
    lang: { ro: "Paste verzi", en: "Green Pasta" },
    teaser: "Rapid, fresh, sățios.",
    img: "assets/photos/FelPrincipal.jpg",
    category: "main",
    vegan: true,
    free: false,
    sale: true,
    price: 12,
    oldPrice: 24,
  },
  // în array-ul RECIPES
  {
    id: "no-bake-cheesecake",
    title: "No-bake Cheesecake",
    lang: { ro: "Cheesecake fără coacere", en: "No-bake Cheesecake" },
    teaser: "Cremă catifelată, îndulcită responsabil.",
    img: "assets/photos/FelPrincipal.jpg", // ← asigură-te că există!
    category: "dessert",
    vegan: false,
    free: false,
    sale: true, // ← face să apară în Special Sale + BOGO
    price: 15, // prețul redus
    oldPrice: 29, // (opțional) preț vechi pt. tăiat
    author: "FoodieR",
    kcal: 260,
    carbs: 21,
    protein: 12,
    fat: 9,
    ingredients: ["..."],
    steps: ["..."],
  },
  {
    id: "no-bake-cheesecake",
    title: "No-bake Cheesecake",
    lang: { ro: "Cheesecake fără coacere", en: "No-bake Cheesecake" },
    teaser: "Cremă catifelată, îndulcită responsabil.",
    img: "assets/photos/FelPrincipal.jpg", // ← asigură-te că există!
    category: "dessert",
    vegan: false,
    free: false,
    sale: true, // ← face să apară în Special Sale + BOGO
    price: 15, // prețul redus
    oldPrice: 29, // (opțional) preț vechi pt. tăiat
    author: "FoodieR",
    kcal: 260,
    carbs: 21,
    protein: 12,
    fat: 9,
    ingredients: ["..."],
    steps: ["..."],
  },
];

// Blog posts
const BLOG = [
  {
    id: "b1",
    title: "Mindful eating în 5 pași",
    excerpt: "Mic ghid pentru a mânca prezent.",
    img: "assets/hero-main.jpg",
  },
  {
    id: "b2",
    title: "Cum reduc sarea fără să pierd gustul",
    excerpt: "Trucuri pentru a condimenta deștept.",
    img: "assets/hero-soup.jpg",
  },
];

// Example menus
const MENUS = [
  {
    id: "m1",
    title: "Meniu 1600 kcal",
    items: [
      "Mic dejun: bowl proteic",
      "Prânz: Lasagna ușoară",
      "Cină: Ciorbă de legume",
    ],
  },
  {
    id: "m2",
    title: "Meniu vegan 1800 kcal",
    items: [
      "Mic dejun: Overnight oats",
      "Prânz: Brownie? De ce nu!",
      "Cină: Supă densă de legume",
    ],
  },
];
