import {createElement} from '../utils.js';

const getListOfTripDays = () => (
  `<ul class="trip-days"></ul>`
);

export default class DaysListComponent {
  constructor() {
    this._element = null;
  }

  getTemplate() {
    return getListOfTripDays();
  }

  getElement() {
    if (!this._element) {
      this._element = createElement(this.getTemplate());
    }

    return this._element;
  }

  removeElement() {
    this._element = null;
  }
}
