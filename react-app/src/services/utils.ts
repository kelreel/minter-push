import { prepareLink, TX_TYPE } from "minter-js-sdk";

import i18n from "../i18n";

export const shortAddress = (address: string): string => {
  return (
    address.substring(0, 6) + "..." + address.substring(address.length - 4)
  );
};

export const getLocale = () => {
  return i18n.language.substring(0, 2);
};

export const getDeepLink = (
  address: string,
  value: number = 100,
  coin: string = "BIP"
) => {
  const txParams = {
    type: TX_TYPE.SEND,
    data: {
      to: address,
      value,
      coin
    }
  };
  return "https://bip.to/" + prepareLink(txParams, "").substring(9);
};

export const b64toBlob = (
  b64Data: string,
  contentType: string,
  sliceSize = 512
) => {
  const byteCharacters = atob(b64Data);
  const byteArrays = [];

  for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
    const slice = byteCharacters.slice(offset, offset + sliceSize);

    const byteNumbers = new Array(slice.length);
    for (let i = 0; i < slice.length; i++) {
      byteNumbers[i] = slice.charCodeAt(i);
    }

    const byteArray = new Uint8Array(byteNumbers);

    byteArrays.push(byteArray);
  }

  const blob = new Blob(byteArrays, { type: contentType });
  return blob;
};
