import { LitElement, html } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { styles } from './shopcard-card.styles.ts';

@customElement('shopcard-card')
export class ShopCardCard extends LitElement {
  @property({ type: String }) code = '';
  @property() name = '';
  @property() description = '';
  @property() color = '';

  static styles = styles;

  render() {
    return html`<div class="card" style="background-color: ${this.color}">
      ${this.name}
    </div>`;
  }
}

