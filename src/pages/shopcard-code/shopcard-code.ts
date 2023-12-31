import { LitElement, html } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { styles } from './shopcard-code.styles';
import { router } from '../../router';
import bwipjs from 'bwip-js';

import '../../components/shopcard-codedrawer/shopcard-codedrawer';

@customElement('shopcard-code')
export class ShopCardCode extends LitElement {
  @property({ type: String }) code = '0000000000000';
  @property({ type: String }) type = 'ean13';

  static styles = styles;

  updated() {
    let svg = bwipjs.toSVG({
      bcid: this.type, // Barcode type
      text: this.code, // Text to encode
      height: 16, // Bar height, in millimeters
      includetext: true, // Show human-readable text
      // textxalign: 'center', // Always good to set this
      // textcolor: 'ff0000', // Red text
    });
    const svgEl = this.renderRoot.querySelector('.barcode');
    if (svgEl) {
      svgEl.innerHTML = svg;
    }
  }

  _close() {
    console.log('close code');
    router.navigate('/');
  }

  _edit(event: MouseEvent) {
    event.stopPropagation();
    console.log('edit code');
    router.navigate(`/edit/${this.code}`);
  }

  render() {
    return html`<div class="code" @click="${this._close}">
      <shopcard-codedrawer
        .code=${this.code}
        .type=${this.type}
      ></shopcard-codedrawer>
      <div class="hint">Нажми в любом месте, чтобы закрыть</div>
      <button @click="${this._edit}" class="edit">Редактировать</button>
    </div>`;
  }
}

