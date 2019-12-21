import AbstractSmartComponent from './abstract-smart-component.js';
import {getPureHours, getPureMinutes} from '../utils/date.js';
import {destinationTowns, tripType} from '../mock/event.js';

const getDestinationTownsList = () => (
  destinationTowns.map((town) => (
    `<option value="${town}"></option>`
  ))
  .join(`\n`)
);

const getImgList = (aboutImg) => (
  aboutImg.map((url) => (`<img class="event__photo" src="${url}" alt="Event photo">`))
  .join(`\n`)
);

const getOffersList = (offers) => (
  offers.map((elem) => (
    `<div class="event__offer-selector">
        <input class="event__offer-checkbox  visually-hidden" id="event-offer-${elem.name}-1" type="checkbox" name="event-offer-${elem.name}" ${elem.checked ? `checked` : ``}>
        <label class="event__offer-label" for="event-offer-${elem.name}-1">
          <span class="event__offer-title">${elem.text}</span>
          +
          €&nbsp;<span class="event__offer-price">${elem.price}</span>
        </label>
      </div>`
  ))
  .join(`\n`)
);

const getEventTypeItems = (eventItems, curentType) => (
  eventItems.map((elem) => {
    let isChecked = false;

    if (elem.name === curentType) {
      isChecked = true;
    }

    const result =
      `<div class="event__type-item">
        <input id="event-type-${elem.name}-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="${elem.name}" ${isChecked ? `checked` : ``}>
        <label class="event__type-label  event__type-label--${elem.name}" for="event-type-${elem.name}-1">${elem.text}</label>
      </div>`;
    isChecked = false;

    return result;
  })
  .join(`\n`)
);

const getEventTypeList = (curentType) => (
  tripType.map((elem) => (
    `<fieldset class="event__type-group">
      <legend class="visually-hidden">${elem.text}</legend>
      ${getEventTypeItems(elem.list, curentType)}
    </fieldset>`
  ))
  .join(`\n`)
);

const getTripEditEvent = (eventData) => (
  `<li class="trip-events__item">
      <form class="event  event--edit" action="#" method="post">
        <header class="event__header">
          <div class="event__type-wrapper">
            <label class="event__type  event__type-btn" for="event-type-toggle-1">
            <span class="visually-hidden">Choose event type</span>
            <img class="event__type-icon" width="17" height="17" src="img/icons/${eventData.type}.png" alt="Event type icon">
            </label>
            <input class="event__type-toggle  visually-hidden" id="event-type-toggle-1" type="checkbox">
            <div class="event__type-list">
              ${getEventTypeList(eventData.type)}
            </div>
          </div>
          <div class="event__field-group  event__field-group--destination">
            <label class="event__label  event__type-output" for="event-destination-1">
            Sightseeing at
            </label>
            <input class="event__input  event__input--destination" id="event-destination-1" type="text" name="event-destination" value=${eventData.moveTo} list="destination-list-1">
            <datalist id="destination-list-1">
              ${getDestinationTownsList()}
            </datalist>
          </div>
          <div class="event__field-group  event__field-group--time">
            <label class="visually-hidden" for="event-start-time-1">
            From
            </label>
            <input class="event__input  event__input--time" id="event-start-time-1" type="text" name="event-start-time" value="18/03/19 ${getPureHours(eventData.startDate)}:${getPureMinutes(eventData.startDate)}">
            —
            <label class="visually-hidden" for="event-end-time-1">
            To
            </label>
            <input class="event__input  event__input--time" id="event-end-time-1" type="text" name="event-end-time" value="18/03/19 ${getPureHours(eventData.endDate)}:${getPureMinutes(eventData.endDate)}">
          </div>
          <div class="event__field-group  event__field-group--price">
            <label class="event__label" for="event-price-1">
            <span class="visually-hidden">Price</span>
            €
            </label>
            <input class="event__input  event__input--price" id="event-price-1" type="text" name="event-price" value="${eventData.price}">
          </div>
          <button class="event__save-btn  btn  btn--blue" type="submit">Save</button>
          <button class="event__reset-btn" type="reset">Delete</button>
          <input id="event-favorite-1" class="event__favorite-checkbox  visually-hidden" type="checkbox" name="event-favorite" ${eventData.favorite ? `checked` : ``}>
          <label class="event__favorite-btn" for="event-favorite-1">
            <span class="visually-hidden">Add to favorite</span>
            <svg class="event__favorite-icon" width="28" height="28" viewBox="0 0 28 28">
              <path d="M14 21l-8.22899 4.3262 1.57159-9.1631L.685209 9.67376 9.8855 8.33688 14 0l4.1145 8.33688 9.2003 1.33688-6.6574 6.48934 1.5716 9.1631L14 21z"></path>
            </svg>
          </label>
          <button class="event__rollup-btn" type="button">
          <span class="visually-hidden">Open event</span>
          </button>
        </header>
        <section class="event__details">
          <section class="event__section  event__section--offers">
            <h3 class="event__section-title  event__section-title--offers">Offers</h3>
            <div class="event__available-offers">
              ${getOffersList(eventData.offers)}
            </div>
          </section>
          <section class="event__section  event__section--destination">
            <h3 class="event__section-title  event__section-title--destination">Destination</h3>
            <p class="event__destination-description">${eventData.aboutText}</p>
            <div class="event__photos-container">
              <div class="event__photos-tape">
                ${getImgList(eventData.aboutImg)}
              </div>
            </div>
          </section>
        </section>
      </form>
  </li>`
);

export default class EventEditComponent extends AbstractSmartComponent {
  constructor(eventData) {
    super();
    this._eventData = eventData;

    this._closeButtonClickHandler = null;
    this._submitHandler = null;
    this._favoriteButtonClickHandler = null;
  }

  getTemplate() {
    return getTripEditEvent(this._eventData);
  }

  recoveryListeners() {
    this.setCloseButtonClickHandler(this._closeButtonClickHandler);
    this.setSubmitHandler(this._submitHandler);
    this.setFavoriteButtonClickHandler(this._favoriteButtonClickHandler);
  }

  setCloseButtonClickHandler(handler) {
    this._closeButtonClickHandler = handler;
    this.getElement().querySelector(`.event__rollup-btn`).addEventListener(`click`, handler);
  }

  setSubmitHandler(handler) {
    this._submitHandler = handler;
    this.getElement().querySelector(`form`).addEventListener(`submit`, handler);
  }

  setFavoriteButtonClickHandler(handler) {
    this._favoriteButtonClickHandler = handler;
    this.getElement().querySelector(`.event__favorite-checkbox`).addEventListener(`change`, () => {
      handler();
      this.recoveryListeners();
    });
  }

  setSelectTypeClickHandler(handler) {
    this.getElement().querySelector(`.event__type-list`).addEventListener(`click`, (evt) => {
      handler(evt);
    });
  }
}
