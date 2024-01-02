import { LitElement, html } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { BrowserMultiFormatReader, NotFoundException } from '@zxing/library';

import { styles } from './shopcard-videoreader.styles';
import { BarcodeType } from '../../consts';

@customElement('shopcard-videoreader')
export class ShopCardEdit extends LitElement {
  @property() onRead = () => {};

  static styles = styles;

  _handleRead(data) {
    this.onRead(data);
  }

  updated() {
    let selectedDeviceId;
    const codeReader = new BrowserMultiFormatReader();
    console.log('ZXing code reader initialized');
    codeReader
      .listVideoInputDevices()
      .then((videoInputDevices) => {
        console.log('vd:', videoInputDevices);
        const sourceSelect = this.renderRoot.querySelector(
          '#sourceSelect'
        ) as HTMLSelectElement;
        selectedDeviceId = videoInputDevices[0].deviceId;
        if (videoInputDevices.length >= 1 && sourceSelect) {
          videoInputDevices.forEach((element) => {
            const sourceOption = document.createElement('option');
            sourceOption.text = element.label;
            sourceOption.value = element.deviceId;
            sourceSelect?.appendChild(sourceOption);
          });

          sourceSelect.onchange = () => {
            selectedDeviceId = sourceSelect.value;
          };

          const sourceSelectPanel = this.renderRoot.querySelector(
            '#sourceSelectPanel'
          ) as HTMLDivElement;
          if (sourceSelectPanel && sourceSelectPanel.style)
            sourceSelectPanel.style.display = 'block';
        }

        const video = this.renderRoot.querySelector(
          '#video'
        ) as HTMLVideoElement;

        codeReader.decodeFromVideoDevice(
          selectedDeviceId,
          video,
          (result, err) => {
            if (result) {
              console.log(result.getBarcodeFormat(), result.getText());
              this._handleRead({
                code: result.getText(),
                type: BarcodeType[result.getBarcodeFormat()],
              });
              video?.pause();
            }
            if (err && !(err instanceof NotFoundException)) {
              console.error(err);
            }
          }
        );
        console.log(
          `Started continous decode from camera with id ${selectedDeviceId}`
        );
      })
      .catch((err) => {
        console.error(err);
      });
  }

  render() {
    return html`<div class="videoreader">
      <video
        id="video"
        muted
        width="300"
        height="200"
        style="border: 1px solid gray"
      ></video>
      <div id="sourceSelectPanel">
        <label for="sourceSelect">Change video source:</label>
        <select id="sourceSelect" style="max-width:300px"></select>
      </div>
    </div>`;
  }
}

