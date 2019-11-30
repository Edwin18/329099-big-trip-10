const DESCRIPTION_COUNT = {
  MIN: 1,
  MAX: 3
};

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
  {name: `Add luggage`, price: 10},
  {name: `Switch to comfort class`, price: 150},
  {name: `Add meal`, price: 2},
  {name: `Choose seats`, price: 9},
  {name: `Travel by train`, price: 40}
];

const getRandomIntegerNumber = (min, max) => {
  return min + Math.floor(max * Math.random());
};

const getRandomArr = (min, max, arr) => {
  const counter = getRandomIntegerNumber(min, max);
  const description = [];

  for (let i = 0; i < counter; i++) {
    description.push(arr[getRandomIntegerNumber(0, arr.length)]);
  }

  return description;
};

export const generateTripInfo = () => {
  return {
    tripType: tripType[getRandomIntegerNumber(0, tripType.length)],
    city: destinationTowns[getRandomIntegerNumber(0, destinationTowns.length)],
    description: getRandomArr(DESCRIPTION_COUNT.MIN, DESCRIPTION_COUNT.MAX, tripDescriptionList).join(`\n`),
    additional: additionalOptions
  };
};
