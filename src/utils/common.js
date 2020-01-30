import {tripType} from '../const.js';

export const reducer = (sum, current) => sum + current;

export const getCurrentPreInputText = (currentType) => {
  let result = ``;

  tripType.forEach((elem) => (
    elem.list.forEach((type) => {
      if (type.name === currentType) {
        result = `${type.text} ${elem.action}`;
      }
    })
  ));

  return result;
};

export const getDefaultEventData = (eventData) => (
  {
    'type': eventData ? eventData.type : ``,
    'date_from': eventData ? eventData.date_from : ``,
    'date_to': eventData ? eventData.date_to : ``,
    'destination': eventData ? eventData.destination : ``,
    'base_price': eventData ? eventData.base_price : ``,
    'is_favorite': eventData ? eventData.is_favorite : ``,
    'offers': eventData ? eventData.offers : ``,
  }
);
