import AbstractComponent from './abstract-component.js';
import {getMonthString, getDatetime} from '../utils/date.js';

const getTripDayInfo = (dayData) => (
  `<li class="trip-days__item  day">
    <div class="day__info">
      <span class="day__counter">${dayData.day}</span>
      <time class="day__date" datetime="${getDatetime(dayData.dayDate)}">${getMonthString(dayData.dayDate)} ${dayData.dayDate.getDate()}</time>
    </div>
    <ul class="trip-events__list"></ul>
  </li>`
);

export default class DaysComponent extends AbstractComponent {
  constructor(dayData) {
    super();
    this._dayData = dayData;
  }

  getTemplate() {
    return getTripDayInfo(this._dayData);
  }
}
