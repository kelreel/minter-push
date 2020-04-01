import axios from "axios";
import { sha256 } from "js-sha256";
import { Minter, TX_TYPE } from "minter-js-sdk";
import { walletFromMnemonic } from "minterjs-wallet";
import storage from "node-persist";

import config from "../config";
import { GifteryOrder } from "../models/Giftery/GifteryOrderSchema";
import { Product } from "../models/Giftery/ProductSchema";
import { getAddressFromSeed } from "./Wallet";

const minter = new Minter({ apiType: "node", baseURL: config.nodeURL });

export const saveGifteryProducts = async () => {
  const cmd = "getProducts";
  const data = "";
  try {
    const sig = sha256(cmd + data + config.gifteryKey);
    let res = await axios.get(`${config.gifteryURL}`, {
      params: {
        id: config.gifteryId,
        cmd,
        data,
        sig
      }
    });

    console.log(`Get Products Count: ${res.data.data.length}`);

    await Product.remove({});
    await Product.insertMany(res.data.data);
  } catch (error) {
    console.log(error);
  }
};

export const getGifteryBalance = async (): Promise<number> => {
  const cmd = "getBalance";
  const data = "";
  try {
    const sig = sha256(cmd + data + config.gifteryKey);
    let res = await axios.get(`${config.gifteryURL}`, {
      params: {
        id: config.gifteryId,
        cmd,
        data,
        sig
      }
    });

    return res.data.data.balance;
  } catch (error) {
    console.log(error);
    return -1;
  }
};

const makeGifteryOrder = async (
  product_id: number,
  face: number,
  email_to: string
) => {
  const cmd = "makeOrder";
  const data = `{"product_id":${product_id},"face":${face},"email_to":"${email_to}"}`;
  const sig = sha256(cmd + data + config.gifteryKey);
  try {
    let res = await axios.get(`${config.gifteryURL}`, {
      params: {
        id: config.gifteryId,
        cmd,
        sig,
        in: "json",
        data
      }
    });
    if (res.data.status === "error") throw res.data.error.text;
    GifteryOrder;
    return res.data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

const getCertificateBipPrice = async (face: number): Promise<number> => {
  let bipRubPrice =
    (await storage.getItem("rates")).RUB * (await storage.getItem("price1001"));
  return Math.round((face / bipRubPrice) * 100) / 100;
};

const makeOrderTx = async (seed: string, coin: string, face: number) => {
  let certificateBipPrice = await getCertificateBipPrice(face);

  let amount = certificateBipPrice;

  if (coin !== "BIP") {
    let r = await minter.estimateCoinBuy({
      coinToBuy: "BIP",
      valueToBuy: certificateBipPrice,
      coinToSell: coin
    });
    amount = r.will_pay;
  }

  console.log(`Cert. Pay: ${amount} ${coin}`);
  let privateKey = "";

  try {
    const wallet = walletFromMnemonic(seed);
    privateKey = wallet.getPrivateKeyString();
  } catch (error) {
    console.log(`Invalid seed`);
    throw `Invalid seed`;
  }

  const txParams = {
    privateKey,
    chainId: config.chainId,
    type: TX_TYPE.SEND,
    data: {
      to: config.gifteryPayWallet,
      value: amount,
      coin
    },
    gasCoin: coin
  };

  try {
    let res = await minter.postTx(txParams, { gasRetryLimit: 2 });
    return res;
  } catch (error) {
    console.log(error?.response?.data?.error?.tx_result?.message);
    throw error?.response?.data?.error?.tx_result?.message;
  }
};

// const getCode = async (order_id: number) => {
//   const cmd = "getCode";
//   const data = `{"queue_id": ${order_id}}`;
//   const sig = sha256(cmd + data + config.gifteryKey);
//   let res = await axios.get(`${config.gifteryURL}`, {
//     params: {
//       id: config.gifteryId,
//       cmd,
//       data,
//       in: "json",
//       sig
//     }
//   });
//   console.log(res.data);
// };

export const makeOrder = async (
  link: string,
  product_id: number,
  face: number,
  email_to: string,
  seed: string,
  coin: string = "BIP"
) => {
  let order = new GifteryOrder({
    link,
    product_id,
    face,
    email_to,
    coin,
    address: getAddressFromSeed(seed),
    bip_amount: await getCertificateBipPrice(face)
  });
  try {
    let balance = 1000; // await getGifteryBalance();

    if (balance < face) throw "Service balance too low. Please, try later.";
    let hash = await makeOrderTx(seed, coin, face);

    order.tx = hash;

    let result = await makeGifteryOrder(product_id, face, email_to);
    console.log(result);

    order.id = result.data.id;
    order.status = "success";
    await order.save();
    return {
      status: "ok",
      order: order._id
    };
  } catch (error) {
    order.status = "error";
    order.error = error.toString();
    throw error;
  } finally {
    await order.save();
  }
};
