import {tripType} from '../mock/event.js';
import {replace, render, remove, RenderPosition} from '../utils/render.js';
import EventComponent from '../components/event.js';
import EventEditComponent from '../components/event-edit.js';

const VIEW_MODE = {
  DEFAULT: `default`,
  EDIT: `edit`
};

export default class PointController {
  constructor(container, onDataChange, onViewChange) {
    this._container = container;
    this._onDataChange = onDataChange;
    this._onViewChange = onViewChange;

    this._eventComponent = null;
    this._eventEditComponent = null;

    this._escKeyDownHandler = this._escKeyDownHandler.bind(this);
    this._replaceEditToEvent = this._replaceEditToEvent.bind(this);
    this._replaceEventToEdit = this._replaceEventToEdit.bind(this);

    this._viewMode = VIEW_MODE.DEFAULT;
  }

  render(eventData) {
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
    remove(this._eventEditComponent);
    remove(this._eventComponent);
    document.removeEventListener(`keydown`, this._escKeyDownHandler);
  }

  _mainRender(preEventData) {
    this._eventComponent = new EventComponent(preEventData);
    this._eventEditComponent = new EventEditComponent(preEventData);

    this._eventComponent.setEditButtonClickHandler(this._replaceEventToEdit);
    this._eventEditComponent.setSubmitHandler(this._replaceEditToEvent);
    this._eventEditComponent.setCloseButtonClickHandler(this._replaceEditToEvent);

    this._eventEditComponent.setFavoriteButtonClickHandler(() => {
      this._onDataChange(this._eventEditComponent, this, preEventData, Object.assign({}, preEventData, {
        favorite: !preEventData.favorite
      }));
    });

    this._eventEditComponent.setSelectTypeClickHandler((evt) => {
      const target = evt.target;
      const typeImgElement = this._eventEditComponent.getElement().querySelector(`.event__type-icon`);
      const typeInputElement = this._eventEditComponent.getElement().querySelector(`.event__label`);

      if (target.tagName !== `LABEL`) {
        return;
      }

      const tripPartitionName = target.parentNode.parentNode.firstElementChild.innerText;
      const tripTypeName = target.parentNode.firstElementChild.value;

      tripType.forEach((partition) => {
        if (partition.text === tripPartitionName) {
          partition.list.forEach((type) => {
            if (type.name === tripTypeName) {
              typeInputElement.innerText = `${type.text} ${partition.action}`;
            }
          });
        }
      });

      typeImgElement.src = `img/icons/${tripTypeName}.png`;
    });
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
}
