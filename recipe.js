document.addEventListener("DOMContentLoaded", () => {
  const params = new URLSearchParams(window.location.search);
  const recipeId = params.get("id");

  const recipe = RECIPES.find((r) => r.id === recipeId);

  if (!recipe) {
    document.getElementById("recipe-article").innerHTML =
      "<p>Rețetă negăsită.</p>";
    return;
  }

  // Nume în funcție de limbă
  let name = recipe.title;
  if (recipe.lang) {
    name = State?.lang === "en" ? recipe.lang.en : recipe.lang.ro;
  }

  // Descriere
  const desc = recipe.teaser || "";

  document.getElementById("recipe-article").innerHTML = `
    <h1>${name}</h1>
    <img src="${
      recipe.img
    }" alt="${name}" style="max-width:100%; border-radius:8px;">
    
    ${recipe.kcal ? `<p><strong>Calorii:</strong> ${recipe.kcal} kcal</p>` : ""}
    ${
      recipe.carbs
        ? `<p><strong>Carbohidrați:</strong> ${recipe.carbs} g</p>`
        : ""
    }
    ${
      recipe.protein
        ? `<p><strong>Proteine:</strong> ${recipe.protein} g</p>`
        : ""
    }
    ${recipe.fat ? `<p><strong>Grăsimi:</strong> ${recipe.fat} g</p>` : ""}

    <p>${desc}</p>

    <h2>Ingrediente</h2>
    <ul>${(recipe.ingredients || []).map((i) => `<li>${i}</li>`).join("")}</ul>

    <h2>Instrucțiuni</h2>
    <ol>${(recipe.steps || []).map((step) => `<li>${step}</li>`).join("")}</ol>
  `;
});
