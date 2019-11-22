import {getTripInfoElement} from './components/trip-info.js';
import {getTripControls} from './components/controls.js';
import {getTripFilter} from './components/filter.js';
import {getTripSort} from './components/sort.js';
import {getListOfTripDays, getTripDay, getTripDayInfo} from './components/days.js';
import {getListOfTripEvents, getTripEvent} from './components/event.js';
import {getTripEditEvent} from './components/event-edit.js';

const TRIP_EVENT_COUNT = 3;

const tripInfoElement = document.querySelector(`.trip-main__trip-info`);
const tripControlsElement = document.querySelector(`.trip-controls`);
const tripEventsElement = document.querySelector(`.trip-events`);

const renderElement = (element, parent, position = `beforeend`) => {
  parent.insertAdjacentHTML(position, element);
};

const renderTripEvents = () => {
  for (let i = 0; i < TRIP_EVENT_COUNT; i++) {
    renderElement(getTripEvent(), listOfTripEventsElement);
  }
};

renderElement(getTripInfoElement(), tripInfoElement, `afterbegin`);
renderElement(getTripControls(), tripControlsElement.querySelector(`h2`), `afterend`);
renderElement(getTripFilter(), tripControlsElement);
renderElement(getTripSort(), tripEventsElement);
renderElement(getListOfTripDays(), tripEventsElement);

const listOfTripDaysElement = tripEventsElement.querySelector(`.trip-days`);
renderElement(getTripDay(), listOfTripDaysElement);

const tripDayElement = listOfTripDaysElement.querySelector(`.trip-days__item`);
renderElement(getTripDayInfo(), tripDayElement);
renderElement(getListOfTripEvents(), tripDayElement);

const listOfTripEventsElement = listOfTripDaysElement.querySelector(`.trip-events__list`);
renderElement(getTripEditEvent(), listOfTripEventsElement);
renderTripEvents();

