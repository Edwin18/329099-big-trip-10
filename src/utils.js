const HOURS = {
  MIN: 0,
  MAX: 5
};

const MINUTES = {
  MIN: 0,
  MAX: 59
};

const MONTH = {
  '0': `JAN`,
  '1': `FEB`,
  '2': `MAR`,
  '3': `APR`,
  '4': `MAY`,
  '5': `JUN`,
  '6': `JUL`,
  '7': `AUG`,
  '8': `SEPT`,
  '9': `OCT`,
  '10': `NOV`,
  '11': `DEC`,
};

export const getBoolean = () => (Math.random() > 0.5);

export const getMonthString = (date) => (MONTH[date.getMonth()]);

export const getRandomIntegerNumber = (min, max) => (min + Math.floor(max * Math.random()));

export const getRandomArr = (min, max, arr) => (
  new Array(getRandomIntegerNumber(min, max))
    .fill(``)
    .map(() => (arr[getRandomIntegerNumber(0, arr.length)]))
);

export const generateUrls = (count, url) => (
  new Array(count)
    .fill(``)
    .map(() => (url))
);

export const getRandomDateTime = () => {
  const date = new Date();
  const randomHours = getRandomIntegerNumber(HOURS.MIN, HOURS.MAX);
  const randomMinutes = getRandomIntegerNumber(MINUTES.MIN, MINUTES.MAX);

  date.setHours(date.getHours() + randomHours);
  date.setMinutes(date.getMinutes() + randomMinutes);

  return date;
};

export const getDatetime = (date) => (`${date.getFullYear()}-${getPureDateNumber(date.getMonth())}-${getPureDateNumber(date.getDate())}`);

export const getDatetimeFull = (date) => (`${date.getFullYear()}-${getPureDateNumber(date.getMonth())}-${getPureDateNumber(date.getDate())}T${getPureDateNumber(date.getHours())}:${getPureDateNumber(date.getMinutes())}`);

export const getPureDateNumber = (number) => (number < 10 ? `0${number}` : `${number}`);
