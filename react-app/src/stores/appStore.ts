import { message } from 'antd';
import { Minter } from 'minter-js-sdk';
import { action, computed, observable } from 'mobx';
import { createContext } from 'react';

import config from '../config';
import HTTP from '../services/http';
import { getBalanceFromExplorer, getPrice } from '../services/walletApi';

const minter = new Minter({ apiType: "node", baseURL: config.nodeURL });

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
  @observable totalPrice: number = 0;
  @observable bipPrice: number = 0;
  @observable isLoading: boolean = false;
  @observable rubCourse: number = 0;
  @observable locale: string | null = window.localStorage.getItem("i18nextLng");
  @observable currency: string = "USD";

  constructor() {
    if (this.locale?.substring(0,2) === 'ru') {
      this.currency = "RUB"
    } else this.currency = "USD"
  }

  @computed get exchRate() {
    switch (this.currency) {
      case "USD":
        return 1
      case "RUB":
        return this.rubCourse
      default: return 1
    }
  }


  @computed get totalInLocalCurrency() {
    return Math.round(this.totalPrice * this.exchRate * 100) / 100;
  }

  @action changeLocale = (language: string) => {
    this.locale = language;
    if (language === 'ru') {
      this.currency = "RUB"
    } else this.currency = "USD";
  }


  @action async checkBalance() {
    this.isLoading = true;
    try {
      let res = await getBalanceFromExplorer(
        // `Mxa0240b1070cb72f9600f4f4c3e427dd0dbc94cd6`
        // "Mx63f5509fe5347916c829664c6d92d09d87229998"
        // "Mxcf3b7531dd5ee878c5cc30ab198d30b427555555"
        this.address!
      );
      let balances = res?.data?.data?.balances;

      for (let item of balances) {
      let bipVal = 0;
        if (item.coin === "BIP") {
          bipVal += parseFloat(item.amount as string);
          this.totalBipBalance += bipVal;
          item.bip_value = bipVal;
          item.value =
            Math.round(parseFloat(item.amount as string) * 100) / 100;
        } else {
          let r;
          try {
            r = await minter.estimateCoinSell({
              coinToSell: item.coin,
              valueToSell: parseFloat(item.amount as string),
              coinToBuy: "BIP"
            });
          } catch (error) {
            r.will_get = 0;
          }
          bipVal = Math.round(parseFloat(r.will_get) * 100) / 100;
          this.totalBipBalance += Math.round(
            (parseFloat(r.will_get) * 100) / 100
          );
          item.bip_value = bipVal;
          item.value =
            Math.round(parseFloat(item.amount as string) * 100) / 100;
        }
        delete item["amount"];
      }
      let r = balances.filter((x: { value: number }) => x.value !== 0);
      r = r.filter((x: { value: number, bip_value: number }) => (x.bip_value > 0.1 || r.length === 1));
      r = r.sort((a: { bip_value: number; }, b: { bip_value: number; }) => {
        if (a.bip_value > b.bip_value) return -1
        else return 1
      })
      this.balance = r;
      console.log(r);
    } catch (error) {
      console.log(error);
      message.error("Error while getting balance");
    } finally {
      this.isLoading = false;
    }
  }

  @action checkBalancesTimeout(timeout: number = 5000) {
    setTimeout(() => {
      this.checkBalance();
    }, timeout);
  }

  @action async getRubCourse() {
    try {
      let res = await HTTP.get(`https://www.cbr-xml-daily.ru/daily_json.js`);
      this.rubCourse = res.data.Valute.USD.Value;
    } catch (error) {
      message.error("Error getting RUB Exchange Rate");
    }
  }

  @action async getTotalPrice() {
    try {
      let res = await getPrice();
      this.bipPrice = res.data.data.price / 10000;
      this.totalPrice = this.totalBipBalance * this.bipPrice;
    } catch (error) {}
  }

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
