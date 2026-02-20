// import { join } from 'core-js/library/es7/array';
import View from './view.js';
import icons from 'url:../../img/icons.svg';

class PaginationView extends View {
  _parentEl = document.querySelector('.pagination');

  _generateTotalPages() {
    return `
  <div class="total__pages">
  <p class="num_pages">${Math.ceil(
    this._data.results.length / this._data.resultsPerPage,
  )}</p>
  </div>
  `;
  }

  _generateMarkup() {
    return this._generateMarkupBtn();
  }

  _generateMarkupBtn() {
    const numOfPages = Math.ceil(
      this._data.results.length / this._data.resultsPerPage,
    );

    // Initializing this._data.page into curPage
    const curPage = this._data.page;

    // Page 1 and there are other pages
    if (curPage === 1 && numOfPages > 1)
      return `
        <button class="btn--inline pagination__btn--next" data-goto="${curPage + 1}">
            <span>${curPage + 1} </span>
            <svg class="search__icon">
            <use href="${icons}#icon-arrow-right"></use>
            </svg>
         </button>

          ${this._generateTotalPages()};
`;

    // Other page
    //  if (curPage < numOfPages)
    if (curPage > 1 && numOfPages - curPage !== 0)
      return `
        <button class="btn--inline pagination__btn--prev" data-goto="${curPage - 1}">
            <svg class="search__icon">
              <use href="${icons}#icon-arrow-left"></use>
            </svg>
            <span>${curPage - 1}</span>
        </button>

        <button class="btn--inline pagination__btn--next" data-goto="${curPage + 1}">
            <span>${curPage + 1}</span>
            <svg class="search__icon">
              <use href="${icons}#icon-arrow-right"></use>
            </svg>
        </button>

        ${this._generateTotalPages()};

    `;

    // Last page
    if (numOfPages === curPage && numOfPages > 1)
      return `
        <button class="btn--inline pagination__btn--prev" data-goto="${curPage - 1}">
            <svg class="search__icon">
              <use href="${icons}#icon-arrow-left"></use>
            </svg>
            <span>${curPage - 1}</span>
        </button>

        ${this._generateTotalPages()};

`;

    // Page 1 and there is no other page
    if (numOfPages === 1 && numOfPages - curPage === 0) return '';
  }

  addHandlerClick(handler) {
    this._parentEl.addEventListener('click', function (e) {
      // initialing buttons
      const btn = e.target.closest('.btn--inline');

      //   Guard clause
      if (!btn) return;

      //  initializing gotoPage by reading btn's data attribute
      const goToPage = +btn.dataset.goto;

      handler(goToPage);
    });
  }
}

export default new PaginationView();
