import {getMonthString, getDatetime, createElement} from '../utils.js';

const getListOfTripDays = (daysData) => (
  `<ul class="trip-days">${getTripDayInfo(daysData)}</ul>`
);

const getTripDayInfo = (dayData) => (
  `<li class="trip-days__item  day">
    <div class="day__info">
      <span class="day__counter">${dayData.day}</span>
      <time class="day__date" datetime="${getDatetime(dayData.dayDate)}">${getMonthString(dayData.dayDate)} ${dayData.dayDate.getDate()}</time>
    </div>
    <ul class="trip-events__list"></ul>
  </li>`
);

export default class DaysComponent {
  constructor(dayData) {
    this._dayData = dayData;
    this._element = null;
  }

  getTemplate() {
    return getListOfTripDays(this._dayData);
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
