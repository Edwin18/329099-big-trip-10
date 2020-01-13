import API from './api.js';
import Points from './models/points.js';
import Offers from './models/offers.js';
import Destinations from './models/destinations.js';
import {RenderPosition, render} from './utils/render.js';
import TripInfoComponent from './components/trip-info.js';
import ControlsComponent from './components/controls.js';
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

// render(tripInfoElement, new TripInfoComponent(pointsModel.getPointsAll()).getElement(), RenderPosition.AFTERBEGIN);
render(tripControlsElement, new ControlsComponent().getElement(), RenderPosition.AFTERBEGIN);


const filterController = new FilterController(tripControlsElement, pointsModel);
const tripController = new TripController(tripEventsElement, pointsModel, offersModel, destinationsModel, api);

filterController.render();

// api.getDestinations()
//   .then((destinations) => destinationsModel.setDestinations(destinations));

// api.getOffers()
//   .then((offers) => offersModel.setOffers(offers));

// api.getPoints()
//   .then((points) => {
//     pointsModel.setPoints(points);
//     tripController.render();
//   });

Promise.all([api.getDestinations(), api.getOffers(), api.getPoints()])
  .then((values) => {
    destinationsModel.setDestinations(values[0]);
    offersModel.setOffers(values[1]);
    pointsModel.setPoints(values[2]);
    tripController.render();
  });
