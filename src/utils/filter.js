import {FilterType} from '../const.js';
import moment from 'moment';

const getFuturePoints = (points, nowDate) => {
  const resultPoints = [];

  points.forEach((point) => {
    if (moment(point.date_from).valueOf() > moment(nowDate).valueOf()) {
      resultPoints.push(point);
    }
  });

  return resultPoints;
};

const getPastPoints = (points, nowDate) => {
  const resultPoints = [];

  points.forEach((point) => {
    if (moment(point.date_to).valueOf() < moment(nowDate).valueOf()) {
      resultPoints.push(point);
    }
  });

  return resultPoints;
};

export const getPointsByFilter = (points, filterType) => {
  const nowDate = new Date();

  switch (filterType) {
    case FilterType.EVERYTHING:
      return points;
    case FilterType.FUTURE:
      return getFuturePoints(points, nowDate);
    case FilterType.PAST:
      return getPastPoints(points, nowDate);
  }

  return points;
};
