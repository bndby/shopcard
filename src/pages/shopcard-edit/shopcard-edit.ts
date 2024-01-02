import { LitElement, html } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { styles } from './shopcard-edit.styles';

import '../../components/shopcard-codereader/shopcard-codereader';
import '../../components/shopcard-codedrawer/shopcard-codedrawer';

import { addOrUpdateCardByCode, getCardByCode } from '../../utils/cards';
import { router } from '../../router';

@customElement('shopcard-edit')
export class ShopCardEdit extends LitElement {
  @property({ type: String }) code: string = '';
  @state() _code: string = '';
  @state() _type: string = '';
  @state() _name: string = '';
  @state() _description: string = '';
  @state() _color: string = '';

  static styles = styles;

  constructor() {
    super();
  }

  firstUpdated = () => {
    if (this.code) {
      // карта передана - пробуем ее найти
      this._code = this.code;

      const card = getCardByCode(this._code);
      this._name = card?.name ?? '';
      this._type = card?.type ?? '';
      this._description = card?.description ?? '';
      this._color = card?.color || '';
    } else {
      // карта не передана -> создаем новую карту
      this._code = '';
      this._type = '';
      this._name = '';
      this._description = '';
      this._color = '#ccc';
    }
  };

  _save = () => {
    addOrUpdateCardByCode({
      code: this._code,
      type: this._type,
      name: this._name,
      description: this._description,
      color: this._color,
    });
    router.navigate('/');
  };

  _cancel(e: MouseEvent) {
    router.navigate('/');
    console.log('cancel', e);
  }

  _handleRead = (data: { code: string; type: string }) => {
    this._code = data.code;
    this._type = data.type;
  };

  render() {
    console.log('render');
    return html`<div class="layout">
      <h2>
        ${this.code ? 'Редактировать карту' : 'Новая карта'} ${this._name}
      </h2>
      ${this._code && this._type
        ? html`<shopcard-codedrawer
            .code=${this._code}
            .type=${this._type}
          ></shopcard-codedrawer>`
        : html`<shopcard-codereader
            .onRead="${this._handleRead}"
          ></shopcard-codereader>`}

      <p>
        <label for="name">Название</label><br />
        <input id="name" type="text" .value=${this._name} />
      </p>
      <p>
        <label for="code">Код</label><br />
        <input id="code" type="text" value=${this._code} />
      </p>
      <p>
        <label for="type">Тип</label><br />
        <input id="type" type="text" .value=${this._type} />
      </p>
      <p>
        <label for="description">Примечание</label><br />
        <input id="description" type="text" .value=${this._description} />
      </p>
      <p>
        <label for="color">Цвет</label><br />
        <input id="color" type="color" .value=${this._color} />
      </p>
      <p>
        <button @click=${this._save}>Сохранить</button>
        <button @click=${this._cancel}>Отмена</button>
      </p>
    </div>`;
  }
}

