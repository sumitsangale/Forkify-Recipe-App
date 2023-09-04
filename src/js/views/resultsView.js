import View from './view';
import previewView from './previewView';
import icons from 'url:../../img/icons.svg';

class ResultsView extends View {
    _parentElement = document.querySelector('.results');
    _errorMessage = 'No recipes found with your query. Please try again!';
    _successMessage = '';

    _generateMarkUP(){
        return this._data.map(result => previewView.render(result, false)).join('');
    }
}

export default new ResultsView();