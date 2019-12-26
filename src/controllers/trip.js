import {RenderPosition, render, remove} from '../utils/render.js';
import DaysComponent from '../components/days.js';
import DaysListComponent from '../components/days-list.js';
import StubComponent from '../components/stub.js';
import SortComponent, {SORT_TYPE} from '../components/sort.js';
import EmptyDayComponent from '../components/empty-day.js';
import PointController from './point.js';

export default class TripController {
  constructor(container, pointsModel) {
    this._container = container;
    this._pointsModel = pointsModel;

    this._showedPointControllers = [];
    this._stubComponent = new StubComponent();
    this._daysListComponent = new DaysListComponent();
    this._sortComponent = new SortComponent();
    this._emptyDayComponent = new EmptyDayComponent();

    this._onDataChange = this._onDataChange.bind(this);
    this._onViewChange = this._onViewChange.bind(this);
  }

  render() {
    const points = this._pointsModel.getPoints();

    // Рендер заглушки если дата не пришла, пока что сделал так
    if (!points) {
      render(this._container, this._stubComponent.getElement(), RenderPosition.BEFOREEND);
      return;
    }

    render(this._container, this._sortComponent.getElement(), RenderPosition.BEFOREEND);
    render(this._container, this._daysListComponent.getElement(), RenderPosition.BEFOREEND);

    this._sortComponent.setSortTypeChangeHandler((sortType) => {
      let sortedData = [];

      switch (sortType) {
        case SORT_TYPE.DEFAULT:
          remove(this._daysListComponent);
          remove(this._emptyDayComponent);
          render(this._container, this._daysListComponent.getElement(), RenderPosition.BEFOREEND);
          this._renderDays(this._daysListComponent.getElement(), points);
          break;
        case SORT_TYPE.TIME:
          sortedData = points.slice().sort((a, b) => (b.endDate.getTime() - b.startDate.getTime()) - (a.endDate.getTime() - a.startDate.getTime()));
          this._renderSortedEvents(sortedData);
          break;
        case SORT_TYPE.PRICE:
          sortedData = points.slice().sort((a, b) => b.price - a.price);
          this._renderSortedEvents(sortedData);
          break;
      }
    });

    this._renderDays(this._daysListComponent.getElement(), points);
  }

  _renderDays(container, pointsData) {
    this._showedPointControllers = [];

    const daysComponent = new DaysComponent(pointsData);
    const eventListElement = daysComponent.getElement().querySelector(`.trip-events__list`);

    this._renderEvent(eventListElement, pointsData);

    render(container, daysComponent.getElement(), RenderPosition.BEFOREEND);
  }

  _renderSortedEvents(sortedData) {
    remove(this._daysListComponent);
    remove(this._emptyDayComponent);

    const emptyDayElement = this._emptyDayComponent.getElement();
    render(this._container, emptyDayElement, RenderPosition.BEFOREEND);

    this._showedPointControllers = [];

    this._renderEvent(emptyDayElement.querySelector(`.trip-events__list`), sortedData);
  }

  _renderEvent(container, pointsData) {
    pointsData.forEach((pointData) => {
      const pointController = new PointController(container, this._onDataChange, this._onViewChange);
      pointController.render(pointData);

      this._showedPointControllers.push(pointController);
    });
  }

  _onDataChange(oldComponent, pointController, oldData, newData) {
    const isSuccess = this._pointsModel.updateTask(oldData.id, newData);

    if (isSuccess) {
      pointController.reRender(newData, oldComponent);
    }
  }

  _onViewChange() {
    this._showedPointControllers.forEach((it) => (it.setDefaultView()));
  }
}
