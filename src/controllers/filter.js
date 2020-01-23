import FilterComponent from '../components/filter.js';
import {render, RenderPosition} from '../utils/render.js';
import {FilterType} from '../const.js';

export default class FilterController {
  constructor(container, pointsModel) {
    this._container = container;
    this._pointsModel = pointsModel;

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
    this._pointsModel.setFilter(filterType);
    this._activeFilterType = filterType;
  }
}
