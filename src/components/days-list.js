import AbstractComponent from './abstract-component.js';

const getListOfTripDays = () => (
  `<ul class="trip-days"></ul>`
);

export default class DaysListComponent extends AbstractComponent {
  getTemplate() {
    return getListOfTripDays();
  }
}
