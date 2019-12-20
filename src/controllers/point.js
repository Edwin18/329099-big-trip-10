import {replace, render, RenderPosition} from '../utils/render.js';
import EventComponent from '../components/event.js';
import EventEditComponent from '../components/event-edit.js';

export default class PointController {
  constructor(container, onDataChange) {
    this._container = container;
    this._onDataChange = onDataChange;
  }

  render(eventData) {
    this._eventComponent = new EventComponent(eventData);
    this._eventEditComponent = new EventEditComponent(eventData);

    const onEscKeyDown = (evt) => {
      const isEscKey = evt.key === `Escape` || evt.key === `Esc`;

      if (isEscKey) {
        this._replaceEventToEdit();
      }
    };

    const replaceEditToEvent = () => {
      replace(this._eventEditComponent, this._eventComponent);
      document.addEventListener(`keydown`, onEscKeyDown);
    };

    const replaceEventToEdit = () => {
      replace(this._eventComponent, this._eventEditComponent);
      document.removeEventListener(`keydown`, onEscKeyDown);
    };

    this._eventComponent.setEditButtonClickHandler(replaceEditToEvent);
    this._eventEditComponent.setSubmitHandler(replaceEventToEdit);
    this._eventEditComponent.setCloseButtonClickHandler(replaceEventToEdit);

    this._eventEditComponent.setFavoriteButtonClickHandler(() => {
      this._onDataChange(this, eventData, Object.assign({}, eventData, {
        favorite: !eventData.favorite
      }));
    });

    render(this._container, this._eventComponent.getElement(), RenderPosition.BEFOREEND);
  }
}
