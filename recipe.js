document.addEventListener("DOMContentLoaded", () => {
  const wrap = document.getElementById("recipe-article");
  if (!wrap) return;

  const id = new URLSearchParams(location.search).get("id");
  if (!id) {
    wrap.innerHTML = `<p class="muted">Lipsește parametrul <code>?id=...</code>.</p>`;
    return;
  }
  const r = (window.RECIPES || []).find((x) => x.id === id);
  if (!r) {
    wrap.innerHTML = `<p class="muted">Nu găsesc rețeta cu id <code>${id}</code>.</p>`;
    return;
  }

  document.title = (r.lang?.ro || r.title) + " • FoodieR";
  const nutrition =
    r.nutrition ||
    (r.kcal
      ? { kcal: r.kcal, protein: r.protein, carbs: r.carbs, fat: r.fat }
      : null);

  wrap.innerHTML = `
    <header class="recipe-hero">
      <div class="media">
        <img src="${r.img}" alt="${
    r.title
  }" onerror="this.src='assets/photos/placeholder.jpg'">
      </div>
      <div class="meta">
        <h1>${r.lang?.ro || r.title}</h1>
        <p class="muted">${r.teaser || ""}</p>
        <div class="badges">
          ${
            r.free
              ? '<span class="badge">FREE</span>'
              : `<span class="badge">${(r.price || 0).toFixed(0)} lei</span>`
          }
          ${r.sale ? '<span class="badge">SALE</span>' : ""}
          ${r.vegan ? '<span class="badge">VEGAN</span>' : ""}
          ${
            nutrition?.kcal
              ? `<span class="badge">${nutrition.kcal} kcal</span>`
              : ""
          }
        </div>
      </div>
    </header>

    <section class="pad">
      <div class="two-col">
        <div>
          <h3>Ingrediente</h3>
          <ul class="ing-list">
            ${(r.ingredients || []).map((i) => `<li>${i}</li>`).join("")}
          </ul>
        </div>
        <div>
          <h3>Mod de preparare</h3>
          <ol class="steps">
            ${(r.steps || []).map((s) => `<li>${s}</li>`).join("")}
          </ol>
        </div>
      </div>

      ${
        nutrition
          ? `
      <h3>Valori nutriționale (per porție)</h3>
      <table class="nutri-table">
        <tbody>
          ${Object.entries(nutrition)
            .map(([k, v]) => `<tr><th>${labelMacro(k)}</th><td>${v}</td></tr>`)
            .join("")}
        </tbody>
      </table>`
          : ""
      }
    </section>
  `;

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
});
