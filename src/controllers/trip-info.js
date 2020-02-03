import TripInfoComponent from '../components/trip-info.js';
import {render, RenderPosition} from '../utils/render.js';

export default class TripInfoController {
  constructor(container, pointsModel) {
    this._container = container;
    this._pointsModel = pointsModel;

    this._tripInfoComponent = null;
  }

  render() {
    this._tripInfoComponent = new TripInfoComponent(this._pointsModel.getPointsAll());

    render(this._container, this._tripInfoComponent.getElement(), RenderPosition.AFTERBEGIN);
  }

  updateTripInfo() {
    const allPoints = this._pointsModel.getPointsAll();
    this._tripInfoComponent.show();
    this._tripInfoComponent.setInfo(allPoints);
    this._tripInfoComponent.setPrice(allPoints);
  }

  hide() {
    this._tripInfoComponent.hide();
  }
}
