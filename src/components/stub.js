import {createElement} from '../utils.js';

const getStub = () => (`<p class="trip-events__msg">Click New Event to create your first point</p>`);

export default class StubComponent {
  constructor() {
    this._element = null;
  }

  getTemplate() {
    return getStub();
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
