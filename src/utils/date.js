import {getRandomIntegerNumber} from './common.js';
import moment from 'moment';

const HOURS = {
  MIN: 0,
  MAX: 5
};

const MINUTES = {
  MIN: 0,
  MAX: 59
};

export const formatTimeMonth = (date) => (moment(date).format(`MMM DD`));

export const formatTime = (date) => (moment(date).format(`HH:mm`));

export const formatDatetime = (date) => (moment(date).format(`YYYY-MM-DD[T]HH:mm`));

export const getTimeDifference = (start, end) => {
  const startDate = moment(start);
  const endDate = moment(end);

  const duration = moment.duration(endDate.diff(startDate));

  const days = duration.get(`days`);
  const hours = duration.get(`hours`);
  const minutes = duration.get(`minutes`);

  const getDays = days <= 0 ? `` : `${days < 10 ? `0${days}D` : `${days}D`}`;
  const getHours = hours <= 0 ? `` : `${hours < 10 ? `0${hours}H` : `${hours}H`}`;
  const getMinutes = minutes <= 0 ? `` : `${minutes < 10 ? `0${minutes}M` : `${minutes}M`}`;

  return `${getDays} ${getHours} ${getMinutes}`;
};

export const getRandomDateTime = () => {
  const date = new Date();
  const randomHours = getRandomIntegerNumber(HOURS.MIN, HOURS.MAX);
  const randomMinutes = getRandomIntegerNumber(MINUTES.MIN, MINUTES.MAX);

  date.setHours(date.getHours() + randomHours);
  date.setMinutes(date.getMinutes() + randomMinutes);

  return date;
};
