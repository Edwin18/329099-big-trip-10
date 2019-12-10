import AbstractComponent from './abstract-component.js';

const getStub = () => (`<p class="trip-events__msg">Click New Event to create your first point</p>`);

export default class StubComponent extends AbstractComponent {
  getTemplate() {
    return getStub();
  }
}
