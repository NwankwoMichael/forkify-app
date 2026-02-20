import icons from 'url:../../img/icons.svg';

export default class View {
  _data;

  /**
   * Render the received object to the DOM
   * @param {Object | Object[]} data The data to be rendered (e.g recipe)
   * @param {boolean} {render=true}if false create markup string instead of rendering to the DOM
   * @returns {undefined | string} A markup string is returned if render=false
   * @this {Object} View instance
   * @author Michael Nwankwo
   * @todo Finish implementation
   */
  render(data, render = true) {
    if (!data || (Array.isArray(data) && data.length === 0))
      return this.renderError();

    this._data = data;

    // Initializing markup via this._generate
    const markup = this._generateMarkup();

    if (!render) return markup;
    // clearing the innerHTML
    this._clearContainer();

    // Inserting the markup in the the recipe container
    this._parentEl.insertAdjacentHTML('afterbegin', markup);
  }

  update(data) {
    this._data = data;
    const newMarkup = this._generateMarkup();

    const newDOM = document.createRange().createContextualFragment(newMarkup);

    const newElements = Array.from(newDOM.querySelectorAll('*'));
    const curElements = Array.from(this._parentEl.querySelectorAll('*'));

    newElements.forEach((newEl, i) => {
      const curEl = curElements[i];

      //   Update changed text
      if (
        !newEl.isEqualNode(curEl) &&
        newEl.firstChild?.nodeValue.trim() !== ''
      ) {
        curEl.textContent = newEl.textContent;
      }

      //   Update changed Attributes
      if (!newEl.isEqualNode(curEl))
        Array.from(newEl.attributes).forEach(attrib =>
          curEl.setAttribute(attrib.name, attrib.value),
        );
    });
  }

  _clearContainer() {
    this._parentEl.innerHTML = '';
  }

  renderSpinner() {
    const markup = `
        <div class="spinner">
          <svg>
            <use href="${icons}#icon-loader"></use>
          </svg>
        </div>`;

    // Clearing innerHTML
    this._clearContainer();

    //   Inserting markup
    this._parentEl.insertAdjacentHTML('afterbegin', markup);
  }

  renderError(message = this._errorMessage) {
    const markup = `
            <div class="error">
                <div>
                  <svg>
                    <use href="${icons}#icon-alert-triangle"></use>
                  </svg>
                </div>
                <p>${message}</p>
            </div>
        `;

    // Clearing the innerHTML
    this._clearContainer();

    // Inserting Markup
    this._parentEl.insertAdjacentHTML('afterbegin', markup);
  }

  renderSuccessMsg(message = this._successMessage) {
    const markup = `
            <div class="message">
                <div>
                  <svg>
                    <use href="${icons}#icon-smile"></use>
                  </svg>
                </div>
                <p>${message}</p>
            </div>
        `;

    // Clearing the innerHTML
    this._clearContainer();

    // Inserting Markup
    this._parentEl.insertAdjacentHTML('afterbegin', markup);
  }
}
