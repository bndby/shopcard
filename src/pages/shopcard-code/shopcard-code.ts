import { LitElement, html } from 'lit';
import { customElement, property } from 'lit/decorators.js';

@customElement('shopcard-code')
export class ShopCardCode extends LitElement {
  @property({ type: String }) code = '0000000000000';

  render() {
    return html`<div>Card code ${this.code}</div>`;
  }
}

