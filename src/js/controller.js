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

controlReceipe = async function(){
  try{
    //get hash Id
    let id = window.location.hash.slice(1);
    //5ed6604591c37cdc054bc886
    if(!id) return;
    recipeView.renderSpinner();
    
    //get recipe
    await model.loadRecipe(id);
    
    //render recipe
    recipeView.render(model.state.recipe);

  } catch(err){
    recipeView.renderError();
  }
}

controlSearchResult = async function(){
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

controlPagination = function(goToPage){
  //render new result
  resultsView.render(model.getSearchResultPage(goToPage));

  //render new pagination btn
  paginationView.render(model.state.search);
}

const init = function(){
  recipeView.addHandlerRender(controlReceipe);
  searchView.addHandlerSearch(controlSearchResult);
  paginationView.addHandlerClick(controlPagination);
}

////////////////////////Initialize
console.log('in controleer...')
init();
if(module.hot){
  module.hot.accept();
}