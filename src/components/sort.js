import AbstractComponent from './abstract-component.js';
import {sorts} from '../mock/sort.js';

export const SORT_TYPE = {
  DEFAULT: `event`,
  TIME: `time`,
  PRICE: `price`
};

const getSortItem = () => (
  sorts.map((sortItem) => {
    if (sortItem.icon) {
      return `<div class="trip-sort__item  trip-sort__item--${sortItem.name}">
                <input id="sort-${sortItem.name}" class="trip-sort__input  visually-hidden" type="radio" name="trip-sort" value="sort-${sortItem.name}">
                <label data-sort-type="${sortItem.name}" class="trip-sort__btn" for="sort-${sortItem.name}">
                  ${sortItem.text}
                  ${getSortIcon()}
                </label>
              </div>`;
    }

    return `<div class="trip-sort__item  trip-sort__item--${sortItem.name}">
              <input id="sort-${sortItem.name}" class="trip-sort__input  visually-hidden" type="radio" name="trip-sort" value="sort-${sortItem.name}" checked="">
              <label data-sort-type="${sortItem.name}" class="trip-sort__btn" for="sort-${sortItem.name}">Event</label>
            </div>`;
  })
  .join(`\n`)
);

const getSortIcon = () => (
  `<svg class="trip-sort__direction-icon" width="8" height="10" viewBox="0 0 8 10">
    <path d="M2.888 4.852V9.694H5.588V4.852L7.91 5.068L4.238 0.00999987L0.548 5.068L2.888 4.852Z"></path>
  </svg>`
);

const getTripSort = () => (
  `<form class="trip-events__trip-sort  trip-sort" action="#" method="get">
    <span class="trip-sort__item  trip-sort__item--day">Day</span>
      ${getSortItem()}
    <span class="trip-sort__item  trip-sort__item--offers">Offers</span>
  </form>`
);

export default class SortComponent extends AbstractComponent {
  constructor() {
    super();

    this._currenSortType = SORT_TYPE.DEFAULT;
  }

  getTemplate() {
    return getTripSort();
  }

  setSortTypeChangeHandler(handler) {
    this.getElement().addEventListener(`click`, (evt) => {
      const sortType = evt.target.dataset.sortType;

      if (evt.target.tagName !== `LABEL`) {
        return;
      }

      if (evt.target.dataset.sortType === this._currenSortType) {
        return;
      }

      this._currenSortType = sortType;

      handler(this._currenSortType);
    });
  }
}
