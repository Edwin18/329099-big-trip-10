import {RenderPosition, render, remove} from '../utils/render.js';
import ControlsComponent from '../components/controls.js';
import DaysComponent from '../components/days.js';
import DaysListComponent from '../components/days-list.js';
import StubComponent from '../components/stub.js';
import SortComponent, {SORT_TYPE} from '../components/sort.js';
import EmptyDayComponent from '../components/empty-day.js';
import StatisticsComponent from '../components/statistics.js';
import PointController from './point.js';
import moment from 'moment';

const getSortedByDaysData = (pointsData) => {
  const sortedPointsBySort = pointsData.slice().sort((a, b) => (moment(a.date_from).valueOf() - moment(b.date_from).valueOf()));
  const sortedPointsByFilter = [];
  let preResult = [];

  for (let i = 0; i < sortedPointsBySort.length; i++) {
    const firstDate = sortedPointsBySort[i];
    const result = sortedPointsBySort.filter((elem) => (moment(elem.date_from).date() === moment(firstDate.date_from).date() && moment(elem.date_from).month() === moment(firstDate.date_from).month()));

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
  constructor(container, controlContainer, pointsModel, offersModel, destinationsModel, filterController, api, tripInfoController) {
    this._container = container;
    this._controlContainer = controlContainer;
    this._pointsModel = pointsModel;
    this._destinationsModel = destinationsModel;
    this._offersModel = offersModel;
    this._api = api;
    this._tripInfoController = tripInfoController;

    this._showedPointControllers = [];
    this._setViewControll = true;
    this._currentSortType = SORT_TYPE.DEFAULT;

    this._stubComponent = new StubComponent(this._container);
    this._daysListComponent = new DaysListComponent();
    this._sortComponent = new SortComponent();
    this._emptyDayComponent = new EmptyDayComponent();
    this._controlsComponent = new ControlsComponent();
    this._filterController = filterController;
    this._statisticsComponent = null;
    this._pointController = null;

    this._statisticsContainerElement = document.querySelector(`.page-body__container`);
    this._tripControllerElement = document.querySelector(`.trip-events`);
    this._addNewPointBtnElement = document.querySelector(`.trip-main__event-add-btn`);

    this._onViewChange = this._onViewChange.bind(this);
    this._onFilterChange = this._onFilterChange.bind(this);
    this._onDataChange = this._onDataChange.bind(this);
    this._setSortType = this._setSortType.bind(this);
    this._addNewEvent = this._addNewEvent.bind(this);
    this._setView = this._setView.bind(this);
    this._shake = this._shake.bind(this);

    this._addNewPointDayComponent = null;
    this._addNewPointPointController = null;
    this._addNewPoint = false;
    this._addNewPointBtnElement.addEventListener(`click`, this._addNewEvent);

    this._pointsModel.setFilterChangeHandler(this._onFilterChange);
    this._pointsModel.setDataChangeHandler(this._onDataChange);
    this._pointsModel.setShakeHandler(this._shake);
  }

  render() {
    const points = this._pointsModel.getPoints();

    this._controlsComponent.setViewClickHandler(this._setView);
    render(this._controlContainer, this._controlsComponent.getElement(), RenderPosition.AFTERBEGIN);
    this._statisticsComponent = new StatisticsComponent(points);
    this._statisticsComponent.hide();
    // Рендер заглушки если дата не пришла, пока что сделал так
    if (!points.length) {
      this._stubComponent.renderStub();
      return;
    }

    this._sortComponent.setSortTypeChangeHandler(this._setSortType);


    this._renderDays(this._daysListComponent.getElement(), points);

    render(this._container, this._sortComponent.getElement(), RenderPosition.AFTERBEGIN);
    render(this._container, this._daysListComponent.getElement(), RenderPosition.BEFOREEND);
    render(this._container.parentNode, this._statisticsComponent.getElement(), RenderPosition.BEFOREEND);
  }

  _hide() {
    this._tripControllerElement.classList.add(`visually-hidden`);
  }

  _show() {
    this._tripControllerElement.classList.remove(`visually-hidden`);
  }

  _setView(evt) {
    const points = this._pointsModel.getPointsAll();
    const target = evt.target;
    const tableElement = this._controlsComponent.getElement().querySelector(`#table-view`);
    const statsElement = this._controlsComponent.getElement().querySelector(`#stats-view`);

    if (target.id === `stats-view`) {
      if (this._setViewControll) {
        if (!points.length) {
          return;
        }
        this._onViewChange();
        // При смене видов меняет фильтр на дефолтное значение
        this._filterController.setDefaultFilter();

        tableElement.classList.remove(`trip-tabs__btn--active`);
        statsElement.classList.add(`trip-tabs__btn--active`);
        this._addNewPointBtnElement.disabled = true;
        this._filterController.hide();
        this._statisticsComponent.show(points);
        this._hide();
        this._setViewControll = false;
        this._addNewPointBtnElement.disabled = true;
      }
    }

    if (target.id === `table-view`) {
      statsElement.classList.remove(`trip-tabs__btn--active`);
      tableElement.classList.add(`trip-tabs__btn--active`);
      this._addNewPointBtnElement.disabled = false;
      this._filterController.show();
      this._statisticsComponent.hide();
      this._show();
      this._setViewControll = true;
      this._addNewPointBtnElement.disabled = false;
    }
  }

  _setSortType(sortType) {
    let sortedData = [];

    switch (sortType) {
      case SORT_TYPE.DEFAULT:
        this._removeNewEvent();
        this._sortComponent.removeDirection();
        remove(this._daysListComponent);
        remove(this._emptyDayComponent);
        render(this._container, this._daysListComponent.getElement(), RenderPosition.BEFOREEND);
        this._renderDays(this._daysListComponent.getElement(), this._pointsModel.getPoints());
        this._currentSortType = SORT_TYPE.DEFAULT;
        this._tripInfoController.updateTripInfo();
        break;
      case SORT_TYPE.TIME:
        sortedData = this._pointsModel.getPoints().slice().sort((a, b) => (moment(b.date_to).valueOf() - moment(b.date_from).valueOf()) - (moment(a.date_to).valueOf() - moment(a.date_from).valueOf()));
        this._renderSortedEvents(sortedData);
        this._removeNewEvent();
        this._sortComponent.removeDirection();
        this._sortComponent.setDirection(SORT_TYPE.TIME);
        this._currentSortType = SORT_TYPE.TIME;
        this._tripInfoController.updateTripInfo();
        break;
      case SORT_TYPE.PRICE:
        sortedData = this._pointsModel.getPoints().slice().sort((a, b) => b.base_price - a.base_price);
        this._renderSortedEvents(sortedData);
        this._removeNewEvent();
        this._sortComponent.removeDirection();
        this._sortComponent.setDirection(SORT_TYPE.PRICE);
        this._currentSortType = SORT_TYPE.PRICE;
        this._tripInfoController.updateTripInfo();
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
      this._pointController = new PointController(container, this._onViewChange, this._offersModel, this._destinationsModel, this._pointsModel, this._sortComponent, this._stubComponent);
      this._pointController.render(pointData);

      this._showedPointControllers.push(this._pointController);
    });
  }

  _onViewChange() {
    this._removeNewEvent();
    this._showedPointControllers.forEach((it) => {
      it.setDefaultView();
      it.removeFlatpickr();
    });

    if (this._addNewPointDayComponent && this._addNewPointPointController) {
      this._addNewPointBtnElement.disabled = false;
      this._addNewPoint = false;
      this._addNewPointPointController.destroy();
      this._addNewPointDayComponent.getElement().remove();
      this._addNewPointDayComponent.removeElement();
    }
  }

  _onDataChange() {
    this._currentSortType = this._sortComponent.getElement().querySelector(`[name="trip-sort"]:checked`).nextElementSibling.dataset.sortType;
    this._showedPointControllers.forEach((it) => (it.removeFlatpickr()));

    if (this._currentSortType === SORT_TYPE.DEFAULT) {
      this._removeNewEvent();
      this._sortComponent.removeDirection();
      this._sortComponent.setDefaultSortType();
      this._removePoints();
      remove(this._daysListComponent);
      this.render();
      this._tripInfoController.updateTripInfo();
    } else {
      this._onViewChange();
      this._setSortType(this._currentSortType);
    }

    if (!this._pointsModel.getPointsAll().length) {
      remove(this._sortComponent);
      this._tripInfoController.updateTripInfo();
      this._tripInfoController.hide();
    }
  }

  _shake() {
    if (this._addNewPointPointController) {
      this._addNewPointPointController.shake();
    } else {
      this._pointController.shake();
    }
  }

  _onFilterChange() {
    if (!this._pointsModel.getPointsAll().length) {
      return;
    }
    this._updatePoints();
    this._tripInfoController.updateTripInfo();
  }

  _updatePoints() {
    this._removeNewEvent();
    this._sortComponent.removeDirection();
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

  _removeNewEvent() {
    if (this._addNewPointDayComponent) {
      this._addNewPointDayComponent.getElement().remove();
      this._addNewPointDayComponent.removeElement();
    }

    if (this._addNewPointPointController) {
      this._addNewPointPointController.destroy();
      this._addNewPointPointController.removeFlatpickr();
    }
    this._addNewPointBtnElement.disabled = false;
    this._addNewPoint = false;
  }

  _addNewEvent() {
    if (this._pointsModel.getPointsAll().length) {
      this._onViewChange();
      this._addNewPointBtnElement.disabled = true;
      this._addNewPoint = true;
      let eventListElement;

      if (this._currentSortType === SORT_TYPE.DEFAULT) {
        this._addNewPointDayComponent = new DaysComponent();
        eventListElement = this._addNewPointDayComponent.getElement().querySelector(`.trip-events__list`);
        render(this._daysListComponent.getElement(), this._addNewPointDayComponent.getElement(), RenderPosition.AFTERBEGIN);
      } else {
        eventListElement = this._emptyDayComponent.getElement().querySelector(`.trip-events__list`);
      }

      this._addNewPointPointController = new PointController(eventListElement, this._onViewChange, this._offersModel, this._destinationsModel, this._pointsModel, this._sortComponent, this._stubComponent);
      this._addNewPointPointController.addNewPoint(this._addNewPointBtnElement, this._addNewPointDayComponent, this._addNewPoint);
      this._addNewPointPointController.render();

      this._showedPointControllers.push(this._addNewPointPointController);
    } else {
      this._onViewChange();
      this._addNewPointBtnElement.disabled = true;
      this._addNewPoint = true;

      remove(this._stubComponent);

      this._addNewPointPointController = new PointController(this._tripControllerElement, this._onViewChange, this._offersModel, this._destinationsModel, this._pointsModel, this._sortComponent, this._stubComponent);
      this._addNewPointPointController.addNewPoint(this._addNewPointBtnElement, this._addNewPointDayComponent, this._addNewPoint);
      this._addNewPointPointController.render();

      this._showedPointControllers.push(this._addNewPointPointController);
    }
  }
}
