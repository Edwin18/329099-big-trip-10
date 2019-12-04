import {getTripInfoElement} from './components/trip-info.js';
import {getTripControls} from './components/controls.js';
import {getTripFilter} from './components/filter.js';
import {getTripSort} from './components/sort.js';
import {getListOfTripDays, getTripDayInfo} from './components/days.js';
// import {getListOfTripEvents, getTripEvent} from './components/event.js';
// import {getTripEditEvent} from './components/event-edit.js';
import {generateDays} from './mock/event.js';

const tripInfoElement = document.querySelector(`.trip-main__trip-info`);
const tripControlsElement = document.querySelector(`.trip-controls`);
const tripEventsElement = document.querySelector(`.trip-events`);

const renderElement = (element, parent, position = `beforeend`) => {
  parent.insertAdjacentHTML(position, element);
};

renderElement(getTripInfoElement(), tripInfoElement, `afterbegin`);
renderElement(getTripControls(), tripControlsElement.querySelector(`h2`), `afterend`);
renderElement(getTripFilter(), tripControlsElement);
renderElement(getTripSort(), tripEventsElement);
renderElement(getListOfTripDays(), tripEventsElement);

const data = generateDays();
const listOfTripDaysElement = tripEventsElement.querySelector(`.trip-days`);
renderElement(getTripDayInfo(data), listOfTripDaysElement);

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

const getTripInfo = () => {
  const tripInfoTitle = document.querySelector(`.trip-info__title`);
  const lastDays = data[data.length - 1].dayInfo;

  tripInfoTitle.innerText = `${data[0].dayInfo[0].moveTo} — ... — ${lastDays[lastDays.length - 1].moveTo}`;
};

getTotalPrice();
getTripInfo();
