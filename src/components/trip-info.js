import {getMonthString, createElement} from '../utils.js';

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

export default class TripInfoComponent {
  constructor(data) {
    this._data = data;
    this._element = null;
  }

  getTemplate() {
    return getTripInfoElement(this._data);
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
