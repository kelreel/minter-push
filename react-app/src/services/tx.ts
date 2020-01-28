import { message } from 'antd';
import { Minter, TX_TYPE } from 'minter-js-sdk';
import { sha256 } from 'js-sha256';

import config from '../config';

const { walletFromMnemonic, isValidMnemonic } = require("minterjs-wallet");

const minter = new Minter({ apiType: "node", baseURL: config.nodeURL });

export const estimateCommission = () => {};

export const sendTx = async (
  address: string,
  coin: string,
  value: number,
  payload: string
) => {
  const wallet = walletFromMnemonic(window.localStorage.getItem("seed"));
  const privateKey = wallet.getPrivateKeyString()

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
    gasPrice: 1,
    message: payload
  };

  let res = await minter.postTx(txParams);
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
  console.log(secret);
  
  console.log(shaHash);

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
    gasPrice: 1,
    message: shaHash
  };

  let res = await minter.postTx(txParams);
  return res;
};