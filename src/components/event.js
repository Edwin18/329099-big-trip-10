import {getDatetimeFull, createElement, getPureHours, getPureMinutes, getPureDateNumber} from '../utils.js';

const TIME = {
  HOURS: 24,
  MINUTES: 60
};
const OFFERS_DISPLAY_COUNT = 3;

const getTimeDifference = (dateStart, dateEnd) => {
  let hoursDifference = dateEnd.getHours() - dateStart.getHours();
  let minutesDifference = dateEnd.getMinutes() - dateStart.getMinutes();

  if (dateStart.getHours() > dateEnd.getHours()) {
    hoursDifference = 0;
    hoursDifference = TIME.HOURS - dateStart.getHours();
    hoursDifference = hoursDifference + dateEnd.getHours();
  }

  if (dateStart.getMinutes() > dateEnd.getMinutes()) {
    minutesDifference = 0;
    minutesDifference = TIME.MINUTES - dateStart.getMinutes();
    minutesDifference = minutesDifference + dateEnd.getMinutes();
    hoursDifference = hoursDifference - 1;
  }

  const hoursResult = hoursDifference <= 0 ? `` : `${getPureDateNumber(hoursDifference)}H`;
  const minutesResult = minutesDifference <= 0 ? `` : `${getPureDateNumber(minutesDifference)}M`;

  return `${hoursResult} ${minutesResult}`;
};

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

const getTripEvent = (eventData) => (
  `<li class="trip-events__item">
    <div class="event">
      <div class="event__type">
        <img class="event__type-icon" width="42" height="42" src="img/icons/${eventData.type}.png" alt="Event type icon">
      </div>
      <h3 class="event__title">${eventData.moveTo} to ${eventData.type}</h3>

      <div class="event__schedule">
        <p class="event__time">
          <time class="event__start-time" datetime="${getDatetimeFull(eventData.startDate)}">${getPureHours(eventData.startDate)}:${getPureMinutes(eventData.startDate)}</time>
          —
          <time class="event__end-time" datetime="${getDatetimeFull(eventData.endDate)}">${getPureHours(eventData.endDate)}:${getPureMinutes(eventData.endDate)}</time>
        </p>
        <p class="event__duration">${getTimeDifference(eventData.startDate, eventData.endDate)}</p>
      </div>

      <p class="event__price">
        €&nbsp;<span class="event__price-value">${eventData.price}</span>
      </p>

      <h4 class="visually-hidden">Offers:</h4>
      <ul class="event__selected-offers">
        ${generateOfferList(eventData.offers)}
      </ul>

      <button class="event__rollup-btn" type="button">
        <span class="visually-hidden">Open event</span>
      </button>
    </div>
  </li>`
);

export default class EventComponent {
  constructor(eventData) {
    this._eventData = eventData;
    this._element = null;
  }

  getTemplate() {
    return getTripEvent(this._eventData);
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
