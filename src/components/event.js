import AbstractComponent from './abstract-component.js';
import {formatTime, formatDatetime, getTimeDifference} from '../utils/date.js';
import {getCurrentPreInputText, getDefaultEventData} from '../utils/common.js';

const OFFERS_DISPLAY_COUNT = 3;

const generateOfferList = (offers) => {
  const offersList = [];
  let counter = 0;

  for (let i = 0; i < offers.length; i++) {
    if (offers[i].checked) {
      offersList.push(
          `<li class="event__offer">
            <span class="event__offer-title">${offers[i].text}</span>
            +
            €&nbsp;<span class="event__offer-price">${offers[i].price}</span>
          </li>`
      );
      counter = counter + 1;

      if (counter >= OFFERS_DISPLAY_COUNT) {
        break;
      }
    }
  }

  return offersList.join(`\n`);
};

const getTripEvent = (eventData) => {
  const currentEventData = getDefaultEventData(eventData);
  return (
    `<li class="trip-events__item">
      <div class="event">
        <div class="event__type">
          <img class="event__type-icon" width="42" height="42" src="img/icons/${currentEventData.type || `taxi`}.png" alt="Event type icon">
        </div>
        <h3 class="event__title">${getCurrentPreInputText(currentEventData.type)} ${currentEventData.destination.name}</h3>

        <div class="event__schedule">
          <p class="event__time">
            <time class="event__start-time" datetime="${formatDatetime(currentEventData.date_from)}">${formatTime(currentEventData.date_from)}</time>
            —
            <time class="event__end-time" datetime="${formatDatetime(currentEventData.date_to)}">${formatTime(currentEventData.date_to)}</time>
          </p>
          <p class="event__duration">${getTimeDifference(currentEventData.date_from, currentEventData.date_to)}</p>
        </div>

        <p class="event__price">
          €&nbsp;<span class="event__price-value">${currentEventData.base_price}</span>
        </p>

        <h4 class="visually-hidden">Offers:</h4>
        <ul class="event__selected-offers">
          ${generateOfferList(currentEventData.offers)}
        </ul>

        <button class="event__rollup-btn" type="button">
          <span class="visually-hidden">Open event</span>
        </button>
      </div>
    </li>`);
};

export default class EventComponent extends AbstractComponent {
  constructor(eventData) {
    super();
    this._eventData = eventData;
  }

  getTemplate() {
    return getTripEvent(this._eventData);
  }

  setEditButtonClickHandler(handler) {
    this.getElement().querySelector(`.event__rollup-btn`).addEventListener(`click`, handler);
  }
}
