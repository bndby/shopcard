import { LitElement, html } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { styles } from './shopcard-card.styles';
import { router } from '../../router';

@customElement('shopcard-card')
export class ShopCardCard extends LitElement {
  @property({ type: String }) code = '';
  @property() name = '';
  @property() description = '';
  @property() color = '';
  @property() type = '';

  static styles = styles;

  openCard() {
    console.log('open card', this.code, this.type);
    router.navigate(`code/${this.code}/${this.type}`);
  }

  render() {
    return html`<div
      class="card"
      style="background-color: ${this.color}"
      @click="${this.openCard}"
    >
      ${this.name}
    </div>`;
  }
}

