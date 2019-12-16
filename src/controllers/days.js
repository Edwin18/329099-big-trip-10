// import {getBoolean} from '../utils/common.js';
import {RenderPosition, render, remove} from '../utils/render.js';
import DaysComponent from '../components/days.js';
import DaysListComponent from '../components/days-list.js';
import StubComponent from '../components/stub.js';
import SortComponent, {SORT_TYPE} from '../components/sort.js';
import EmptyDayComponent from '../components/empty-day.js';
import {renderEvent} from './event.js';

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

const getAllEvents = (data) => {
  const result = [];

  data.forEach((day) => (
    day.dayInfo.forEach((event) => (
      result.push(event)
    ))
  ));

  return result;
};

export default class EventsController {
  constructor(container, daysData) {
    this._container = container;
    this._daysData = daysData;

    this._stubComponent = new StubComponent();
    this._daysListComponent = new DaysListComponent();
    this._sortComponent = new SortComponent();
    this._emptyDayComponent = new EmptyDayComponent();
  }

  render() {
    // // Рендер заглушки если дата не пришла, пока что сделал так
    // if (getBoolean()) {
    //   render(this._container, this._stubComponent.getElement(), RenderPosition.BEFOREEND);
    //   return;
    // }

    render(this._container, this._sortComponent.getElement(), RenderPosition.BEFOREEND);
    render(this._container, this._daysListComponent.getElement(), RenderPosition.BEFOREEND);

    this._sortComponent.setSortTypeChangeHandler((sortType) => {
      const allEvents = getAllEvents(this._daysData);
      let sortedData = [];

      // sort
      switch (sortType) {
        case SORT_TYPE.TIME:
          sortedData = allEvents.slice().sort((a, b) => (b.endDate.getTime() - b.startDate.getTime()) - (a.endDate.getTime() - a.startDate.getTime()));
          break;
        case SORT_TYPE.PRICE:
          sortedData = allEvents.slice().sort((a, b) => b.price - a.price);
          break;
      }

      // render
      switch (sortType) {
        case SORT_TYPE.DEFAULT:
          remove(this._daysListComponent);
          remove(this._emptyDayComponent);
          render(this._container, this._daysListComponent.getElement(), RenderPosition.BEFOREEND);
          renderDays(this._daysData, this._daysListComponent.getElement());
          break;
        case SORT_TYPE.TIME:
          remove(this._daysListComponent);
          remove(this._emptyDayComponent);
          render(this._container, this._emptyDayComponent.getElement(), RenderPosition.BEFOREEND);
          sortedData.forEach((event) => (
            renderEvent(this._emptyDayComponent.getElement().querySelector(`.trip-events__list`), event)
          ));
          break;
        case SORT_TYPE.PRICE:
          remove(this._daysListComponent);
          remove(this._emptyDayComponent);
          render(this._container, this._emptyDayComponent.getElement(), RenderPosition.BEFOREEND);
          sortedData.forEach((event) => (
            renderEvent(this._emptyDayComponent.getElement().querySelector(`.trip-events__list`), event)
          ));
          break;
      }
    });

    renderDays(this._daysData, this._daysListComponent.getElement());
  }
}
