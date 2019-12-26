import {getRandomIntegerNumber, getRandomArr, getBoolean} from '../utils/common.js';
import {getRandomEndDate, getRandomStartDate} from '../utils/date.js';

const TRIP_COUNT = 10;
const URL_COUNT = 5;
const DESCRIPTION_COUNT = {
  MIN: 1,
  MAX: 3
};
const PRICE = {
  MIN: 50,
  MAX: 500
};

export const tripType = [
  {text: `Transfer`, action: `to`, list: [
    {text: `Taxi`, name: `taxi`},
    {text: `Bus`, name: `bus`},
    {text: `Train`, name: `train`},
    {text: `Ship`, name: `ship`},
    {text: `Transport`, name: `transport`},
    {text: `Drive`, name: `drive`},
    {text: `Flight`, name: `flight`}
  ]},
  {text: `Activity`, action: `in`, list: [
    {text: `Check-in`, name: `check-in`},
    {text: `Sightseeing`, name: `sightseeing`},
    {text: `Restaurant`, name: `restaurant`}
  ]}
];
export const destinationTowns = [
  `Amsterdam`,
  `Geneva`,
  `Chamonix`,
  `Saint Petersburg`
];
const tripDescriptionList = [
  `Lorem ipsum dolor sit amet, consectetur adipiscing elit.`,
  `Cras aliquet varius magna, non porta ligula feugiat eget.`,
  `Fusce tristique felis at fermentum pharetra.`,
  `Aliquam id orci ut lectus varius viverra.`,
  `Nullam nunc ex, convallis sed finibus eget, sollicitudin eget ante.`,
  `Phasellus eros mauris, condimentum sed nibh vitae, sodales efficitur ipsum.`,
  `Sed blandit, eros vel aliquam faucibus, purus ex euismod diam, eu luctus nunc ante ut dui.`,
  `Sed sed nisi sed augue convallis suscipit in sed felis.`,
  `Aliquam erat volutpat.`,
  `Nunc fermentum tortor ac porta dapibus.`,
  `In rutrum ac purus sit amet tempus.`
];
const additionalOptions = [
  {text: `Add luggage`, price: 10, name: `luggage`},
  {text: `Switch to comfort class`, price: 150, name: `comfort`},
  {text: `Add meal`, price: 2, name: `meal`},
  {text: `Choose seats`, price: 9, name: `seats`},
  {text: `Travel by train`, price: 40, name: `train`}
];

const generateOffers = () => {
  const offers = JSON.parse(JSON.stringify(additionalOptions));

  offers.forEach((elem) => (
    elem.checked = getBoolean()
  ));

  return offers;
};

const generateUrls = () => (
  new Array(URL_COUNT)
    .fill(``)
    .map(() => (`http://picsum.photos/300/150?r=${Math.random()}`))
);

const getRandomTripType = () => {
  const randomTypeList = tripType[getRandomIntegerNumber(0, tripType.length)];

  return randomTypeList.list[getRandomIntegerNumber(0, randomTypeList.list.length)].name;
};

const generateTrip = (index) => ({
  id: index + 1,
  type: getRandomTripType(),
  moveTo: destinationTowns[getRandomIntegerNumber(0, destinationTowns.length)],
  startDate: getRandomStartDate(),
  endDate: getRandomEndDate(),
  price: getRandomIntegerNumber(PRICE.MIN, PRICE.MAX),
  offers: generateOffers(),
  aboutText: getRandomArr(DESCRIPTION_COUNT.MIN, DESCRIPTION_COUNT.MAX, tripDescriptionList).join(`\n`),
  aboutImg: generateUrls(),
  favorite: getBoolean()
});

export const generateTrips = () => (
  new Array(TRIP_COUNT)
    .fill(``)
    .map((elem, index) => (
      generateTrip(index)
    ))
);
