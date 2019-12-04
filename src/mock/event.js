import {getRandomIntegerNumber} from '../utils.js';

const DESCRIPTION_COUNT = {
  MIN: 1,
  MAX: 3
};

const ADDITIONAL_OPTION_COUNT = {
  MIN: 0,
  MAX: 3
};

const URL_COUNT = 5;

const TRIP_COUNT = 5;

const DAY_COUNT = 3;

const tripType = [
  `bus`,
  `check-in`,
  `drive`,
  `flight`,
  `restaurant`,
  `ship`,
  `sightseeing`,
  `taxi`,
  `train`,
  `transport`,
  `trip`
];

const destinationTowns = [
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

const getRandomArr = (min, max, arr) => {
  const counter = getRandomIntegerNumber(min, max);
  const description = [];

  for (let i = 0; i < counter; i++) {
    description.push(arr[getRandomIntegerNumber(0, arr.length)]);
  }

  return description;
};

const generateUrls = () => (
  new Array(URL_COUNT)
    .fill(``)
    .map(() => (`http://picsum.photos/300/150?r=${Math.random()}`))
);

const generateTrip = () => ({
  type: tripType[getRandomIntegerNumber(0, tripType.length)],
  moveTo: destinationTowns[getRandomIntegerNumber(0, destinationTowns.length)],
  date: new Date(),
  price: getRandomIntegerNumber(10, 500),
  addOptions: getRandomArr(ADDITIONAL_OPTION_COUNT.MIN, ADDITIONAL_OPTION_COUNT.MAX, additionalOptions),
  aboutText: getRandomArr(DESCRIPTION_COUNT.MIN, DESCRIPTION_COUNT.MAX, tripDescriptionList).join(`\n`),
  aboutImg: generateUrls()
});

const generateTrips = () => (
  new Array(TRIP_COUNT)
    .fill(``)
    .map(generateTrip)
);

export const generateDays = () => (
  new Array(DAY_COUNT)
    .fill(``)
    .map((elem, index) => ({
      day: index + 1,
      dayInfo: generateTrips(),
      dayDate: new Date()
    })
    )
);

console.log(generateDays());
