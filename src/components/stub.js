import AbstractComponent from './abstract-component.js';
import {render, RenderPosition} from '../utils/render.js';

const getStub = () => (`<p class="trip-events__msg">Click New Event to create your first point</p>`);

export default class StubComponent extends AbstractComponent {
  constructor(container) {
    super();

    this._conmtainer = container;
  }
  getTemplate() {
    return getStub();
  }

  renderStub() {
    render(this._conmtainer, this.getElement(), RenderPosition.BEFOREEND);
  }
}
