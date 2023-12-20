import { LitElement, html } from 'lit';
import { customElement } from 'lit/decorators.js';
import { router } from '../../router';
import { styles } from './shopcard-list.styles.ts';

import '../../components/shopcard-card/shopcard-card';

@customElement('shopcard-list')
export class ShopCardList extends LitElement {
  static properties = {
    cards: { state: true },
  };

  static styles = styles;

  constructor() {
    super();
    this.cards = JSON.parse(localStorage.getItem('shopcard')) ?? [
      {
        name: 'Green',
        description: 'Примечание',
        color: 'green',
        code: '123456789',
      },
    ];
  }

  addNew() {
    router.navigate('edit');
  }

  render() {
    return html`<main>
      <h1>Shop Card List</h1>
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
      <button @click=${this.addNew}>+ Карта</button>
    </main>`;
  }
}

