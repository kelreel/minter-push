import { action, observable } from "mobx";
import { createContext } from "react";
import { getBalance } from "../services/createWaleltApi";
import { getBalanceFromExplorer } from "../services/walletApi";

// @ts-ignore
import {Minter, prepareLink} from "minter-js-sdk";
import config from "../config";

// const minter = new Minter({apiType: 'node', baseURL: config.nodeURL})

const { walletFromMnemonic, isValidMnemonic } = require("minterjs-wallet");

export type Balance = {
  coin: string;
  value: number;
  bip_value?: number;
};

class AppStore {
  @observable address: string | null = window.localStorage.getItem("address");
  @observable seed: string | null = window.localStorage.getItem("seed");
  @observable name: string | null = null;
  @observable fromName: string | null = null;
  @observable payload: string | null = null;
  @observable isPassword: boolean | null = false;
  @observable link: string | null = null;
  @observable balance: Balance[] = [];
  @observable totalBipBalance: number = 0;

  constructor() {}

  // @action async checkBalance() {
  //   try {
  //     let res = await getBalanceFromExplorer(this.address!);
  //     let balances = res?.data?.data?.balances;
  //     let result: Balance[] = []
  //     let totalBipVal = 0;
  //     result = balances.map(async (x: { coin: any; amount: string | number; }) => {
  //       let bipVal = 0;

  //       if (x.coin === 'BIP') {
  //         bipVal = 0;
  //       } else {
  //         let r = await minter.estimateCoinSell({
  //           coinToSell: x.coin,
  //           valueToSell: +x.amount,
  //           coinToBuy: "BIP"
  //         });
  //         bipVal = r.will_get;
  //         totalBipVal += bipVal;
  //       }

  //       return {
  //         coin: x.coin,
  //         value: +x.amount,
  //         bip_value: bipVal
  //       }
  //     })
  //     this.balance = result;
  //     this.totalBipBalance = totalBipVal;
  //   } catch (error) {
  //     console.log(error);
  //   }
    
  // }

  @action setWalletWithoutSeed(
    address: string,
    name = null,
    fromName = null,
    payload = null,
    password = false,
    link = null
  ) {
    this.address = address;
    this.name = name;
    this.fromName = fromName;
    this.payload = payload;
    this.link = link;

    try {
      if (walletFromMnemonic(this.seed).getAddressString() === address) {
        this.isPassword = false;
      } else {
        this.isPassword = true;
        this.seed = null;
        window.localStorage.removeItem("seed");
      }
    } catch (error) {
      console.log(error);
      this.isPassword = true;
      this.seed = null;
      window.localStorage.removeItem("seed");
    }

    window.localStorage.setItem("address", address);
  }

  @action setSeed(seed: string) {
    this.seed = seed;
    this.isPassword = false;
    window.localStorage.setItem("seed", seed);
  }

  @action async getUserData() {}

  @action async checkAuth() {}

  @action logout() {}

  @action async login(seed: string) {}
}

export const AppStoreContext = createContext(new AppStore());
