import axios from "axios";
import config from "../config";

import { Minter, TX_TYPE } from "minter-js-sdk";

const minter = new Minter({ apiType: "node", baseURL: config.nodeURL });

export const checkWalletBalance = async (address: string) => {
  try {
    console.log('***');
    
    let total = 0;
    let res = await axios.get(`${config.nodeURL}/address?address=${address}`);
    let balance = res.data.result.balance;
    for (let coin in balance) {
      console.log(coin);
      
      if (coin === "BIP") {
        total += parseFloat(balance[coin]) / 1000000000000000000;
        return;
      } else {
        let a = await minter.estimateCoinSell({
          coinToSell: coin,
          valueToSell: parseFloat(balance[coin]) / 1000000000000000000,
          coinToBuy: "BIP"
        });
        total += +a.will_get;
      }
    }
    console.log(total);
    
  } catch (error) {
    console.log(error);
  }
};
