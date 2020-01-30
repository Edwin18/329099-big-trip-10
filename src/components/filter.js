import AbstractComponent from './abstract-component.js';
import {filters} from '../const.js';

const FILTER_ID_PREFIX = `filter-`;

const getFilterNameById = (id) => {
  return id.substring(FILTER_ID_PREFIX.length);
};

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

export default class FilterComponent extends AbstractComponent {
  getTemplate() {
    return getTripFilter();
  }

  setFilterChangeHandler(handler) {
    this.getElement().addEventListener(`change`, (evt) => {
      const filterName = getFilterNameById(evt.target.id);
      handler(filterName);
    });
  }
}
