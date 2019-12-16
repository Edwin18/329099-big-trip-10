import {replace, render, RenderPosition} from '../utils/render.js';
import EventComponent from '../components/event.js';
import EventEditComponent from '../components/event-edit.js';

export const renderEvent = (container, eventData) => {
  const eventComponent = new EventComponent(eventData);
  const eventEditComponent = new EventEditComponent(eventData);

  const onEscKeyDown = (evt) => {
    const isEscKey = evt.key === `Escape` || evt.key === `Esc`;

    if (isEscKey) {
      replaceEventToEdit();
    }
  };

  const replaceEditToEvent = () => {
    replace(eventEditComponent, eventComponent);
    document.addEventListener(`keydown`, onEscKeyDown);
  };

  const replaceEventToEdit = () => {
    replace(eventComponent, eventEditComponent);
    document.removeEventListener(`keydown`, onEscKeyDown);
  };

  eventComponent.setEditButtonClickHandler(replaceEditToEvent);
  eventEditComponent.setSubmitHandler(replaceEventToEdit);
  eventEditComponent.setCloseButtonClickHandler(replaceEventToEdit);

  render(container, eventComponent.getElement(), RenderPosition.BEFOREEND);
};
