const ingredientInput = document.querySelector("#ingredient");
const form = document.querySelector("form");
const recipesListSection = document.querySelector(".recipes-list");
const favoriteRecipes = document.querySelector(".favorite-recipes");

// Get one random recipe
async function getRandomRecipe() {
  const response = await fetch(
    "https://www.themealdb.com/api/json/v1/1/random.php"
  );
  const randomRecipe = await response.json();
  return randomRecipe;
}

// Get recipes based on the input of the user
async function getRecipeBasedOnInput(input) {
  const response = await fetch(
    `https://www.themealdb.com/api/json/v1/1/search.php?s=${input}`
  );
  const recipes = await response.json();
  return recipes;
}

// Get unique recipe based on id
async function getSingleRecipe(id) {
  const response = await fetch(
    `https://www.themealdb.com/api/json/v1/1/lookup.php?i=${id}`
  );
  const recipe = await response.json();
  return recipe;
}

// Creates the markup for the container that contains the recipe
function createRecipeContainer(image, title, id) {
  const containerHTML = `<article class="recipe-container" data-id=${id}>
    <img
      src=${image}
      alt="${title}"
    />
    <div class="details">
      <h3>${title}</h3>
      <i class="fas fa-2x fa-heart favorite-button"></i>
    </div>
  </article>`;
  return containerHTML;
}

// Displays the random recipe in the DOM
async function displayRandomRecipe() {
  const randomRecipe = await getRandomRecipe();
  const {
    idMeal: id,
    strMeal: title,
    strMealThumb: image
  } = randomRecipe.meals[0];
  const randomRecipeContainer = createRecipeContainer(image, title, id);
  recipesListSection.innerHTML = randomRecipeContainer;
  addRecipeToFavorites();
}

// Makes the api call to get a random recipe
form.addEventListener("submit", async (e) => {
  e.preventDefault();
  const meals = await getRecipeBasedOnInput(ingredientInput.value);
  const mealsContainers = meals.meals.map((meal) => {
    return createRecipeContainer(meal.strMealThumb, meal.strMeal, meal.idMeal);
  });
  recipesListSection.innerHTML = mealsContainers.join("");
  addRecipeToFavorites();
});

// Adds the recipe to favorites
function addRecipeToFavorites() {
  const heartButtons = Array.from(
    document.querySelectorAll(".details i.favorite-button")
  );
  heartButtons.forEach((heartButton) => {
    heartButton.addEventListener("click", function (e) {
      // Change style
      this.style.color = "red";
      // Add recipe to favorites
      let id = this.parentElement.parentElement.dataset.id;
      const recipeSelected = document.querySelector(`article[data-id="${id}"]`);
      let image = recipeSelected.querySelector("img").src;
      let title = recipeSelected.querySelector(".details h3");
      saveFavoriteMeal(id, image, title);
    });
  });
}

function saveFavoriteMeal(id, image, title) {
  const figureMarkup = `
    <figure>
    <img
      data-id=${id}
      src=${image}
      alt="${title}"
    />
    <i class="fas fa-times-circle"></i>
  </figure>
  `;
  favoriteRecipes.innerHTML += figureMarkup;
}

displayRandomRecipe();
