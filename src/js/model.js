import { async } from 'regenerator-runtime';
import { API_URL, RES_PER_PAGE, KEY } from './config.js';
// import { getJSON, sendJSON } from './helpers.js';
import { AJAX } from './helpers.js';

export const state = {
  recipe: {},
  search: {
    query: '',
    results: [],
    page: 1,
    resultsPerPage: RES_PER_PAGE,
  },
  bookmarks: [],
};

const createRecipeObject = function (data) {
  // Creating a new recipe obj with JavaScript friendly properties
  const { recipe } = data.data;
  return {
    id: recipe.id,
    title: recipe.title,
    publisher: recipe.publisher,
    image: recipe.image_url,
    sourceUrl: recipe.source_url,
    servings: recipe.servings,
    cookingTime: recipe.cooking_time,
    ingredients: recipe.ingredients,
    ...(recipe.key && { key: recipe.key }),
  };
};

export const loadRecipe = async function (id) {
  try {
    const data = await AJAX(`${API_URL}${id}?key=${KEY}`);

    // Creating recipe object with camelCase properties
    state.recipe = createRecipeObject(data);

    if (state.bookmarks.some(bookmark => bookmark.id === id))
      state.recipe.bookmarked = true;
    else state.recipe.bookmarked = false;
  } catch (err) {
    // Temp error handling
    console.error(`${err} 💥💥💥💥`);
    throw err;
  }
};

export const loadSearchResults = async function (query) {
  try {
    state.search.query = query;

    // Making AJAX call
    const data = await AJAX(`${API_URL}?search=${query}&key=${KEY}`);

    // Creating a new Obj and updating the state recipe property

    state.search.results = data.data.recipes.map(recipe => {
      return {
        id: recipe.id,
        title: recipe.title,
        publisher: recipe.publisher,
        image: recipe.image_url,
        ...(recipe.key && { key: recipe.key }),
      };
    });

    // Resetting the page back to default (1)
    state.search.page = 1;
  } catch (err) {
    console.error(`${err} 💥💥💥💥`);
    throw err;
  }
};

export const getSearchResultsPage = function (page = state.search.page) {
  // Updating state.search.page
  state.search.page = page;

  const start = (page - 1) * state.search.resultsPerPage; // 0
  const end = page * state.search.resultsPerPage; // 9

  return state.search.results.slice(start, end);
};

export const updateServings = function (newServings) {
  // Updating the quantity property of each ingr in the ingr array
  state.recipe.ingredients.forEach(ingr => {
    // newQt = oldQt * newServings / oldServings
    ingr.quantity = ingr.quantity * (newServings / state.recipe.servings);
  });

  //   Updating the servings in the state
  state.recipe.servings = newServings;
};

// Function for storing data to locale storage
const persistBookmarks = function () {
  localStorage.setItem('bookmarks', JSON.stringify(state.bookmarks));
};

export const addBookmark = function (recipe) {
  // Add bookmark
  state.bookmarks.push(recipe);

  //   Mark current recipe as bookmarked
  if (recipe.id === state.recipe.id) state.recipe.bookmarked = true;

  //   Storing bookmarked data to localStorage
  persistBookmarks();
};

export const deleteBookmark = function (id) {
  // Locating index of id in the bookmark array
  const index = state.bookmarks.findIndex(el => el.id === id);
  // Remove bookmark by remove recipe with matching id from bookmarks
  if (index > -1) state.bookmarks.splice(index, 1);

  //   Marking current recipe as NOT bookmarked
  if (id === state.recipe.id) state.recipe.bookmarked = false;

  //   Updating bookmarks data in localStorage
  persistBookmarks();
};

const init = function () {
  // Getting data from localStorage
  const storage = localStorage.getItem('bookmarks');

  //   Checking if data exist and storing it to state.bookmarks
  if (storage) state.bookmarks = JSON.parse(storage);
};
init();

const clearBookmarks = function () {
  localStorage.clear('bookmarks');
};

// clearBookmarks();

export const uploadRecipe = async function (newRecipe) {
  try {
    const ingredients = Object.entries(newRecipe)
      .filter(entry => entry[0].startsWith('ingredient') && entry[1] !== '')
      .map(ingredient => {
        const ingredientArr = ingredient[1]
          .split(',')
          .map(ingred => ingred.trim(''));

        if (ingredientArr.length !== 3)
          throw new Error(
            'Wrong ingredient format! Please use the correct format :)',
          );

        const [quantity, unit, description] = ingredientArr;

        return { quantity: quantity ? +quantity : null, unit, description };
      });

    const recipe = {
      title: newRecipe.title,
      publisher: newRecipe.publisher,
      image_url: newRecipe.image,
      source_url: newRecipe.sourceUrl,
      servings: +newRecipe.servings,
      cooking_time: +newRecipe.cookingTime,
      ingredients,
    };

    // Making an AJAX call
    const data = await AJAX(`${API_URL}?key=${KEY}`, recipe);
    state.recipe = createRecipeObject(data);
    addBookmark(state.recipe);
  } catch (err) {
    throw err;
  }
};
