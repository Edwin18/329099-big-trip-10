import AbstractComponent from './abstract-component.js';
import {formatTimeMonth} from '../utils/date.js';

const getTripInfoDate = (data) => {
  const lastIndex = data.length - 1;

  return `${formatTimeMonth(data[0].startDate)}&nbsp;—&nbsp;${formatTimeMonth(data[lastIndex].endDate)}`;
};

const getTripInfoTitle = (data) => {
  const lastIndex = data.length - 1;

  return `${data[0].moveTo} — ... — ${data[lastIndex].moveTo}`;
};

const getTripInfoElement = (pointsData) => (
  `<div class="trip-info__main">
    <h1 class="trip-info__title">${getTripInfoTitle(pointsData)}</h1>
    <p class="trip-info__dates">${getTripInfoDate(pointsData)}</p>
  </div>`
);

export default class TripInfoComponent extends AbstractComponent {
  constructor(pointsData) {
    super();
    this._pointsData = pointsData;
  }

  getTemplate() {
    return getTripInfoElement(this._pointsData);
  }
}
