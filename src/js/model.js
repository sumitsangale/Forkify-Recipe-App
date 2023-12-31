import {API_URL, RES_PER_PAGE, KEY} from './config';
import {getJSON, sendJSON} from './helpers';

export const state = {
    recipe: {},
    search: {
      query: '',
      results: [],
      page: 1,
      resultPerPage: RES_PER_PAGE
    },
    bookmarks: []
}

const createRecipeObject = function(data){
  const {recipe} = data.data
  return {
    cookingTime: recipe.cooking_time,
    id: recipe.id,
    imageUrl: recipe.image_url,
    ingredients: recipe.ingredients,
    publisher: recipe.publisher,
    servings: recipe.servings,
    sourceUrl: recipe.source_url,
    title: recipe.title,
    ...(recipe.key && {key: recipe.key})
  }
}

export const loadRecipe = async function(id){
  try{
    const data = await getJSON(`${API_URL}${id}?key=${KEY}`)
    state.recipe = createRecipeObject(data);

    if(state.bookmarks.some(bookmark => bookmark.id === id)){
      state.recipe.bookmarked = true;
    } else {
      state.recipe.bookmarked = false;
    }
    console.log(state.recipe);
  }  catch(err){
    console.error(`${err} ********`);
    throw err;
  }
}

export const loadSearchResult = async function(query){
  try{
    const data = await getJSON(`${API_URL}?search=${query}&key=${KEY}`);
    
    state.search.results = data.data.recipes.map(rec=>{
      return {
        id: rec.id,
        imageUrl: rec.image_url,
        publisher: rec.publisher,
        title: rec.title,
        ...(rec.key && {key: rec.key})
      }
    })
    state.search.page = 1;

  } catch(err){
    console.error(`${err} ********`);
    throw err;
  }
}

export const getSearchResultPage = function(page = state.search.page){
  state.search.page = page;
  const start = (page - 1) * state.search.resultPerPage;
  const end = page * state.search.resultPerPage;

  return state.search.results.slice(start, end);
}

export const updateServings = function(newServings){
  state.recipe.ingredients.forEach((ing)=>{
    ing.quantity = ing.quantity * newServings / state.recipe.servings;
  })

  state.recipe.servings = newServings;
}

const persistBookmarks = function(){
  localStorage.setItem('bookmarks', JSON.stringify(state.bookmarks));
}

export const addBookmark = function(recipe){
  //add bookmarks
  state.bookmarks.push(recipe);

  //mark current recipe as bookmarkd
  if(recipe.id === state.recipe.id) state.recipe.bookmarked = true;

  //save in localstorage
  persistBookmarks();
}

export const deleteBookmark = function(id){
  //delete bookmarks
  const index = state.bookmarks.findIndex(el => el.id === id);
  state.bookmarks.splice(index, 1);

  //mark current recipe as not bookmarkd
  if(id === state.recipe.id) state.recipe.bookmarked = false;

  //save in localstorage
  persistBookmarks();
}

export const uploadRecipe = async function(newRecipe){
  try{
    const ingredients = Object.entries(newRecipe).filter( entry => entry[0].startsWith('ingredient') && entry[1] !== '').map(ing => {
      const ingArr = ing[1].replaceAll(' ', '').split(',');
      if(ingArr.length  !== 3) throw new Error("Wrong ingredient format! Please use correct format.")

      const [quantity, unit, description] = ingArr;
      return {quantity: quantity ? +quantity : null, unit, description};
    })

    const recipe = {
      title: newRecipe.title,
      cooking_time: newRecipe.cookingTime,
      image_url: newRecipe.image,
      publisher: newRecipe.publisher,
      servings: newRecipe.servings,
      source_url: newRecipe.sourceUrl,
      ingredients
    }
    const data = await sendJSON(`${API_URL}?key=${KEY}`, recipe);
    state.recipe = createRecipeObject(data);
    addBookmark(state.recipe);
  }catch(err){
    throw err;
  }
}

const init = function(){
  const storage = localStorage.getItem('bookmarks')
  if(storage) state.bookmarks = JSON.parse(storage);
}

const clearStorage = function(){
  localStorage.clear('bookmarks');
}

/////////////////////////////////////////
init();