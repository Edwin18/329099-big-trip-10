import TripInfoComponent from './components/trip-info.js';
import ControlsComponent from './components/controls.js';
import FilterComponent from './components/filter.js';
import SortComponent from './components/sort.js';
import DaysComponent from './components/days.js';
import EventComponent from './components/event.js';
import EventEditComponent from './components/event-edit.js';
import {generateDays} from './mock/event.js';
import {RenderPosition, render} from './utils.js';

const tripInfoElement = document.querySelector(`.trip-main__trip-info`);
const tripControlsElement = document.querySelector(`.trip-controls`);
const tripEventsElement = document.querySelector(`.trip-events`);
const data = generateDays();

const renderEvent = (container, eventData) => {
  const eventComponent = new EventComponent(eventData);
  const eventEditComponent = new EventEditComponent(eventData);

  const editButton = eventComponent.getElement().querySelector(`.event__rollup-btn`);
  editButton.addEventListener(`click`, () => {
    container.replaceChild(eventEditComponent.getElement(), eventComponent.getElement());
  });

  const editForm = eventEditComponent.getElement().querySelector(`form`);
  editForm.addEventListener(`submit`, () => {
    container.replaceChild(eventComponent.getElement(), eventEditComponent.getElement());
  });

  const editFormBtn = eventEditComponent.getElement().querySelector(`.event__rollup-btn`);
  editFormBtn.addEventListener(`click`, () => {
    container.replaceChild(eventComponent.getElement(), eventEditComponent.getElement());
  });


  render(container, eventComponent.getElement(), RenderPosition.BEFOREEND);
};

render(tripInfoElement, new TripInfoComponent(data).getElement(), RenderPosition.AFTERBEGIN);
render(tripControlsElement, new ControlsComponent().getElement(), RenderPosition.AFTERBEGIN);
render(tripControlsElement, new FilterComponent().getElement(), RenderPosition.BEFOREEND);
render(tripEventsElement, new SortComponent().getElement(), RenderPosition.BEFOREEND);
data.forEach((dayData) => {
  const daysComponent = new DaysComponent(dayData);
  const eventListElement = daysComponent.getElement().querySelector(`.trip-events__list`);

  dayData.dayInfo.forEach((eventData) => {
    renderEvent(eventListElement, eventData);
  });

  render(tripEventsElement, daysComponent.getElement(), RenderPosition.BEFOREEND);
});

// Тестовые скрипты, пусть пока что побудут тут)
const getTotalPrice = () => {
  const totalPriceElement = document.querySelector(`.trip-info__cost-value`);
  let totalPrice = 0;

  data.forEach((day) => {
    day.dayInfo.forEach((event) => {
      totalPrice = totalPrice + event.price;
      event.offers.forEach((offer) => {
        if (offer.checked === true) {
          totalPrice = totalPrice + offer.price;
        }
      });
    });
  });

  totalPriceElement.innerText = totalPrice;
};

getTotalPrice();
