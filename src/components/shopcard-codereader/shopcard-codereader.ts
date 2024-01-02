import { LitElement, html } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { BrowserMultiFormatReader } from '@zxing/library';

import { styles } from './shopcard-codereader.styles';
import { getBarcodeTypeByCode } from '../../utils/cards';

type callbackType = (data: { code: string; type: string }) => void;

@customElement('shopcard-codereader')
export class ShopCardCodeReader extends LitElement {
  @property({ type: Function }) onRead: callbackType = () => {};

  static styles = styles;

  _handleRead(data: { code: string; type: string }) {
    this.onRead(data);
  }

  firstUpdated() {
    const video = this.renderRoot.querySelector('#video') as HTMLVideoElement;
    navigator.mediaDevices
      .getUserMedia({
        video: { facingMode: 'user', frameRate: { ideal: 15, max: 30 } },
      })
      .then((stream) => {
        console.log('stream');
        video.srcObject = stream;
        video.play();
      })
      .catch((err) => {
        console.log('error:', err);
      });

    const codeReader = new BrowserMultiFormatReader();

    codeReader.decodeFromVideoElement(video).then((result) => {
      if (result) {
        this._handleRead({
          code: result.getText(),
          type: getBarcodeTypeByCode(result.getBarcodeFormat()),
        });
        video?.pause();
      }
    });
  }

  render() {
    return html`<div class="videoreader">
      <video id="video" muted width="100%" height="300"></video>
    </div>`;
  }
}

