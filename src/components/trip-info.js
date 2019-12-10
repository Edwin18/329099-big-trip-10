import AbstractComponent from './abstract-component.js';
import {getMonthString} from '../utils/date.js';

const getTripInfoDate = (data) => {
  const lastIndex = data.length - 1;
  const lastDayDate = data[lastIndex].dayDate;
  const firstDayDate = data[0].dayDate;

  return `${getMonthString(firstDayDate)} ${firstDayDate.getDate()}&nbsp;—&nbsp;${lastDayDate.getDate() + lastIndex}`;
};

const getTripInfoTitle = (data) => {
  const lastIndex = data.length - 1;
  const dayInfo = data[lastIndex].dayInfo;

  return `${data[0].dayInfo[0].moveTo} — ... — ${dayInfo[dayInfo.length - 1].moveTo}`;
};

const getTripInfoElement = (data) => (
  `<div class="trip-info__main">
    <h1 class="trip-info__title">${getTripInfoTitle(data)}</h1>
    <p class="trip-info__dates">${getTripInfoDate(data)}</p>
  </div>`
);

export default class TripInfoComponent extends AbstractComponent {
  constructor(data) {
    super();
    this._data = data;
  }

  getTemplate() {
    return getTripInfoElement(this._data);
  }
}
