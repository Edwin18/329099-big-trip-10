import {getMonthString} from '../utils.js';

const getTripInfoDate = (data) => {
  const lastIndex = data.length - 1;
  const dayDate = data[lastIndex].dayDate;

  return `${getMonthString(data[0].dayDate)} ${data[0].dayDate.getDate()}&nbsp;—&nbsp;${dayDate.getDate() + lastIndex}`;
};

const getTripInfoTitle = (data) => {
  const lastIndex = data.length - 1;
  const dayInfo = data[lastIndex].dayInfo;

  return `${data[0].dayInfo[0].moveTo} — ... — ${dayInfo[dayInfo.length - 1].moveTo}`;
};

export const getTripInfoElement = (data) => (`
  <div class="trip-info__main">
    <h1 class="trip-info__title">${getTripInfoTitle(data)}</h1>
    <p class="trip-info__dates">${getTripInfoDate(data)}</p>
  </div>
`);
