// import icons from 'url:../img/icons.svg';
import 'core-js/stable';
import 'regenerator-runtime/runtime';
import * as model from './model';
import recipeView from './views/recipeView';
import searchView from './views/searchView';
import resultsView from './views/resultsView';
import paginationView from './views/paginationView';

// https://forkify-api.herokuapp.com/v2
///////////////////////////////////////

const controlReceipe = async function(){
  try{
    //get hash Id
    let id = window.location.hash.slice(1);
    //5ed6604591c37cdc054bc886
    if(!id) return;
    recipeView.renderSpinner();
    
    //update selected search result
    resultsView.update(model.getSearchResultPage());

    //get recipe
    await model.loadRecipe(id);
    
    //render recipe
    recipeView.render(model.state.recipe);

  } catch(err){
    recipeView.renderError();
  }
}

const controlSearchResult = async function(){
  try{
    resultsView.renderSpinner();
    //get query
    const query = searchView.getQuery();
    if(!query) return;

    //load search result
    await model.loadSearchResult(query);

    //render result
    resultsView.render(model.getSearchResultPage());

    //render pagination btn
    paginationView.render(model.state.search);

  }catch(err){
    console.log(err);
  }
}

const controlPagination = function(goToPage){
  //render new result
  resultsView.render(model.getSearchResultPage(goToPage));

  //render new pagination btn
  paginationView.render(model.state.search);
}

const controlServings = function(newServings){
  //update recipe servings in state
  model.updateServings(newServings);

  //update new servings in recipe view
  // recipeView.render(model.state.recipe);
  recipeView.update(model.state.recipe);

}

const init = function(){
  recipeView.addHandlerRender(controlReceipe);
  recipeView.addHandlerUpdateServings(controlServings);
  searchView.addHandlerSearch(controlSearchResult);
  paginationView.addHandlerClick(controlPagination);
}

////////////////////////Initialize
console.log('in controleer...')
init();
if(module.hot){
  module.hot.accept();
}