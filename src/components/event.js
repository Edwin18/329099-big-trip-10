import AbstractComponent from './abstract-component.js';
import {formatTime, formatDatetime, getTimeDifference} from '../utils/date.js';
import {getCurrentPreInputText, getDefaultEventData} from '../utils/common.js';

const OFFERS_DISPLAY_COUNT = 3;

const generateOfferList = (eventOffers, allOffers, type) => (
  eventOffers.map((offer) => {
    const currentOffers = allOffers.find((elem) => (elem.type === type));
    const currrentOffer = currentOffers.offers.find((elem) => (elem.title === offer.title));
    return `<li class="event__offer">
      <span class="event__offer-title">${currrentOffer.title}</span>
      +
      €&nbsp;<span class="event__offer-price">${currrentOffer.price}</span>
    </li>`;
  })
  .slice(0, OFFERS_DISPLAY_COUNT)
  .join(`\n`)
);

const getTripEvent = (eventData, offersData) => {
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
          ${eventData ? generateOfferList(currentEventData.offers, offersData, eventData.type) : ``}
        </ul>

        <button class="event__rollup-btn" type="button">
          <span class="visually-hidden">Open event</span>
        </button>
      </div>
    </li>`);
};

export default class EventComponent extends AbstractComponent {
  constructor(eventData, offersData) {
    super();
    this._eventData = eventData;
    this._offersData = offersData;
  }

  getTemplate() {
    return getTripEvent(this._eventData, this._offersData);
  }

  setEditButtonClickHandler(handler) {
    this.getElement().querySelector(`.event__rollup-btn`).addEventListener(`click`, handler);
  }
}
