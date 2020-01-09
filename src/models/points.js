import {getTasksByFilter} from '../utils/filter.js';
import {FilterType} from '../const.js';

export default class Points {
  constructor() {
    this._points = [];
    this._activeFilterType = FilterType.EVERYTHING;

    this._filterChangeHandlers = [];
  }

  setPoints(points) {
    this._points = Array.from(points);
  }

  getPoints() {
    return getTasksByFilter(this._points, this._activeFilterType);
  }

  getPointsAll() {
    return this._points;
  }

  setFilter(filterType) {
    this._activeFilterType = filterType;
    this._callHandlers(this._filterChangeHandlers);
  }

  updatePoint(id, point) {
    const index = this._points.findIndex((it) => it.id === id);

    if (index === -1) {
      return false;
    }

    this._points = [].concat(this._points.slice(0, index), point, this._points.slice(index + 1));

    return true;
  }

  setFilterChangeHandler(handler) {
    this._filterChangeHandlers.push(handler);
  }

  _callHandlers(handlers) {
    handlers.forEach((handler) => handler());
  }
}
