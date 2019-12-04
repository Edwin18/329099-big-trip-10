import {getTripEvent} from './event.js';

export const getListOfTripDays = () => (`
  <ul class="trip-days"></ul>
`);

export const getTripDayInfo = (daysData) => (
  daysData.map((elem, index) => (`
    <li class="trip-days__item  day">
      <div class="day__info">
        <span class="day__counter">${elem.day}</span>
        <time class="day__date" datetime="${elem.dayDate.getFullYear()}-${elem.dayDate.getMonth() + 1}-${elem.dayDate.getDate()}">${elem.dayDate.getMonth()} ${elem.dayDate.getDate() + index}</time>
      </div>
      <ul class="trip-events__list">${getTripEvent(elem)}</ul>
    </li>
  `))
  .join(`\n`)
);
