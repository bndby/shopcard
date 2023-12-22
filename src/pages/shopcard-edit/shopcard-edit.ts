import { LitElement, html } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { router } from '../../router';

import { BrowserMultiFormatReader, NotFoundException } from '@zxing/library';

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
          (c: { code: string }) => c.code === this.code
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
          const cardIndex = cardsArray.findIndex(
            (c: { code: string }) => c.code === this.code
          );
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
        console.log('ss:', sourceSelect);
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
              console.log(result);
              this.code = result.getText();
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

  changeName(e: Event) {
    this.name = (e.target as HTMLInputElement)?.value;
  }

  changeCode(e: Event) {
    this.code = (e.target as HTMLInputElement)?.value;
  }

  changeDescription(e: Event) {
    this.description = (e.target as HTMLInputElement)?.value;
  }

  changeColor(e: Event) {
    this.color = (e.target as HTMLInputElement)?.value;
  }

  save() {
    const cards = localStorage.getItem('shopcard');
    console.log('>>', cards);
    const cardsArray = JSON.parse(cards ?? '[]');
    const cardIndex = cardsArray.findIndex(
      (c: { code: string }) => c.code === this.code
    );
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
      cardsArray[cardIndex].name = this.name ?? this.code;
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
    console.log('render');
    return html`<div>
      <h2>${this.code ? 'Edit' : 'New'} card ${this.name}</h2>
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

