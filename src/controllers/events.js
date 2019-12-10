import {getBoolean} from '../utils/common.js';
import {RenderPosition, render, replace} from '../utils/render.js';
import DaysComponent from '../components/days.js';
import DaysListComponent from '../components/days-list.js';
import EventComponent from '../components/event.js';
import EventEditComponent from '../components/event-edit.js';
import StubComponent from '../components/stub.js';

const renderEvent = (container, eventData) => {
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

const renderDays = (daysData, container) => {
  daysData.forEach((dayData) => {
    const daysComponent = new DaysComponent(dayData);
    const eventListElement = daysComponent.getElement().querySelector(`.trip-events__list`);

    dayData.dayInfo.forEach((eventData) => {
      renderEvent(eventListElement, eventData);
    });

    render(container, daysComponent.getElement(), RenderPosition.BEFOREEND);
  });
};

export default class EventsController {
  constructor(container) {
    this._container = container;

    this._stubComponent = new StubComponent();
    this._daysListComponent = new DaysListComponent();
  }

  render(daysData) {
    // Рендер заглушки если дата не пришла, пока что сделал так
    if (getBoolean()) {
      render(this._container, this._stubComponent.getElement(), RenderPosition.BEFOREEND);
      return;
    }

    render(this._container, this._daysListComponent.getElement(), RenderPosition.BEFOREEND);

    renderDays(daysData, this._daysListComponent.getElement());
  }
}
