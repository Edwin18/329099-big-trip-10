import FilterComponent from '../components/filter.js';
import {render, RenderPosition} from '../utils/render.js';
import {FilterType} from '../const.js';

export default class FilterController {
  constructor(container, pointsModel, tripInfoController) {
    this._container = container;
    this._pointsModel = pointsModel;
    this._tripInfoController = tripInfoController;

    this._activeFilterType = FilterType.EVERYTHING;
    this._filterComponent = null;

    this._onFilterChange = this._onFilterChange.bind(this);
  }

  hide() {
    this._filterComponent.getElement().classList.add(`visually-hidden`);
  }

  show() {
    this._filterComponent.getElement().classList.remove(`visually-hidden`);
  }

  render() {
    this._filterComponent = new FilterComponent();
    this._filterComponent.setFilterChangeHandler(this._onFilterChange);

    render(this._container, this._filterComponent.getElement(), RenderPosition.BEFOREEND);
  }

  _onFilterChange(filterType) {
    if (!this._pointsModel.getPointsAll().length) {
      this._filterComponent.getElement().querySelector(`#filter-everything`).checked = true;
      this._activeFilterType = FilterType.EVERYTHING;
      return;
    }
    this._pointsModel.setFilter(filterType);
    this._activeFilterType = filterType;
  }

  setDefaultFilter() {
    this._onFilterChange(FilterType.EVERYTHING);
    this._filterComponent.getElement().querySelector(`#filter-everything`).checked = true;
  }
}
