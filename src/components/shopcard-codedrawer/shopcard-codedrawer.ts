import { LitElement, html } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { styles } from './shopcard-codedrawer.styles';
import bwipjs from 'bwip-js';

@customElement('shopcard-codedrawer')
export class ShopCardCodeDrawer extends LitElement {
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

  render() {
    return html`<div class="barcode"></div>`;
  }
}

