import { LitElement, html } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { router } from '../../router';
import { styles } from './shopcard-edit.styles';

import '../../components/shopcard-videoreader/shopcard-videoreader';
import { addOrUpdateCardByCode, getCardByCode } from '../../utils/cards';
import { BarcodeFormat } from '@zxing/library';
import { BarcodeType } from '../../consts';

@customElement('shopcard-edit')
export class ShopCardEdit extends LitElement {
  @property({ type: String }) code;
  @state() _code;
  @state() _type;
  @state() _name;
  @state() _description;
  @state() _color;

  static styles = styles;

  constructor() {
    super();
    this._code = this.code;
  }

  firstUpdated() {
    if (this.code) {
      // карта передана - пробуем ее найти

      const card = getCardByCode(this._code);
      this._name = card?.name ?? this._code;
      this._type = card?.type ?? BarcodeType[BarcodeFormat.EAN_13];
      this._description = card?.description ?? '';
      this._color = card?.color ?? '#ccc';
    } else {
      // карта не передана -> создаем новую карту
      this._code = '0000000000000';
      this._type = BarcodeType[BarcodeFormat.EAN_13];
      this._name = '0000000000000';
      this._description = '';
      this._color = '#ccc';
    }
  }

  _save() {
    addOrUpdateCardByCode({
      code: this._code,
      type: this._type,
      name: this._name,
      description: this._description,
      color: this._color,
    });
    // router.navigate('/');
  }

  _cancel(e) {
    // router.navigate('/');
    console.log('cancel', e);
    this._code = 'code';
  }

  _handleRead(data) {
    console.log('handle read', data);
    this._code = data.code;
    this._type = data.type;
  }

  render() {
    console.log('render');
    return html`<div class="layout">
      <h2>
        ${this.code ? 'Редактировать карту' : 'Новая карта'} ${this._name}
      </h2>
      <shopcard-videoreader
        .onRead="${this._handleRead}"
      ></shopcard-videoreader>
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

