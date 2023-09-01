import {API_URL, RES_PER_PAGE} from './config';
import {getJSON} from './helpers';

export const state = {
    recipe: {},
    search: {
      query: '',
      results: [],
      page: 1,
      resultPerPage: RES_PER_PAGE
    }
}

export const loadRecipe = async function(id){
  try{
    const data = await getJSON(`${API_URL}${id}`)
    const {recipe} = data.data
    state.recipe = {
      cookingTime: recipe.cooking_time,
      id: recipe.id,
      imageUrl: recipe.image_url,
      ingredients: recipe.ingredients,
      publisher: recipe.publisher,
      servings: recipe.servings,
      sourceUrl: recipe.source_url,
      title: recipe.title
    }
    console.log(state.recipe);
  }  catch(err){
    console.error(`${err} ********`);
    throw err;
  }
}

export const loadSearchResult = async function(query){
  try{
    const data = await getJSON(`${API_URL}?search=${query}`);
    
    state.search.results = data.data.recipes.map(rec=>{
      return {
        id: rec.id,
        imageUrl: rec.image_url,
        publisher: rec.publisher,
        title: rec.title
      }
    })

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