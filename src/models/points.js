import {getPointsByFilter} from '../utils/filter.js';
import {FilterType} from '../const.js';
import moment from 'moment';

export default class Points {
  constructor(api) {
    this._api = api;
    this._points = [];
    this._activeFilterType = FilterType.EVERYTHING;

    this._filterChangeHandlers = [];
    this._dataChangeHandlers = [];
  }

  setPoints(points) {
    this._points = Array.from(points);
  }

  setFilter(filterType) {
    this._activeFilterType = filterType;
    this._callHandlers(this._filterChangeHandlers);
  }

  getPoints() {
    const filteredPoints = getPointsByFilter(this._points, this._activeFilterType);
    return this._sortPoints(filteredPoints);
  }

  getPointsAll() {
    return this._sortPoints(this._points);
  }

  removePoint(id, pointController) {
    this._api.deletePoint(id)
    .then(() => {
      const index = this._points.findIndex((it) => it.id === id);

      this._points = [].concat(this._points.slice(0, index), this._points.slice(index + 1));

      this._callHandlers(this._dataChangeHandlers);
    })
    .catch(() => {
      pointController.shake();
    });
  }

  updatePoint(id, point, pointController, favorite = false) {
    this._api.updatePoint(id, point)
    .then((newPoint) => {
      const index = this._points.findIndex((it) => it.id === id);

      this._points = [].concat(this._points.slice(0, index), newPoint, this._points.slice(index + 1));

      if (!favorite) {
        this._callHandlers(this._dataChangeHandlers);
      }
    })
    .catch(() => {
      pointController.shake();
    });
  }

  addPoint(point, pointController) {
    this._api.createPoint(point)
    .then((newPoint) => {
      this._points = [].concat(newPoint, this._points);
      this._callHandlers(this._dataChangeHandlers);
    })
    .catch(() => {
      pointController.shake();
    });
  }

  setFilterChangeHandler(handler) {
    this._filterChangeHandlers.push(handler);
  }

  setDataChangeHandler(handler) {
    this._dataChangeHandlers.push(handler);
  }

  _sortPoints(points) {
    return points.slice().sort((a, b) => (moment(a.date_from).valueOf() - moment(b.date_from).valueOf()));
  }

  _callHandlers(handlers) {
    handlers.forEach((handler) => handler());
  }
}
