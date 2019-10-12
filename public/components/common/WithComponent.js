import { upperCaseFirst } from '../../helpers/upperCaseFirst.js';
import { delay } from '../../helpers/delay.js';

export const WithComponent = (Base = class {}) => class extends Base {
  constructor () {
    super();
    this.attachShadow({ mode: 'open' });

    this.shadowRoot.appendChild(
      this.constructor.view.content.cloneNode(true)
    );
  }

  connectedCallback () {
    super.connectedCallback && super.connectedCallback();
    this._upgradeProperties(this.constructor.observedAttributes);
  }

  async attributeChangedCallback (attrName, oldValue, newValue) {
    if (super.attributeChangedCallback) {
      super.attributeChangedCallback(attrName, oldValue, newValue);
    }

    const attrCallbackMethod = `_handle${upperCaseFirst(attrName)}Changed`;

    if (oldValue !== newValue && this[attrCallbackMethod]) {
      await delay();
      this[attrCallbackMethod](newValue);
    }
  }

  _upgradeProperties (propNames) {
    propNames.forEach(propName => {
      if (Object.prototype.hasOwnProperty.call(this, propName)) {
        const value = this[propName];
        delete this[propName];
        this[propName] = value;
      }
    });
  }

  _dispatchEventAndCallMethod (evtName, detail, target = this) {
    const options = { bubbles: true, detail };
    const event = new CustomEvent(evtName, options);
    const method = target[`on${evtName}`];

    target.dispatchEvent(event);

    if (typeof method === 'function') {
      method(event);
    }
  }
};
