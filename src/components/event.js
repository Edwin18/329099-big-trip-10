import {getDatetimeFull, getPureDateNumber} from '../utils.js';

const getTimeDifference = (dateStart, dateEnd) => {
  let hoursDifference = dateEnd.getHours() - dateStart.getHours();
  let minutesDifference = dateEnd.getMinutes() - dateStart.getMinutes();

  if (dateStart.getMinutes() > dateEnd.getMinutes()) {
    minutesDifference = 0;
    minutesDifference = 60 - dateStart.getMinutes();
    minutesDifference = minutesDifference + dateEnd.getMinutes();
    hoursDifference = hoursDifference - 1;
  }

  const hoursResult = hoursDifference <= 0 ? `` : `${getPureDateNumber(hoursDifference)}H`;
  const minutesResult = minutesDifference <= 0 ? `` : `${getPureDateNumber(minutesDifference)}M`;

  return `${hoursResult} ${minutesResult}`;
};

const generateOfferList = (additions) => (
  additions.map((elem) => (`
    <li class="event__offer">
      <span class="event__offer-title">${elem.text}</span>
      +
      €&nbsp;<span class="event__offer-price">${elem.price}</span>
    </li>
  `))
  .join(`\n`)
);

export const getTripEvent = (day) => (
  day.dayInfo.map((elem) => (`
    <li class="trip-events__item">
      <div class="event">
        <div class="event__type">
          <img class="event__type-icon" width="42" height="42" src="img/icons/${elem.type}.png" alt="Event type icon">
        </div>
        <h3 class="event__title">${elem.moveTo} to airport</h3>

        <div class="event__schedule">
          <p class="event__time">
            <time class="event__start-time" datetime="${getDatetimeFull(elem.startDate)}">${getPureDateNumber(elem.startDate.getHours())}:${getPureDateNumber(elem.startDate.getMinutes())}</time>
            —
            <time class="event__end-time" datetime="${getDatetimeFull(elem.endDate)}">${getPureDateNumber(elem.endDate.getHours())}:${getPureDateNumber(elem.endDate.getMinutes())}</time>
          </p>
          <p class="event__duration">${getTimeDifference(elem.startDate, elem.endDate)}</p>
        </div>

        <p class="event__price">
          €&nbsp;<span class="event__price-value">${elem.price}</span>
        </p>

        <h4 class="visually-hidden">Offers:</h4>
        <ul class="event__selected-offers">
          ${generateOfferList(elem.addOptions)}
        </ul>

        <button class="event__rollup-btn" type="button">
          <span class="visually-hidden">Open event</span>
        </button>
      </div>
    </li>
  `))
  .join(`\n`)
);
