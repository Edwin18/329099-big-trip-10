import {tripTypes} from '../const.js';

export const getCurrentPreInputText = (currentType) => {
  let result = ``;

  for (const elem of tripTypes) {
    const currentTypeResult = elem.list.find((innerElem) => (innerElem.name === currentType));
    if (currentTypeResult) {
      result = `${currentTypeResult.text} ${elem.action}`;
      break;
    }
  }

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
