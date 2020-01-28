import AbstractComponent from './abstract-component.js';

const getTripControls = () => (
  `<nav class="trip-controls__trip-tabs  trip-tabs">
    <a class="trip-tabs__btn  trip-tabs__btn--active" href="#" id="table-view">Table</a>
    <a class="trip-tabs__btn" href="#" id="stats-view">Stats</a>
  </nav>`
);

export default class ControlsComponent extends AbstractComponent {
  getTemplate() {
    return getTripControls();
  }

  setViewClickHandler(handler) {
    this.getElement().addEventListener(`click`, handler);
  }
}
