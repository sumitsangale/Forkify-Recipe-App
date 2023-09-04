import View from './view';
import previewView from './previewView';

class BookmarkView extends View {
    _parentElement = document.querySelector('.bookmarks__list');
    _errorMessage = 'No Bookmarks yet. Find a nice recipe and bookmarked!';
    _successMessage = '';

    _generateMarkUP(){
        return this._data.map(bookmark => previewView.render(bookmark, false)).join('');
    }
}

export default new BookmarkView();