import View from './view.js';

class SearchView extends View {
  _parentEl = document.querySelector('.search');

  getQuery() {
    const query = this._parentEl.querySelector('.search__field').value;
    this._clearSearchInput();
    return query;
  }

  addHandlerSearch(handler) {
    this._parentEl.addEventListener('submit', function (e) {
      e.preventDefault();
      handler();
    });
  }

  _clearSearchInput() {
    this._parentEl.querySelector('.search__field').value = '';
  }
}

export default new SearchView();
