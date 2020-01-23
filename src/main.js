import API from './api.js';
import Points from './models/points.js';
import Offers from './models/offers.js';
import Destinations from './models/destinations.js';
import {RenderPosition, render} from './utils/render.js';
import ControlsComponent from './components/controls.js';
import TripInfoController from './controllers/trip-info.js';
import FilterController from './controllers/filter.js';
import TripController from './controllers/trip.js';

const AUTHORIZATION = `Basic dXNlckBwYXzdD29yZsAo=`;
const END_POINT = `https://htmlacademy-es-10.appspot.com/big-trip`;

const api = new API(END_POINT, AUTHORIZATION);
const pointsModel = new Points();
const offersModel = new Offers();
const destinationsModel = new Destinations();

const tripInfoElement = document.querySelector(`.trip-main__trip-info`);
const tripControlsElement = document.querySelector(`.trip-controls`);
const tripEventsElement = document.querySelector(`.trip-events`);

render(tripControlsElement, new ControlsComponent().getElement(), RenderPosition.AFTERBEGIN);

const tripInfoController = new TripInfoController(tripInfoElement, pointsModel);
const filterController = new FilterController(tripControlsElement, pointsModel);
const tripController = new TripController(tripEventsElement, pointsModel, offersModel, destinationsModel);

filterController.render();
tripInfoController.render();

Promise.all([api.getDestinations(), api.getOffers(), api.getPoints()])
  .then((values) => {
    const [destinations, offers, points] = values;
    destinationsModel.setDestinations(destinations);
    offersModel.setOffers(offers);
    pointsModel.setPoints(points);
    tripInfoController.updateTripInfo();
    tripController.render();
  });
