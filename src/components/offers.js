import AbstractComponent from './abstract-component.js';

const getOffersClassName = (string) => (string.slice().toLowerCase().replace(/ /g, `-`));

const getOffersContainer = (offersList, checkedOffers) => (
  `${offersList.length ? `<section class="event__section  event__section--offers">
                                  <h3 class="event__section-title  event__section-title--offers">Offers</h3>
                                  <div class="event__available-offers">
                                    ${getOffersList(offersList, checkedOffers)}
                                  </div>
                                </section>` : ``}`
);

const getOffersList = (offersList, checkedOffers) => (
  offersList.map((elem) => (
    `<div class="event__offer-selector">
      <input class="event__offer-checkbox  visually-hidden" id="event-offer-${getOffersClassName(elem.title)}-1" type="checkbox" name="event-offer-${getOffersClassName(elem.title)}" ${checkedOffers ? isChecked(elem, checkedOffers) : ``}>
      <label class="event__offer-label" for="event-offer-${getOffersClassName(elem.title)}-1">
        <span class="event__offer-title">${elem.title}</span>
        +
        €&nbsp;<span class="event__offer-price">${elem.price}</span>
      </label>
    </div>`
  ))
  .join(`\n`)
);

const isChecked = (offer, checkedOffers) => {
  let result = false;
  const test = checkedOffers.find((elem) => (elem.title === offer.title));

  if (test) {
    result = true;
  }

  return result ? `checked` : ``;
};

export default class OffersComponent extends AbstractComponent {
  constructor(offersList, checkedOffers) {
    super();
    this._offersList = offersList;
    this._checkedOffers = checkedOffers;
  }

  getTemplate() {
    return getOffersContainer(this._offersList, this._checkedOffers);
  }
}
