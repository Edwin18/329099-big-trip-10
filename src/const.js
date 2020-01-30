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

export const filters = [
  {text: `Everything`, name: `everything`, checked: `checked`},
  {text: `Future`, name: `future`, checked: ``},
  {text: `Past`, name: `past`, checked: ``}
];

export const sorts = [
  {text: `Event`, name: `event`, icon: false},
  {text: `Time`, name: `time`, icon: true},
  {text: `Price`, name: `price`, icon: true}
];

export const FilterType = {
  EVERYTHING: `everything`,
  FUTURE: `future`,
  PAST: `past`
};

export const VIEW_MODE = {
  DEFAULT: `default`,
  EDIT: `edit`
};

export const POINT_MODE = {
  DEFAULT: `default`,
  CREATE: `create`
};

export const BTN = {
  SAVE: `Save`,
  SAVING: `Saving...`,
  CREATE: `Create`,
  CREATING: `Creating...`,
  DELETE: `Delete`,
  DELETING: `Deleting...`
};
