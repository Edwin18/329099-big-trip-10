import AbstractComponent from './abstract-component.js';
import {formatTimeMonth} from '../utils/date.js';

const DestinationsShow = {
  MIN: 2,
  MAX: 3
};

const getTripInfoElement = () => (
  `<div class="trip-info__main">
    <h1 class="trip-info__title"></h1>
    <p class="trip-info__dates"></p>
  </div>`
);

export default class TripInfoComponent extends AbstractComponent {
  getTemplate() {
    return getTripInfoElement(this._pointsData);
  }

  hide() {
    this.getElement().classList.add(`visually-hidden`);
  }

  show() {
    this.getElement().classList.remove(`visually-hidden`);
  }

  setInfo(allPoints) {
    const infoTitleElement = document.querySelector(`.trip-info__title`);
    const infoDatesElement = document.querySelector(`.trip-info__dates`);

    if (allPoints.length) {
      infoTitleElement.innerText = this._getTripInfoTitle(allPoints);
      infoDatesElement.innerHTML = this._getTripInfoDate(allPoints);
    }
  }

  setPrice(allPoints) {
    const priceElement = document.querySelector(`.trip-info__cost-value`);
    const totalPointsPrice = allPoints.reduce((result, point) => {
      point.offers.forEach((offer) => (result = result + offer.price));
      return result + point.base_price;
    }, 0);

    priceElement.innerText = totalPointsPrice;
  }

  _getTripInfoDate(allPoints) {
    const lastIndex = allPoints.length - 1;

    return `${formatTimeMonth(allPoints[0].date_from)}&nbsp;—&nbsp;${formatTimeMonth(allPoints[lastIndex].date_to)}`;
  }

  _getTripInfoTitle(allPoints) {
    const lastIndex = allPoints.length - 1;

    return `${allPoints[1] ?
      `${allPoints[0].destination.name} — ${allPoints.length === DestinationsShow.MIN ?
        `${allPoints[lastIndex].destination.name}` : `${allPoints.length === DestinationsShow.MAX ?
          `${allPoints[1].destination.name} — ${allPoints[lastIndex].destination.name}` : `... — ${allPoints[lastIndex].destination.name}`}`}`
      : `${allPoints[0].destination.name}`}`;
  }
}
