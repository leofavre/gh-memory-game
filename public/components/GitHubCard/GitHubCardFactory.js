import { setAttr } from '../../helpers/setAttr.js';

export const GitHubCardFactory = (Base = class {}) =>
  class extends Base {
    static get observedAttributes () {
      return ['revealed'];
    }

    get revealed () {
      return this.hasAttribute('revealed');
    }

    set revealed (value) {
      setAttr(this, 'revealed', value);
    }
  };
