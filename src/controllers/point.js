import {replace, render, remove, RenderPosition} from '../utils/render.js';
import EventComponent from '../components/event.js';
import EventEditComponent from '../components/event-edit.js';

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
    this._eventEditComponent = new EventEditComponent(preEventData, this._destinationsModel.getDestinations());

    this._eventComponent.setEditButtonClickHandler(this._replaceEventToEdit);

    this._eventEditComponent.setCloseButtonClickHandler(this._replaceEditToEvent);
    this._eventEditComponent.setDeleteButtonClickHandler(this._deleteElement);
    this._eventEditComponent.setSelectTypeClickHandler(this._chooseTripType);
    this._eventEditComponent.setSelectDestinationInputHandler(this._chooseDestination);
    this._eventEditComponent.setFavoriteButtonChangeHandler(() => {
      this._onDataChange(this._eventEditComponent, this, preEventData, Object.assign({}, preEventData, {
        favorite: !preEventData.favorite
      }));
    });
    this._eventEditComponent.setSubmitHandler((evt) => {
      evt.preventDefault();
      const data = this._eventEditComponent.getData();
      this._onDataChange(this._eventEditComponent, this, preEventData, data);
    });
  }

  _chooseDestination(evt, destinationList) {
    const currentDestination = destinationList.find((elem) => (elem.name === evt.target.value));

    if (currentDestination !== undefined) {
      this._onDataChange(this._eventEditComponent, this, this._eventData, Object.assign({}, this._eventData, {
        destination: currentDestination
      }));
    }
  }

  _chooseTripType(evt) {
    const target = evt.target;

    if (target.tagName !== `LABEL`) {
      return;
    }

    const typeImgElement = this._eventEditComponent.getElement().querySelector(`.event__type-icon`);
    const tripTypeName = target.parentNode.firstElementChild.value;
    const offersData = this._offersModel.getOffers();

    typeImgElement.src = `img/icons/${tripTypeName}.png`;

    const currentOffer = offersData.find((elem) => (elem.type === tripTypeName));

    this._onDataChange(this._eventEditComponent, this, this._eventData, Object.assign({}, this._eventData, {
      type: currentOffer.type,
      offers: currentOffer.offers
    }));
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

  _deleteElement(evt) {
    evt.preventDefault();
  }
}
