export const getBoolean = () => (Math.random() > 0.5);

export const getRandomIntegerNumber = (min, max) => (min + Math.floor(max * Math.random()));

export const getRandomArr = (min, max, arr) => (
  new Array(getRandomIntegerNumber(min, max))
    .fill(``)
    .map(() => (arr[getRandomIntegerNumber(0, arr.length)]))
);

