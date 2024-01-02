import { LitElement, html } from 'lit';
import { customElement, state } from 'lit/decorators.js';
import { router } from '../../router';
import { styles } from './shopcard-list.styles';

import '../../components/shopcard-card/shopcard-card';

@customElement('shopcard-list')
export class ShopCardList extends LitElement {
  @state() cards = [];

  static styles = styles;

  constructor() {
    super();
    this.cards = JSON.parse(localStorage.getItem('shopcard') ?? '[]');
  }

  addNew() {
    router.navigate('edit');
  }

  render() {
    return html`<main class="layout">
      <h1>Список карт</h1>
      <div class="cards">
        ${this.cards.map(
          ({ code, name, color, description }) =>
            html`<shopcard-card
              .code=${code}
              .name=${name}
              .color=${color}
              .description=${description}
            ></shopcard-card>`
        )}
      </div>
      <button @click=${this.addNew}>Добавить карту</button>
    </main>`;
  }
}

