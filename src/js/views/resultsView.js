import View from './view';
import icons from 'url:../../img/icons.svg';

class ResultsView extends View {
    _parentElement = document.querySelector('.results');
    _errorMessage = 'No recipes found with your query. Please try again!';
    _successMessage = '';

    _generateMarkUP(){
        return this._data.map(this._generateMarkUPPreview).join('');
    }

    _generateMarkUPPreview(result){
        return `
            <li class="preview">
                <a class="preview__link" href="#${result.id}">
                <figure class="preview__fig">
                    <img src="${result.imageUrl}" alt="${result.title}" />
                </figure>
                <div class="preview__data">
                    <h4 class="preview__title">${result.title}</h4>
                    <p class="preview__publisher">${result.publisher}</p>
                </div>
                </a>
            </li>
        `
    }
}

export default new ResultsView();