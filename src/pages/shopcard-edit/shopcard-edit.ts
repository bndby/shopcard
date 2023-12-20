import { LitElement, html } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { router } from '../../router';

@customElement('shopcard-edit')
export class ShopCardEdit extends LitElement {
  @property({ type: String }) code = '';
  @state() name = '';
  @state() description = '';
  @state() color = '#CCC';

  constructor() {
    super();
    if (this.code) {
      // карта передана - пробуем ее найти
      const cards = localStorage.getItem('shopcard');
      if (cards) {
        // карты есть в хранилище
        const card = JSON.parse(cards).find(
          (c: unknown) => c.code === this.code
        );
        if (card) {
          // карта найдена в сохраненных
          this.name = card.name;
          this.description = card.description;
          this.color = card.color;
        } else {
          // карта не найдена в сохраненных -> сохраняем
          this.name = this.code;
          const cardsArray = JSON.parse(cards);
          const cardIndex = cardsArray.findIndex((c) => c.code === this.code);
          cardsArray[cardIndex].name = this.name;
          localStorage.setItem('shopcard', JSON.stringify(cardsArray));
        }
      } else {
        // карт нет в хранилище -> сохраняем первую карту
        this.name = this.code;
        localStorage.setItem(
          'shopcard',
          JSON.stringify([
            {
              name: this.name,
              description: this.description,
              color: this.color,
              code: this.code,
            },
          ])
        );
      }
    } else {
      // карта не передана -> создаем новую карту
    }
  }

  changeName(e) {
    this.name = e.target.value;
  }

  changeCode(e) {
    this.code = e.target.value;
  }

  changeDescription(e) {
    this.description = e.target.value;
  }

  changeColor(e) {
    this.color = e.target.value;
  }

  save() {
    const cards = localStorage.getItem('shopcard');
    console.log('>>', cards);
    const cardsArray = JSON.parse(cards) ?? [];
    const cardIndex = cardsArray.findIndex((c) => c.code === this.code);
    if (cardIndex === -1) {
      // новая карточка
      cardsArray.push({
        name: this.name,
        description: this.description,
        color: this.color,
        code: this.code,
      });
    } else {
      // существующая карточка
      cardsArray[cardIndex].name = this.name;
      cardsArray[cardIndex].description = this.description;
      cardsArray[cardIndex].color = this.color;
    }

    console.log('==', JSON.stringify(cardsArray));

    localStorage.setItem('shopcard', JSON.stringify(cardsArray));
    router.navigate('/');
  }

  cancel() {
    router.navigate('/');
  }

  render() {
    return html`<div>
      <h2>${this.code ? 'Edit' : 'New'} card ${this.name}</h2>
      <form>
        <p>
          <label for="name">Name</label><br />
          <input
            id="name"
            type="text"
            .value=${this.name}
            @change=${this.changeName}
          />
        </p>
        <p>
          <label for="code">Code</label><br />
          <input
            id="code"
            type="text"
            .value=${this.code}
            @change=${this.changeCode}
          />
        </p>
        <p>
          <label for="description">Description</label><br />
          <input
            id="description"
            type="text"
            .value=${this.description}
            @change=${this.changeDescription}
          />
        </p>
        <p>
          <label for="color">Color</label><br />
          <input
            id="color"
            type="color"
            .value=${this.color}
            @change=${this.changeColor}
          />
        </p>
        <p>
          <button @click=${this.save}>Сохранить</button>
          <button @click=${this.cancel}>Отмена</button>
        </p>
      </form>
    </div>`;
  }
}

