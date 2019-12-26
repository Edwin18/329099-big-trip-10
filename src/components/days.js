import AbstractComponent from './abstract-component.js';
import {formatTimeMonth, formatDatetime} from '../utils/date.js';

const getTripDayInfo = (pointsData) => (
  `<li class="trip-days__item  day">
    <div class="day__info">
      <span class="day__counter">1</span>
      <time class="day__date" datetime="${formatDatetime(pointsData[0].startDate)}">${formatTimeMonth(pointsData[0].startDate)}</time>
    </div>
    <ul class="trip-events__list"></ul>
  </li>`
);

export default class DaysComponent extends AbstractComponent {
  constructor(pointsData) {
    super();
    this._pointsData = pointsData;
  }

  getTemplate() {
    return getTripDayInfo(this._pointsData);
  }
}
