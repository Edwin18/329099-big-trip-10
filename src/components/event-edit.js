import AbstractSmartComponent from './abstract-smart-component.js';
import OffersComponent from './offers.js';
import DestinationsComponent from './destinations.js';
import {getCurrentPreInputText, getDefaultEventData} from '../utils/common.js';
import {tripType} from '../mock/event.js';
import moment from 'moment';
import nanoid from 'nanoid';

const ID_SIZE = 4;

const getOffersSection = (offersData) => (new OffersComponent(offersData).getTemplate());
const getDestinationSection = (destinationsData) => (new DestinationsComponent(destinationsData).getTemplate());

const getDestinationTownsList = (destinationTowns) => (
  destinationTowns.map((town) => (
    `<option value="${town.name}"></option>`
  ))
  .join(`\n`)
);

const getEventTypeItems = (eventItems, currentType) => (
  eventItems.map((elem) => {
    let isChecked = false;

    if (elem.name === currentType) {
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

const getEventTypeList = (currentType) => (
  tripType.map((elem) => (
    `<fieldset class="event__type-group">
      <legend class="visually-hidden">${elem.text}</legend>
      ${getEventTypeItems(elem.list, currentType)}
    </fieldset>`
  ))
  .join(`\n`)
);

const getTripEditEvent = (eventData, destinationDatalist) => {
  const currentEventData = getDefaultEventData(eventData);
  return (
    `<li class="trip-events__item">
      <form class="event  event--edit" action="#" method="post">
        <header class="event__header">
          <div class="event__type-wrapper">
            <label class="event__type  event__type-btn" for="event-type-toggle-1">
            <span class="visually-hidden">Choose event type</span>
            <img class="event__type-icon" width="17" height="17" src="img/icons/${currentEventData.type || `taxi`}.png" alt="Event type icon">
            </label>
            <input class="event__type-toggle  visually-hidden" id="event-type-toggle-1" type="checkbox" name="event-type-toggle" value="${currentEventData.type}">
            <div class="event__type-list">
              ${getEventTypeList(currentEventData.type)}
            </div>
          </div>
          <div class="event__field-group  event__field-group--destination">
            <label class="event__label  event__type-output" for="event-destination-1">
            ${getCurrentPreInputText(currentEventData.type)}
            </label>
            <input class="event__input  event__input--destination" id="event-destination-1" type="text" name="event-destination" value="${currentEventData.destination.name || ``}" list="destination-list-1" required>
            <datalist id="destination-list-1">
              ${getDestinationTownsList(destinationDatalist)}
            </datalist>
          </div>
          <div class="event__field-group  event__field-group--time">
            <label class="visually-hidden" for="event-start-time-1">
            From
            </label>
            <input class="event__input  event__input--time" id="event-start-time-1" type="text" name="event-start-time" value="24/12/2019 14:02">
            —
            <label class="visually-hidden" for="event-end-time-1">
            To
            </label>
            <input class="event__input  event__input--time" id="event-end-time-1" type="text" name="event-end-time" value="24/12/2019 18:17">
          </div>
          <div class="event__field-group  event__field-group--price">
            <label class="event__label" for="event-price-1">
            <span class="visually-hidden">Price</span>
            €
            </label>
            <input class="event__input  event__input--price" id="event-price-1" type="number" name="event-price" value="${currentEventData.base_price}" required>
          </div>
          <button class="event__save-btn  btn  btn--blue" type="submit">${eventData ? `Save` : `Create`}</button>
          <button class="event__reset-btn" type="reset">${eventData ? `Delete` : `Cancel`}</button>
          ${eventData ? `<input id="event-favorite-1" class="event__favorite-checkbox  visually-hidden" type="checkbox" name="event-favorite" ${currentEventData.is_favorite ? `checked` : ``}>
          <label class="event__favorite-btn" for="event-favorite-1">
            <span class="visually-hidden">Add to favorite</span>
            <svg class="event__favorite-icon" width="28" height="28" viewBox="0 0 28 28">
              <path d="M14 21l-8.22899 4.3262 1.57159-9.1631L.685209 9.67376 9.8855 8.33688 14 0l4.1145 8.33688 9.2003 1.33688-6.6574 6.48934 1.5716 9.1631L14 21z"></path>
            </svg>
          </label>` : ``}
          ${eventData ? `<button class="event__rollup-btn" type="button">` : ``}
          <span class="visually-hidden">Open event</span>
          </button>
        </header>
        <section class="event__details">
          ${currentEventData ? getOffersSection(currentEventData) : ``}
          ${currentEventData.destination ? getDestinationSection(currentEventData.destination) : ``}
        </section>
      </form>
  </li>`);
};

const getDestinationData = (destinationInput, destinationList) => (destinationList.find((elem) => (elem.name === destinationInput)));
const getOffersData = (offersInput, offersList) => {
  const currentType = offersList.find((elem) => (elem.type === offersInput));

  return currentType.offers;
};

const getDateData = (date) => (moment(date).toJSON());

const parseFormData = (formData, offersData, destinationsData, preEventData) => (
  {
    'id': preEventData ? preEventData.id : nanoid(ID_SIZE),
    'type': formData.get(`event-type`),
    'date_from': getDateData(formData.get(`event-start-time`)),
    'date_to': getDateData(formData.get(`event-end-time`)),
    'destination': getDestinationData(formData.get(`event-destination`), destinationsData),
    'base_price': parseInt(formData.get(`event-price`), 10),
    'is_favorite': formData.get(`event-favorite`) ? true : false,
    'offers': getOffersData(formData.get(`event-type`), offersData),
  }
);

export default class EventEditComponent extends AbstractSmartComponent {
  constructor(eventData, offersData, destinationsData) {
    super();
    this._eventData = eventData;
    this._offersData = offersData;
    this._destinationsData = destinationsData;

    this._closeButtonClickHandler = null;
    this._submitHandler = null;
    this._favoriteButtonClickHandler = null;
    this._favoriteComponent = null;
    this._selectTypeClickHandler = null;
    this._deleteButtonClickHandler = null;
    this._selectDestinationInputHandler = null;
  }

  getTemplate() {
    return getTripEditEvent(this._eventData, this._destinationsData);
  }

  recoveryListeners() {
    this.setCloseButtonClickHandler(this._closeButtonClickHandler);
    this.setSubmitHandler(this._submitHandler);
    this.setFavoriteButtonChangeHandler(this._favoriteButtonClickHandler, this._favoriteComponent);
    this.setSelectTypeClickHandler(this._selectTypeClickHandler);
    this.setDeleteButtonClickHandler(this._deleteButtonClickHandler);
    this.setSelectDestinationInputHandler(this._selectDestinationInputHandler);
  }

  setCloseButtonClickHandler(handler) {
    if (this._eventData) {
      this._closeButtonClickHandler = handler;
      this.getElement().querySelector(`.event__rollup-btn`).addEventListener(`click`, handler);
    }
  }

  setSubmitHandler(handler) {
    this._submitHandler = handler;
    this.getElement().querySelector(`form`).addEventListener(`submit`, handler);
  }

  setFavoriteButtonChangeHandler(handler, component) {
    if (this._eventData) {
      this._favoriteButtonClickHandler = handler;
      this._favoriteComponent = component;
      this.getElement().querySelector(`.event__favorite-checkbox`).addEventListener(`change`, () => {
        handler(component);
      });
    }
  }

  setSelectTypeClickHandler(handler) {
    this._selectTypeClickHandler = handler;
    this.getElement().querySelector(`.event__type-list`).addEventListener(`click`, (evt) => {
      handler(evt, this._offersData);
    });
  }

  setDeleteButtonClickHandler(handler) {
    this._deleteButtonClickHandler = handler;
    this.getElement().querySelector(`.event__reset-btn`).addEventListener(`click`, (evt) => {
      handler(evt, this._eventData);
    });
  }

  setSelectDestinationInputHandler(handler) {
    this._selectDestinationInputHandler = handler;
    this.getElement().querySelector(`#event-destination-1`).addEventListener(`input`, (evt) => {
      handler(evt, this._destinationsData);
    });
  }

  getData(preEventData) {
    const form = this.getElement().querySelector(`form`);
    const formData = new FormData(form);

    return parseFormData(formData, this._offersData, this._destinationsData, preEventData);
  }
}
