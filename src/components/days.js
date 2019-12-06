import {getTripEvent} from './event.js';
import {getMonthString, getDatetime} from '../utils.js';

export const getListOfTripDays = () => (`
  <ul class="trip-days"></ul>
`);

export const getTripDayInfo = (daysData) => (
  daysData.map((elem, index) => (`
    <li class="trip-days__item  day">
      <div class="day__info">
        <span class="day__counter">${elem.day}</span>
        <time class="day__date" datetime="${getDatetime(elem.dayDate)}">${getMonthString(elem.dayDate)} ${elem.dayDate.getDate() + index}</time>
      </div>
      <ul class="trip-events__list">${getTripEvent(elem)}</ul>
    </li>
  `))
  .join(`\n`)
);
