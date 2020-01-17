import AbstractComponent from './abstract-component.js';

const getImgList = (aboutImg) => (
  aboutImg.map((img) => (
    `<img class="event__photo" src="${img.src}" alt="${img.description}">`
  ))
  .join(`\n`)
);

const getDestinationContainer = (destinationsData) => (
  `<section class="event__section  event__section--destination">
    <h3 class="event__section-title  event__section-title--destination">Destination</h3>
    <p class="event__destination-description">${destinationsData.description}</p>
    <div class="event__photos-container">
      <div class="event__photos-tape">
        ${getImgList(destinationsData.pictures)}
      </div>
    </div>
  </section>`
);

export default class DestinationsComponent extends AbstractComponent {
  constructor(destinationsData) {
    super();
    this._destinationsData = destinationsData;
  }

  getTemplate() {
    return getDestinationContainer(this._destinationsData);
  }
}
