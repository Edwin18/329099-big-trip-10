import AbstractComponent from './abstract-component.js';

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
}
