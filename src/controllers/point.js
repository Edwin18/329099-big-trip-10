import {replace, render, remove, RenderPosition} from '../utils/render.js';
import {getCurrentPreInputText} from '../utils/common.js';
import {ViewMode, PointMode, Button} from '../const.js';
import EventComponent from '../components/event.js';
import EventEditComponent from '../components/event-edit.js';
import OffersComponent from '../components/offers.js';
import DestinationsComponent from '../components/destinations.js';
import flatpickr from 'flatpickr';
import '../../node_modules/flatpickr/dist/flatpickr.min.css';
import '../../node_modules/flatpickr/dist/themes/material_blue.css';

export default class PointController {
  constructor(container, viewChangeHandler, offersModel, destinationsModel, pointsModel, sortComponent, stubComponent) {
    this._container = container;
    this._eventData = null;
    this._viewChangeHandler = viewChangeHandler;
    this._offersModel = offersModel;
    this._destinationsModel = destinationsModel;
    this._pointsModel = pointsModel;
    this._sortComponent = sortComponent;
    this._stubComponent = stubComponent;

    this._addNewPoint = null;
    this._addNewPointBtnElement = null;
    this._addNewPointDayComponent = null;

    this._eventComponent = null;
    this._eventEditComponent = null;

    this._flatpickrs = [];

    this._escKeyDownHandler = this._escKeyDownHandler.bind(this);
    this._replaceEditToEvent = this._replaceEditToEvent.bind(this);
    this._replaceEventToEdit = this._replaceEventToEdit.bind(this);
    this._deleteElement = this._deleteElement.bind(this);
    this._setFavorite = this._setFavorite.bind(this);
    this._chooseTripType = this._chooseTripType.bind(this);
    this._chooseDestination = this._chooseDestination.bind(this);
    this._setTripTypeValidation = this._setTripTypeValidation.bind(this);
    this._setTripDestinationValidation = this._setTripDestinationValidation.bind(this);
    this._onDataSave = this._onDataSave.bind(this);
    this.shake = this.shake.bind(this);

    this._viewMode = ViewMode.DEFAULT;
    this._pointMode = PointMode.DEFAULT;
  }

  setDefaultView() {
    if (this._viewMode === ViewMode.EDIT) {
      this._replaceEditToEvent();
      this._viewMode = ViewMode.DEFAULT;
    }
  }

  removeFlatpickr() {
    if (this._flatpickrs.length !== 0) {
      this._flatpickrs.forEach((elem) => elem.destroy());
    }
  }

  render(eventData) {
    this._pointMode = PointMode.DEFAULT;

    if (!eventData) {
      this._pointMode = PointMode.CREATE;
    }

    this._eventData = eventData;
    this._mainRender(eventData);

    if (eventData) {
      render(this._container, this._eventComponent.getElement(), RenderPosition.BEFOREEND);
    } else {
      render(this._container, this._eventEditComponent.getElement(), RenderPosition.AFTERBEGIN);
      this._flatpickrInit(this._eventEditComponent.getElement().querySelector(`#event-start-time-1`));
      this._flatpickrInit(this._eventEditComponent.getElement().querySelector(`#event-end-time-1`));
    }
  }

  reRender(newData, oldComponent) {
    this.removeFlatpickr();
    this._mainRender(newData);
    replace(this._eventEditComponent, oldComponent);
    this._flatpickrInit(this._eventEditComponent.getElement().querySelector(`#event-start-time-1`), this._eventData.date_from);
    this._flatpickrInit(this._eventEditComponent.getElement().querySelector(`#event-end-time-1`), this._eventData.date_to);
  }

  shake() {
    this._eventEditComponent.setDefoultBtnText(this._pointMode);
    this._eventEditComponent.unlockForm();
    this._eventEditComponent.getElement().querySelector(`form`).style = `box-shadow: 0px 0px 0px 2px red;`;
    this._eventEditComponent.getElement().querySelector(`form`).classList.add(`shake`);
  }

  removeShake() {
    this._eventEditComponent.getElement().querySelector(`form`).style = `box-shadow: none;`;
    this._eventEditComponent.getElement().querySelector(`form`).classList.remove(`shake`);
  }

  destroy() {
    if (this._eventEditComponent) {
      remove(this._eventEditComponent);
    }

    if (this._eventComponent) {
      remove(this._eventComponent);
    }

    document.removeEventListener(`keydown`, this._escKeyDownHandler);
  }

  addNewPoint(addNewPointBtnElement, addNewPointDayComponent, addNewPoint) {
    this._addNewPointDayComponent = addNewPointDayComponent;
    this._addNewPointBtnElement = addNewPointBtnElement;
    this._addNewPoint = addNewPoint;
    document.addEventListener(`keydown`, this._escKeyDownHandler);
  }

  _setTripDestinationValidation(evt, inputElement) {
    inputElement.setCustomValidity(`Выберите пунт назначения из списка ниже`);

    const target = evt.target;
    const destinationList = this._destinationsModel.getDestinations();

    destinationList.forEach((destination) => {
      if (destination.name === target.value) {
        inputElement.setCustomValidity(``);
      }
    });
  }

  _setTripTypeValidation() {
    const mainTogleTypeElement = this._eventEditComponent.getElement().querySelector(`#event-type-toggle-1`);
    const allRadioTypeElements = Array.from(this._eventEditComponent.getElement().querySelectorAll(`.event__type-input`));

    mainTogleTypeElement.setCustomValidity(`Выберите тип поездки`);

    allRadioTypeElements.forEach((type) => {
      if (type.checked) {
        mainTogleTypeElement.setCustomValidity(``);
      }
    });
  }

  _setFavorite(component) {
    const data = Object.assign({}, this._eventData, {
      'is_favorite': component.getElement().querySelector(`#event-favorite-1`).checked
    });
    this._pointsModel.updatePoint(this._eventData.id, data, this, true);
    this.reRender(data, component);
  }

  _mainRender(preEventData) {
    if (preEventData) {
      this._eventComponent = new EventComponent(preEventData, this._offersModel.getOffers());
      this._eventComponent.setEditButtonClickHandler(this._replaceEventToEdit);
    }

    this._eventEditComponent = new EventEditComponent(preEventData, this._offersModel.getOffers(), this._destinationsModel.getDestinations(), this._addNewPoint, this._pointsModel.getPointsAll().length);
    this._eventEditComponent.setCloseButtonClickHandler(this._replaceEditToEvent);
    this._eventEditComponent.setDeleteButtonClickHandler(this._deleteElement);
    this._eventEditComponent.setSelectTypeClickHandler(this._chooseTripType);
    this._eventEditComponent.setSelectDestinationInputHandler(this._chooseDestination);
    this._eventEditComponent.setFavoriteButtonChangeHandler(this._setFavorite);
    this._eventEditComponent.setInputValidation(this._setTripDestinationValidation);
    this._eventEditComponent.setCreateButtonClickHandler(this._setTripTypeValidation);
    this._eventEditComponent.setSubmitHandler(this._onDataSave);
    this._eventEditComponent.setDateValidation();
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
    destinationContainerElement.style.display = `block`;
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

    const offersElement = new OffersComponent(currentOffer.offers).getElement();
    offersContainerElement.style.display = `block`;
    render(offersContainerElement, offersElement, RenderPosition.AFTERBEGIN);
  }

  _replaceEditToEvent() {
    document.removeEventListener(`keydown`, this._escKeyDownHandler);

    this._eventEditComponent.rerender();

    if (document.contains(this._eventEditComponent.getElement())) {
      replace(this._eventComponent, this._eventEditComponent);
    }

    this.removeFlatpickr();

    this._viewMode = ViewMode.DEFAULT;
  }

  _replaceEventToEdit() {
    this._viewChangeHandler();

    replace(this._eventEditComponent, this._eventComponent);
    this._flatpickrInit(this._eventEditComponent.getElement().querySelector(`#event-start-time-1`), this._eventData.date_from);
    this._flatpickrInit(this._eventEditComponent.getElement().querySelector(`#event-end-time-1`), this._eventData.date_to);

    this._viewMode = ViewMode.EDIT;

    document.addEventListener(`keydown`, this._escKeyDownHandler);
  }

  _flatpickrInit(dateElement, date) {
    this._flatpickrs.push(flatpickr(dateElement, {
      altInput: false,
      allowInput: true,
      enableTime: true,
      altFormat: `d/m/Y H:i`,
      defaultDate: date || new Date()
    }));
  }

  _deleteElement(evt, eventData) {
    evt.preventDefault();
    if (eventData) {
      this.removeShake();
      this._eventEditComponent.disabledForm();
      this._eventEditComponent.deletingBtnText(Button.DELETING);
      this._pointsModel.removePoint(eventData.id, this);
    } else {
      if (!this._pointsModel.getPointsAll().length) {
        this._stubComponent.renderStub();
      }

      if (this._addNewPointDayComponent) {
        this._addNewPointDayComponent.getElement().remove();
        this._addNewPointDayComponent.removeElement();
      }

      this.removeFlatpickr();
      this.destroy();
      this._addNewPointBtnElement.disabled = false;
      this._addNewPoint = false;
    }
  }

  _escKeyDownHandler(evt) {
    const isEscKey = evt.key === `Escape` || evt.key === `Esc`;

    if (isEscKey) {
      if (this._addNewPoint) {
        if (this._addNewPointDayComponent) {
          this._addNewPointDayComponent.getElement().remove();
          this._addNewPointDayComponent.removeElement();
        }

        if (!this._pointsModel.getPointsAll().length) {
          this._stubComponent.renderStub();
        }

        this.removeFlatpickr();
        this.destroy();
        this._addNewPointBtnElement.disabled = false;
        this._addNewPoint = false;
        document.removeEventListener(`keydown`, this._escKeyDownHandler);
      } else {
        this._replaceEditToEvent();
      }
    }
  }

  _onDataSave(evt, preEventData) {
    evt.preventDefault();
    this.removeShake();
    this._eventEditComponent.disabledForm();
    const data = this._eventEditComponent.getData(preEventData);

    switch (this._pointMode) {
      case PointMode.DEFAULT:
        this._eventEditComponent.savingBtnText(Button.SAVING);
        this._pointsModel.updatePoint(preEventData.id, data, this);
        break;
      case PointMode.CREATE:
        this._eventEditComponent.savingBtnText(Button.CREATING);
        this._pointsModel.addPoint(data, this);
        break;
    }
  }
}
