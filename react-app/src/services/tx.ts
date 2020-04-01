import { message } from "antd";
import { sha256 } from "js-sha256";
import { Minter, prepareSignedTx, TX_TYPE } from "minter-js-sdk";

import config from "../config";

const { walletFromMnemonic, isValidMnemonic } = require("minterjs-wallet");

const minter = new Minter({ apiType: "node", baseURL: config.nodeURL });

export const estimateCommission = async (
  coin: string,
  value: number,
  payload: string
) => {
  const wallet = walletFromMnemonic(window.localStorage.getItem("seed"));
  const privateKey = wallet.getPrivateKeyString();

  let nonce = await minter.getNonce(wallet.getAddressString());

  const txParams = {
    privateKey,
    chainId: config.chainId,
    type: TX_TYPE.SEND,
    nonce,
    data: {
      to: "Mxcf3b7531dd5ee878c5cc30ab198d30b427555555",
      value: value,
      coin
    },
    gasCoin: coin,
    gasPrice: 1,
    message: payload
  };

  let tx = prepareSignedTx(txParams);
  let com =
    (await minter.estimateTxCommission({
      transaction: tx.serialize().toString("hex")
    })) / 1000000000000000000;
  return com + 0.001;
};

export const sendTx = async (
  address: string,
  coin: string,
  value: number,
  payload: string
) => {
  const wallet = walletFromMnemonic(window.localStorage.getItem("seed"));
  const privateKey = wallet.getPrivateKeyString();

  const txParams = {
    privateKey,
    chainId: config.chainId,
    type: TX_TYPE.SEND,
    data: {
      to: address,
      value: value,
      coin
    },
    gasCoin: coin,
    message: payload
  };

  let res = await minter.postTx(txParams, { gasRetryLimit: 2 });
  return res;
};

export const sendTimeTx = async (
  coin: string,
  value: number,
  secret: string
) => {
  const wallet = walletFromMnemonic(window.localStorage.getItem("seed"));
  const privateKey = wallet.getPrivateKeyString();

  const shaHash = sha256(secret);

  const txParams = {
    privateKey,
    chainId: config.chainId,
    type: TX_TYPE.SEND,
    data: {
      to: "Mx3650064486380210127159872871912061022891",
      value: value,
      coin
    },
    gasCoin: coin,
    message: shaHash
  };

  let res = await minter.postTx(txParams, { gasRetryLimit: 2 });
  return res;
};

export const sendMobileTx = async (
  coin: string,
  value: number,
  keyword: string
) => {
  const wallet = walletFromMnemonic(window.localStorage.getItem("seed"));
  const privateKey = wallet.getPrivateKeyString();

  const txParams = {
    privateKey,
    chainId: config.chainId,
    type: TX_TYPE.SEND,
    data: {
      to: "Mx403b763ab039134459448ca7875c548cd5e80f77",
      value: value,
      coin
    },
    gasCoin: coin,
    message: keyword
  };

  let res = await minter.postTx(txParams, { gasRetryLimit: 2 });
  return res;
};
