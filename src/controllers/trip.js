import {RenderPosition, render, remove} from '../utils/render.js';
import DaysComponent from '../components/days.js';
import DaysListComponent from '../components/days-list.js';
import StubComponent from '../components/stub.js';
import SortComponent, {SORT_TYPE} from '../components/sort.js';
import EmptyDayComponent from '../components/empty-day.js';
import PointController from './point.js';
import moment from 'moment';

export default class TripController {
  constructor(container, pointsModel, offersModel, destinationsModel, api) {
    this._container = container;
    this._pointsModel = pointsModel;
    this._destinationsModel = destinationsModel;
    this._offersModel = offersModel;
    this._api = api;

    this._showedPointControllers = [];
    this._stubComponent = new StubComponent();
    this._daysListComponent = new DaysListComponent();
    this._sortComponent = new SortComponent();
    this._emptyDayComponent = new EmptyDayComponent();
    this._addNewEventBtnElement = document.querySelector(`.trip-main__event-add-btn`);

    this._onDataChange = this._onDataChange.bind(this);
    this._onViewChange = this._onViewChange.bind(this);
    this._onFilterChange = this._onFilterChange.bind(this);
    // this._removePoints = this._removePoints.bind(this);

    this._pointsModel.setFilterChangeHandler(this._onFilterChange);
    this._addNewEventBtnElement.addEventListener(`click`, this._addNewEvent);
  }

  render() {
    const points = this._pointsModel.getPointsAll();

    // Рендер заглушки если дата не пришла, пока что сделал так
    if (points.length === 0) {
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
          sortedData = points.slice().sort((a, b) => (moment(b.date_to).valueOf() - moment(b.date_from).valueOf()) - (moment(a.date_to).valueOf() - moment(a.date_from).valueOf()));
          this._renderSortedEvents(sortedData);
          break;
        case SORT_TYPE.PRICE:
          sortedData = points.slice().sort((a, b) => b.base_price - a.base_price);
          this._renderSortedEvents(sortedData);
          break;
      }
    });

    this._renderDays(this._daysListComponent.getElement(), points);
  }

  _renderDays(container, pointsData) {
    this._showedPointControllers = [];
    // const sortedPointsByDays = [];

    // for (let i = 0; i < pointsData.length; i++) {
    //   const arr = [];
    //   for (let k = 0; k < pointsData.length; k++) {
    //     if (moment(pointsData[i].date_from).format(`DD`) === moment(pointsData[k].date_from).format(`DD`)) {
    //       arr.push(pointsData[k]);
    //     }
    //   }
    //   sortedPointsByDays.push(arr);
    // const firstDate = moment(pointsData[i].date_from).format(`DD`);
    // const result = pointsData.filter((point) => (moment(point.date_from).format(`DD`) === firstDate));
    // console.log(result);
    // }
    // console.log(sortedPointsByDays);

    // console.log(sortedPointsByDays);

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
      const pointController = new PointController(container, this._onDataChange, this._onViewChange, this._offersModel, this._destinationsModel);
      pointController.render(pointData);

      this._showedPointControllers.push(pointController);
    });
  }

  _onDataChange(oldComponent, pointController, oldData, newData) {
    const isSuccess = this._pointsModel.updatePoint(oldData.id, newData);

    if (isSuccess) {
      pointController.reRender(newData, oldComponent);
    }
  }

  _onViewChange() {
    this._showedPointControllers.forEach((it) => (it.setDefaultView()));
  }

  _onFilterChange() {
    this._updatePoints();
  }

  _updatePoints() {
    this._removePoints();
    remove(this._daysListComponent);

    if (this._pointsModel.getPoints().length !== 0) {
      render(this._container, this._daysListComponent.getElement(), RenderPosition.BEFOREEND);
      this._renderDays(this._daysListComponent.getElement(), this._pointsModel.getPoints());
    }
  }

  _removePoints() {
    this._showedPointControllers.forEach((pointController) => pointController.destroy());
    this._showedPointControllers = [];
  }

  _addNewEvent() {
    console.log(`click`);
  }
}
