// import icons from 'url:../img/icons.svg';
import 'core-js/stable';
import 'regenerator-runtime/runtime';
import * as model from './model';
import {MODAL_CLOSE_SEC} from './config';
import recipeView from './views/recipeView';
import searchView from './views/searchView';
import resultsView from './views/resultsView';
import paginationView from './views/paginationView';
import bookmarksView from './views/bookmarksView';
import addRecipeView from './views/addRecipeView';

// https://forkify-api.herokuapp.com/v2
///////////////////////////////////////

const controlReceipe = async function(){
  try{
    //get hash Id
    let id = window.location.hash.slice(1);
    //5ed6604591c37cdc054bc886
    if(!id) return;
    recipeView.renderSpinner();
    
    //update selected search result and bookmarks
    resultsView.update(model.getSearchResultPage());
    bookmarksView.update(model.state.bookmarks);

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

const controlAddBookmark = function(){
  // 1) add/delete bookmarks
  if(!model.state.recipe.bookmarked){
    model.addBookmark(model.state.recipe);
  } else {
    model.deleteBookmark(model.state.recipe.id);
  }

  // 2) update recipe view
  recipeView.update(model.state.recipe);

  // 3) render bookmarks
  bookmarksView.render(model.state.bookmarks)
}

const controlBookmarks = function(){
  bookmarksView.render(model.state.bookmarks);
}

const controlAddRecipe = async function(newRecipe){
  try{
    //show spinner
    addRecipeView.renderSpinner();

    //upload new recipe
    await model.uploadRecipe(newRecipe);

    //render recipe
    recipeView.render(model.state.recipe);

    //success message
    addRecipeView.renderSuccessMessage();

    //render bookmarks
    bookmarksView.render(model.state.bookmarks);

    //change Id in URL
    window.history.pushState(null, '', `#${model.state.recipe.id}`);

    //close form window
    setTimeout(function(){
      addRecipeView.toggleWindow();
    }, MODAL_CLOSE_SEC * 1000)
    
  }catch(err){
    console.log(err);
    addRecipeView.renderError(err.message);
  }
}

const init = function(){
  bookmarksView.addHandlerRender(controlBookmarks);
  recipeView.addHandlerRender(controlReceipe);
  recipeView.addHandlerUpdateServings(controlServings);
  recipeView.addHandlerAddBookmark(controlAddBookmark);
  searchView.addHandlerSearch(controlSearchResult);
  paginationView.addHandlerClick(controlPagination);
  addRecipeView.addHandlerUpload(controlAddRecipe);
}

////////////////////////Initialize
console.log('in controleer...')
init();
if(module.hot){
  module.hot.accept();
}