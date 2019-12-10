import {generateDays} from './mock/event.js';
import {RenderPosition, render} from './utils/render.js';
import TripInfoComponent from './components/trip-info.js';
import ControlsComponent from './components/controls.js';
import FilterComponent from './components/filter.js';
import SortComponent from './components/sort.js';
import EventsController from './controllers/events.js';

const tripInfoElement = document.querySelector(`.trip-main__trip-info`);
const tripControlsElement = document.querySelector(`.trip-controls`);
const tripEventsElement = document.querySelector(`.trip-events`);
const data = generateDays();

render(tripInfoElement, new TripInfoComponent(data).getElement(), RenderPosition.AFTERBEGIN);
render(tripControlsElement, new ControlsComponent().getElement(), RenderPosition.AFTERBEGIN);
render(tripControlsElement, new FilterComponent().getElement(), RenderPosition.BEFOREEND);
render(tripEventsElement, new SortComponent().getElement(), RenderPosition.BEFOREEND);

const eventsController = new EventsController(tripEventsElement);
eventsController.render(data);

// Тестовые скрипты, пусть пока что побудут тут)
const getTotalPrice = () => {
  const totalPriceElement = document.querySelector(`.trip-info__cost-value`);
  let totalPrice = 0;

  data.forEach((day) => {
    day.dayInfo.forEach((event) => {
      totalPrice = totalPrice + event.price;
      event.offers.forEach((offer) => {
        if (offer.checked) {
          totalPrice = totalPrice + offer.price;
        }
      });
    });
  });

  totalPriceElement.innerText = totalPrice;
};

getTotalPrice();
