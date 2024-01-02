import { BarcodeFormat } from '@zxing/library';

export const BarcodeType = {
  [BarcodeFormat.AZTEC]: 'azteccode',
  [BarcodeFormat.CODE_39]: 'code39',
  [BarcodeFormat.CODE_93]: 'code93',
  [BarcodeFormat.EAN_8]: 'ean8',
  [BarcodeFormat.EAN_13]: 'ean13',
} as const;

