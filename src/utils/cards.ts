import { BarcodeFormat } from '@zxing/library';

/**
 * Ключ, под которым карты хранятся в LocalStorage
 */
const LS_KEY = 'shopcard';

/**
 * бонусная карта
 */
export type Card = {
  code: string;
  type?: string;
  name?: string;
  description?: string;
  color?: string;
};

/**
 * Получаем бонусную карту по коду
 * @param code код карты
 * @returns объект карты или undefined если карты по такому коду нет
 */
export const getCardByCode = (code: string): Card | undefined => {
  const cardsRaw = localStorage.getItem(LS_KEY) ?? '[]';
  const cards = JSON.parse(cardsRaw) as Card[];
  const card = cards.find((c: Card) => c.code === code);
  return card;
};

/**
 * добавляем или обновляем карту по коду
 */
export const addOrUpdateCardByCode = (card: Card) => {
  const cardsRaw = localStorage.getItem(LS_KEY) ?? '[]';
  const cards = JSON.parse(cardsRaw) as Card[];
  const findedCard = cards.find((c: Card) => c.code === card.code);

  if (findedCard) {
    // карта есть уже в хранилище - обновляем
    const updatedCards = cards.map((c: Card) => {
      if (c.code === card.code) {
        return {
          ...c,
          type: card.type,
          name: card.name,
          description: card.description,
          color: card.color,
        };
      }
      return c;
    });

    localStorage.setItem(LS_KEY, JSON.stringify(updatedCards));
  } else {
    // карты нет в хранилище - добавляем
    cards.push(card);
    localStorage.setItem(LS_KEY, JSON.stringify(cards));
  }
};

export const getBarcodeTypeByCode = (code: BarcodeFormat) => {
  switch (code) {
    case BarcodeFormat.AZTEC:
      return 'azteccode';
    case BarcodeFormat.CODE_39:
      return 'code39';
    case BarcodeFormat.CODE_93:
      return 'code93';
    case BarcodeFormat.EAN_8:
      return 'ean8';
    case BarcodeFormat.EAN_13:
      return 'ean13';
    default:
      return '';
  }
};

