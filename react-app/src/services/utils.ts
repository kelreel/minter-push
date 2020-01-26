import i18n from "../i18n";

import { prepareLink, TX_TYPE } from "minter-js-sdk";


export const shortAddress = (address: string): string => {
  return (
    address.substring(0, 6) + "..." + address.substring(address.length - 4)
  );
};

export const getLocale = () => {
  return i18n.language.substring(0, 2);
};

export const getDeepLink = (address: string) => {
  const txParams = {
    type: TX_TYPE.SEND,
    data: {
      to: address,
      value: 100,
      coin: "BIP"
    }
  };
  return 'minter:' + prepareLink(txParams, "").substring(6)
};
