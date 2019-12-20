// import {getBoolean} from '../utils/common.js';
import {RenderPosition, render, remove} from '../utils/render.js';
import DaysComponent from '../components/days.js';
import DaysListComponent from '../components/days-list.js';
import StubComponent from '../components/stub.js';
import SortComponent, {SORT_TYPE} from '../components/sort.js';
import EmptyDayComponent from '../components/empty-day.js';
import PointController from './point.js';

const renderDays = (container, daysData, onDataChange) => {
  daysData.forEach((dayData) => {
    const daysComponent = new DaysComponent(dayData);
    const eventListElement = daysComponent.getElement().querySelector(`.trip-events__list`);

    dayData.dayInfo.forEach((eventData) => {
      const pointController = new PointController(eventListElement, onDataChange);
      pointController.render(eventData);
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

export default class TripController {
  constructor(container) {
    this._container = container;

    this._daysData = [];
    this._stubComponent = new StubComponent();
    this._daysListComponent = new DaysListComponent();
    this._sortComponent = new SortComponent();
    this._emptyDayComponent = new EmptyDayComponent();

    this._onDataChange = this._onDataChange.bind(this);
  }

  render(daysData) {
    this._daysData = daysData;
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

      switch (sortType) {
        case SORT_TYPE.DEFAULT:
          remove(this._daysListComponent);
          remove(this._emptyDayComponent);
          render(this._container, this._daysListComponent.getElement(), RenderPosition.BEFOREEND);
          renderDays(this._daysListComponent.getElement(), this._daysData, this._onDataChange);
          break;
        case SORT_TYPE.TIME:
          sortedData = allEvents.slice().sort((a, b) => (b.endDate.getTime() - b.startDate.getTime()) - (a.endDate.getTime() - a.startDate.getTime()));
          remove(this._daysListComponent);
          remove(this._emptyDayComponent);
          render(this._container, this._emptyDayComponent.getElement(), RenderPosition.BEFOREEND);
          sortedData.forEach((eventData) => (
            new PointController(this._emptyDayComponent.getElement().querySelector(`.trip-events__list`)).render(eventData)
          ));
          break;
        case SORT_TYPE.PRICE:
          sortedData = allEvents.slice().sort((a, b) => b.price - a.price);
          remove(this._daysListComponent);
          remove(this._emptyDayComponent);
          render(this._container, this._emptyDayComponent.getElement(), RenderPosition.BEFOREEND);
          sortedData.forEach((eventData) => (
            new PointController(this._emptyDayComponent.getElement().querySelector(`.trip-events__list`)).render(eventData)
          ));
          break;
      }
    });

    renderDays(this._daysListComponent.getElement(), this._daysData, this._onDataChange);
  }

  _onDataChange(pointController, oldData, newData) {
    const index = this._daysData[0].dayInfo.findIndex((it) => it === oldData);

    if (index === -1) {
      return;
    }
    this._daysData[0].dayInfo = [].concat(this._daysData[0].dayInfo.slice(0, index), newData, this._daysData[0].dayInfo.slice(index + 1));

    pointController.render(this._daysData[0].dayInfo[index]);
  }
}
