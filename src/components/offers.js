import AbstractComponent from './abstract-component.js';

const getOffersClassName = (string) => (string.slice().toLowerCase().replace(/ /g, `-`));

const getOffersContainer = (offersData) => (
  `${offersData.offers.length ? `<section class="event__section  event__section--offers">
                                  <h3 class="event__section-title  event__section-title--offers">Offers</h3>
                                  <div class="event__available-offers">
                                    ${getOffersList(offersData.offers)}
                                  </div>
                                </section>` : ``}`
);

const getOffersList = (offers) => (
  offers.map((elem) => (
    `<div class="event__offer-selector">
      <input class="event__offer-checkbox  visually-hidden" id="event-offer-${getOffersClassName(elem.title)}-1" type="checkbox" name="event-offer-${getOffersClassName(elem.title)}">
      <label class="event__offer-label" for="event-offer-${getOffersClassName(elem.title)}-1">
        <span class="event__offer-title">${elem.title}</span>
        +
        €&nbsp;<span class="event__offer-price">${elem.price}</span>
      </label>
    </div>`
  ))
  .join(`\n`)
);

export default class OffersComponent extends AbstractComponent {
  constructor(offersData) {
    super();
    this._offersData = offersData;
  }

  getTemplate() {
    return getOffersContainer(this._offersData);
  }
}
