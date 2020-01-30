import TripInfoComponent from '../components/trip-info.js';
import {render, RenderPosition} from '../utils/render.js';
import {formatTimeMonth} from '../utils/date.js';

const MAX_DESTINATIONS_SHOW = 3;

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
    this._tripInfoComponent.show();
    this._setInfo();
    this._setPrice();
  }

  hide() {
    this._tripInfoComponent.hide();
  }

  _setInfo() {
    const infoTitleElement = document.querySelector(`.trip-info__title`);
    const infoDatesElement = document.querySelector(`.trip-info__dates`);
    const allPoints = this._pointsModel.getPoints();

    if (allPoints.length) {
      infoTitleElement.innerText = this._getTripInfoTitle(allPoints);
      infoDatesElement.innerHTML = this._getTripInfoDate(allPoints);
    }
  }

  _setPrice() {
    const priceElement = document.querySelector(`.trip-info__cost-value`);
    const allPoints = this._pointsModel.getPoints();
    const totalPointsPrice = allPoints.reduce((result, point) => {
      point.offers.forEach((offer) => (result = result + offer.price));
      return result + point.base_price;
    }, 0);

    priceElement.innerText = totalPointsPrice;
  }

  _getTripInfoDate(allPoints) {
    const lastIndex = allPoints.length - 1;

    return `${formatTimeMonth(allPoints[0].date_from)}&nbsp;—&nbsp;${formatTimeMonth(allPoints[lastIndex].date_to)}`;
  }

  _getTripInfoTitle(allPoints) {
    const lastIndex = allPoints.length - 1;

    return `${allPoints[1] ? `${allPoints[0].destination.name} — ${allPoints.length > MAX_DESTINATIONS_SHOW ? `... — ` : `${allPoints[1].destination.name} — `}${allPoints[lastIndex].destination.name}` : `${allPoints[0].destination.name}`}`;
  }
}
