import {filters} from '../mock/filter.js';
import {createElement} from '../utils.js';

const generateFilters = () => (
  filters.map((elem) => (
    `<div class="trip-filters__filter">
      <input id="filter-${elem.name}" class="trip-filters__filter-input  visually-hidden" type="radio" name="trip-filter" value="${elem.name}" ${elem.checked}>
      <label class="trip-filters__filter-label" for="filter-${elem.name}">${elem.text}</label>
    </div>`
  ))
  .join(`\n`)
);

const getTripFilter = () => (
  `<form class="trip-filters" action="#" method="get">
    ${generateFilters()}
    <button class="visually-hidden" type="submit">Accept filter</button>
  </form>`
);

export default class FilterComponent {
  constructor() {
    this._element = null;
  }

  getTemplate() {
    return getTripFilter();
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
