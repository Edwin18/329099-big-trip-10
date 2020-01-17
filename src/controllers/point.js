import {replace, render, remove, RenderPosition} from '../utils/render.js';
import {getCurrentPreInputText} from '../utils/common.js';
import EventComponent from '../components/event.js';
import EventEditComponent from '../components/event-edit.js';
import OffersComponent from '../components/offers.js';
import DestinationsComponent from '../components/destinations.js';

const VIEW_MODE = {
  DEFAULT: `default`,
  EDIT: `edit`
};

export default class PointController {
  constructor(container, onDataChange, onViewChange, offersModel, destinationsModel) {
    this._container = container;
    this._eventData = null;
    this._onDataChange = onDataChange;
    this._onViewChange = onViewChange;
    this._offersModel = offersModel;
    this._destinationsModel = destinationsModel;

    this._eventComponent = null;
    this._eventEditComponent = null;

    this._escKeyDownHandler = this._escKeyDownHandler.bind(this);
    this._replaceEditToEvent = this._replaceEditToEvent.bind(this);
    this._replaceEventToEdit = this._replaceEventToEdit.bind(this);
    this._deleteElement = this._deleteElement.bind(this);
    this._setFavorite = this._setFavorite.bind(this);
    this._chooseTripType = this._chooseTripType.bind(this);
    this._chooseDestination = this._chooseDestination.bind(this);

    this._viewMode = VIEW_MODE.DEFAULT;
  }

  render(eventData) {
    this._eventData = eventData;
    this._mainRender(eventData);

    render(this._container, this._eventComponent.getElement(), RenderPosition.BEFOREEND);
  }

  reRender(newData, oldComponent) {
    this._mainRender(newData);

    replace(this._eventEditComponent, oldComponent);
  }

  setDefaultView() {
    if (this._viewMode === VIEW_MODE.EDIT) {
      this._replaceEditToEvent();
      this._viewMode = VIEW_MODE.DEFAULT;
    }
  }

  destroy() {
    if (this.__eventEditComponent || this._eventComponent) {
      remove(this._eventEditComponent);
      remove(this._eventComponent);
      document.removeEventListener(`keydown`, this._escKeyDownHandler);
    }
  }

  _mainRender(preEventData) {
    this._eventComponent = new EventComponent(preEventData);
    this._eventEditComponent = new EventEditComponent(preEventData, this._offersModel.getOffers(), this._destinationsModel.getDestinations());

    this._eventComponent.setEditButtonClickHandler(this._replaceEventToEdit);

    this._eventEditComponent.setCloseButtonClickHandler(this._replaceEditToEvent);
    this._eventEditComponent.setDeleteButtonClickHandler(this._deleteElement);
    this._eventEditComponent.setSelectTypeClickHandler(this._chooseTripType);
    this._eventEditComponent.setSelectDestinationInputHandler(this._chooseDestination);
    this._eventEditComponent.setFavoriteButtonChangeHandler(this._setFavorite, this._eventEditComponent);
    // Тут мне нужно передавать значение сразу на сервер!!!
    // this._onDataChange(this._eventEditComponent, this, preEventData, Object.assign({}, preEventData, {
    //   favorite: !preEventData.favorite
    // }));

    this._eventEditComponent.setSubmitHandler((evt) => {
      evt.preventDefault();
      const data = this._eventEditComponent.getData(preEventData);
      console.log(`Данные с сервера`);
      console.log(preEventData);
      console.log(`Данные которые мне нужно отправить на сервер`);
      console.log(data);
    });
  }

  _chooseDestination(evt, destinationList) {
    const currentDestination = destinationList.find((elem) => (elem.name === evt.target.value));
    const destinationContainerElement = this._eventEditComponent.getElement().querySelector(`.event__details`);
    const currentDestinationListElement = destinationContainerElement.querySelector(`.event__section--destination`);

    if (!currentDestination) {
      return;
    }

    if (currentDestinationListElement) {
      currentDestinationListElement.remove();
    }

    const destinationsElement = new DestinationsComponent(currentDestination).getElement();

    render(destinationContainerElement, destinationsElement, RenderPosition.BEFOREEND);
  }

  _chooseTripType(evt, offersList) {
    const target = evt.target;

    if (target.tagName !== `LABEL`) {
      return;
    }

    const typeImgElement = this._eventEditComponent.getElement().querySelector(`.event__type-icon`);
    const offersContainerElement = this._eventEditComponent.getElement().querySelector(`.event__details`);
    const currentOffersListElement = offersContainerElement.querySelector(`.event__section--offers`);
    const tripToggleElement = this._eventEditComponent.getElement().querySelector(`#event-type-toggle-1`);
    const tripTypeNameElement = this._eventEditComponent.getElement().querySelector(`.event__type-output`);
    const tripTypeName = target.parentNode.firstElementChild.value;
    const currentOffer = offersList.find((elem) => (elem.type === tripTypeName));

    if (tripToggleElement.value === tripTypeName) {
      return;
    }

    if (currentOffersListElement) {
      currentOffersListElement.remove();
    }

    typeImgElement.src = `img/icons/${tripTypeName}.png`;
    tripToggleElement.value = tripTypeName;
    tripTypeNameElement.innerText = getCurrentPreInputText(tripTypeName);

    if (currentOffer.offers.length === 0) {
      return;
    }

    const offersElement = new OffersComponent(currentOffer).getElement();

    render(offersContainerElement, offersElement, RenderPosition.AFTERBEGIN);
  }

  _replaceEditToEvent() {
    document.removeEventListener(`keydown`, this._escKeyDownHandler);

    this._eventEditComponent.rerender();

    if (document.contains(this._eventEditComponent.getElement())) {
      replace(this._eventComponent, this._eventEditComponent);
    }

    this._viewMode = VIEW_MODE.DEFAULT;
  }

  _replaceEventToEdit() {
    this._onViewChange();

    replace(this._eventEditComponent, this._eventComponent);

    this._viewMode = VIEW_MODE.EDIT;

    document.addEventListener(`keydown`, this._escKeyDownHandler);
  }

  _escKeyDownHandler(evt) {
    const isEscKey = evt.key === `Escape` || evt.key === `Esc`;

    if (isEscKey) {
      this._replaceEditToEvent();
    }
  }

  _deleteElement(evt, eventData) {
    evt.preventDefault();
    console.log(eventData);
  }

  _setFavorite(component) {
    const favoriteValue = component.getElement().querySelector(`#event-favorite-1`);
    console.log(`Помечен как избранное?`);
    console.log(favoriteValue.checked);
  }
}
