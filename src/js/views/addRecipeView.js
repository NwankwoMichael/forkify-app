import View from './view.js';
import icons from 'url:../../img/icons.svg';

class AddRecipeView extends View {
  _parentEl = document.querySelector('.upload');
  _successMessage = `Recipe was successfully uploaded :)`;

  _overlay = document.querySelector('.overlay');
  _window = document.querySelector('.add-recipe-window');
  _openWindowBtn = document.querySelector('.nav__btn--add-recipe');
  _closeWindowBtn = document.querySelector('.btn--close-modal');

  constructor() {
    super();
    this._addHandlerShowWindow();
    this._addHandlerHideWindow();
  }

  toggleWindow() {
    // toggling the hidden class on both window and overlay
    this._overlay.classList.toggle('hidden');
    this._window.classList.toggle('hidden');
  }

  exceptOverlay(e) {
    if (e.target !== this._overlay) return;
    this.toggleWindow();
  }

  _addHandlerShowWindow() {
    this._openWindowBtn.addEventListener('click', this.toggleWindow.bind(this));
  }

  _addHandlerHideWindow() {
    this._closeWindowBtn.addEventListener(
      'click',
      this.toggleWindow.bind(this),
    );

    window.addEventListener('click', this.exceptOverlay.bind(this));
  }

  _addHandlerUpload(handler) {
    this._parentEl.addEventListener('submit', function (e) {
      // Prevent default page reload
      e.preventDefault();

      //   Get the values of form element
      const dataArr = [...new FormData(this)]; //returns an array of values
      const data = Object.fromEntries(dataArr);
      handler(data);
    });
  }
}

export default new AddRecipeView();
