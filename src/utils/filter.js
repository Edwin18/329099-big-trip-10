import {FilterType} from '../const.js';

const getFuturePoints = (points, nowDate) => {
  const resultPoints = [];

  points.forEach((point) => {
    if (point.startDate.getTime() > nowDate.getTime()) {
      resultPoints.push(point);
    }
  });

  return resultPoints;
};

const getPastPoints = (points, nowDate) => {
  const resultPoints = [];

  points.forEach((point) => {
    if (point.endDate.getTime() < nowDate.getTime()) {
      resultPoints.push(point);
    }
  });

  return resultPoints;
};

export const getTasksByFilter = (points, filterType) => {
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
