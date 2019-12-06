import {getTripInfoElement} from './components/trip-info.js';
import {getTripControls} from './components/controls.js';
import {getTripFilter} from './components/filter.js';
import {getTripSort} from './components/sort.js';
import {getListOfTripDays, getTripDayInfo} from './components/days.js';
import {generateDays} from './mock/event.js';

const tripInfoElement = document.querySelector(`.trip-main__trip-info`);
const tripControlsElement = document.querySelector(`.trip-controls`);
const tripEventsElement = document.querySelector(`.trip-events`);
const data = generateDays();

const renderElement = (element, parent, position = `beforeend`) => {
  parent.insertAdjacentHTML(position, element);
};

renderElement(getTripInfoElement(data), tripInfoElement, `afterbegin`);
renderElement(getTripControls(), tripControlsElement.querySelector(`h2`), `afterend`);
renderElement(getTripFilter(), tripControlsElement);
renderElement(getTripSort(), tripEventsElement);
renderElement(getListOfTripDays(), tripEventsElement);

const listOfTripDaysElement = tripEventsElement.querySelector(`.trip-days`);
renderElement(getTripDayInfo(data), listOfTripDaysElement);


// Тестовые скрипты, пусть пока что побудут тут)
const getTotalPrice = () => {
  const allEvents = Array.from(document.querySelectorAll(`.event__price-value`));
  const allOffers = Array.from(document.querySelectorAll(`.event__offer-price`));
  const totalPriceElement = document.querySelector(`.trip-info__cost-value`);
  let eventsPrice = 0;
  let offersPrice = 0;

  allEvents.forEach((elem) => (eventsPrice = eventsPrice + parseInt(elem.innerText, 10)));
  allOffers.forEach((elem) => (offersPrice = offersPrice + parseInt(elem.innerText, 10)));

  totalPriceElement.innerText = eventsPrice + offersPrice;
};

getTotalPrice();
