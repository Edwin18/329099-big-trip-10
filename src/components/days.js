import AbstractComponent from './abstract-component.js';
import {formatTimeMonth, formatDatetime} from '../utils/date.js';

const getTripDayInfo = (pointsData, dayNumber) => (
  `<li class="trip-days__item  day">
    <div class="day__info">
      <span class="day__counter">${dayNumber + 1 || ``}</span>
      <time class="day__date" datetime="${pointsData ? `${formatDatetime(pointsData[0].date_from)}">${formatTimeMonth(pointsData[0].date_from)}` : `">`}</time>
    </div>
    <ul class="trip-events__list"></ul>
  </li>`
);

export default class DaysComponent extends AbstractComponent {
  constructor(pointsData, dayNumber) {
    super();
    this._pointsData = pointsData;
    this._dayNumber = dayNumber;
  }

  getTemplate() {
    return getTripDayInfo(this._pointsData, this._dayNumber);
  }
}
