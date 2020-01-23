import {RenderPosition, render, remove} from '../utils/render.js';
import DaysComponent from '../components/days.js';
import DaysListComponent from '../components/days-list.js';
import StubComponent from '../components/stub.js';
import SortComponent, {SORT_TYPE} from '../components/sort.js';
import EmptyDayComponent from '../components/empty-day.js';
import PointController from './point.js';
import moment from 'moment';

const getSortedByDaysData = (pointsData) => {
  const sortedPointsByFilter = [];
  let preResult = [];

  for (let i = 0; i < pointsData.length; i++) {
    const firstDate = pointsData[i];
    const result = pointsData.filter((elem) => (moment(elem.date_from).date() === moment(firstDate.date_from).date()));

    if (sortedPointsByFilter.length === 0) {
      sortedPointsByFilter.push(result);
      preResult = result;
    } else {
      if (moment(preResult[0].date_from).date() !== moment(result[0].date_from).date()) {
        sortedPointsByFilter.push(result);
        preResult = result;
      }
    }
  }

  return sortedPointsByFilter;
};

export default class TripController {
  constructor(container, pointsModel, offersModel, destinationsModel) {
    this._container = container;
    this._pointsModel = pointsModel;
    this._destinationsModel = destinationsModel;
    this._offersModel = offersModel;

    this._showedPointControllers = [];
    this._stubComponent = new StubComponent();
    this._daysListComponent = new DaysListComponent();
    this._sortComponent = new SortComponent();
    this._emptyDayComponent = new EmptyDayComponent();
    this._addNewEventBtnElement = document.querySelector(`.trip-main__event-add-btn`);

    this._onViewChange = this._onViewChange.bind(this);
    this._onFilterChange = this._onFilterChange.bind(this);
    this._setSortType = this._setSortType.bind(this);
    this._addNewEvent = this._addNewEvent.bind(this);

    this._pointsModel.setFilterChangeHandler(this._onFilterChange);

    this._addNewPointDayComponent = null;
    this._addNewPoint = false;
    this._addNewPointPointController = null;
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

    this._sortComponent.setSortTypeChangeHandler(this._setSortType);

    this._renderDays(this._daysListComponent.getElement(), points);
  }

  _setSortType(sortType) {
    let sortedData = [];

    switch (sortType) {
      case SORT_TYPE.DEFAULT:
        remove(this._daysListComponent);
        remove(this._emptyDayComponent);
        render(this._container, this._daysListComponent.getElement(), RenderPosition.BEFOREEND);
        this._renderDays(this._daysListComponent.getElement(), this._pointsModel.getPoints());
        break;
      case SORT_TYPE.TIME:
        sortedData = this._pointsModel.getPoints().slice().sort((a, b) => (moment(b.date_to).valueOf() - moment(b.date_from).valueOf()) - (moment(a.date_to).valueOf() - moment(a.date_from).valueOf()));
        this._renderSortedEvents(sortedData);
        break;
      case SORT_TYPE.PRICE:
        sortedData = this._pointsModel.getPoints().slice().sort((a, b) => b.base_price - a.base_price);
        this._renderSortedEvents(sortedData);
        break;
    }
  }

  _renderDays(container, pointsData) {
    this._showedPointControllers = [];
    const sortedPointsByDays = getSortedByDaysData(pointsData);

    sortedPointsByDays.forEach((day, index) => {
      const daysComponent = new DaysComponent(day, index);
      const eventListElement = daysComponent.getElement().querySelector(`.trip-events__list`);

      this._renderEvents(eventListElement, day);
      render(container, daysComponent.getElement(), RenderPosition.BEFOREEND);
    });
  }

  _renderSortedEvents(sortedData) {
    remove(this._daysListComponent);
    remove(this._emptyDayComponent);

    const emptyDayElement = this._emptyDayComponent.getElement();
    render(this._container, emptyDayElement, RenderPosition.BEFOREEND);

    this._showedPointControllers = [];

    this._renderEvents(emptyDayElement.querySelector(`.trip-events__list`), sortedData);
  }

  _renderEvents(container, pointsData) {
    pointsData.forEach((pointData) => {
      const pointController = new PointController(container, this._onViewChange, this._offersModel, this._destinationsModel);
      pointController.render(pointData);

      this._showedPointControllers.push(pointController);
    });
  }

  // _onDataChange(oldComponent, pointController, oldData, newData) {
  //   const isSuccess = this._pointsModel.updatePoint(oldData.id, newData);

  //   if (isSuccess) {
  //     pointController.reRender(newData, oldComponent);
  //   }
  // }

  _onViewChange() {
    this._showedPointControllers.forEach((it) => (it.setDefaultView()));
    if (this._addNewPointDayComponent && this._addNewPointPointController) {
      this._addNewEventBtnElement.disabled = false;
      this._addNewPoint = false;
      this._addNewPointPointController.destroy();
      this._addNewPointDayComponent.getElement().remove();
      this._addNewPointDayComponent.removeElement();
    }
  }

  _onFilterChange() {
    this._updatePoints();
  }

  _updatePoints() {
    this._sortComponent.setDefaultSortType();
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
    this._onViewChange();
    this._addNewEventBtnElement.disabled = true;
    this._addNewPoint = true;

    this._addNewPointDayComponent = new DaysComponent();
    const eventListElement = this._addNewPointDayComponent.getElement().querySelector(`.trip-events__list`);

    this._addNewPointPointController = new PointController(eventListElement, this._onViewChange, this._offersModel, this._destinationsModel);
    this._addNewPointPointController.addNewPoint(this._addNewEventBtnElement, this._addNewPointDayComponent, this._addNewPoint);
    this._addNewPointPointController.render();
    this._addNewPointPointController.replaceEventToEdit();

    this._showedPointControllers.push(this._addNewPointPointController);

    render(this._daysListComponent.getElement(), this._addNewPointDayComponent.getElement(), RenderPosition.AFTERBEGIN);
  }
}
