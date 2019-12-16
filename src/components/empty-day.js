import AbstractComponent from "./abstract-component.js";

const getEmptyDay = () => (
  `<ul class="trip-days">
    <li class="trip-days__item  day">
      <div class="day__info"></div>
      <ul class="trip-events__list"></ul>
    </li>
  </ul>`);

export default class EmptyDayComponent extends AbstractComponent {
  getTemplate() {
    return getEmptyDay();
  }
}
