import { message } from "antd";
import { Minter } from "minter-js-sdk";
import { action, computed, observable } from "mobx";
import { createContext } from "react";

import { TargetEnum } from "../components/Multi/Main/MultiMain";
import config from "../config";
import { getBalanceFromExplorer, getRates } from "../services/walletApi";

const minter = new Minter({ apiType: "node", baseURL: config.nodeURL });

const { walletFromMnemonic } = require("minterjs-wallet");

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
  @observable bipPrice1001: number = 0;
  @observable isLoading: boolean = false;
  @observable rubCourse: number = 0;
  @observable locale: string | null = window.localStorage.getItem("i18nextLng");
  @observable currency: string = "USD";
  @observable target: TargetEnum | null = null;
  @observable status: string | null = null;
  @observable campaign: string | null = null;
  @observable rates: any = {};

  constructor() {
    if (this.locale?.substring(0, 2) === "ru") {
      this.currency = "RUB";
    } else this.currency = "USD";
  }

  @action async setRates() {
    try {
      let res = await getRates();
      this.rates = res.data.currencyRates;
      this.bipPrice = res.data.priceMBank;
      this.bipPrice1001 = res.data.price1001;
      this.rubCourse = this.rates.RUB;
    } catch (error) {
      console.log(error);
      message.error("Error while setting currency rates and BIP price");
    }
  }

  @computed get totalInLocalCurrency() {
    return Math.round(this.totalPrice * this.rates[this.currency] * 100) / 100;
  }

  @action changeLocale = (language: string) => {
    this.locale = language;
    if (language === "ru") {
      this.currency = "RUB";
    } else this.currency = "USD";
  };

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
      r = r.filter(
        (x: { value: number; bip_value: number }) =>
          x.bip_value > 0.1 || r.length === 1
      );
      r = r.sort((a: { bip_value: number }, b: { bip_value: number }) => {
        if (a.bip_value > b.bip_value) return -1;
        else return 1;
      });
      this.balance = r;
    } catch (error) {
      console.log(error);
      message.error("Error while getting balance");
    } finally {
      this.isLoading = false;
      if (this.totalBipBalance === 0) {
        setTimeout(() => {
          this.checkBalance();
          this.getTotalPrice();
        }, 5000);
      }
    }
  }

  @action checkBalancesTimeout(timeout: number = 5000) {
    setTimeout(async () => {
      await this.checkBalance();
      await this.getTotalPrice();
    }, timeout);
  }

  // @action async getRubCourse() {
  //   try {
  //     let res = await HTTP.get(`https://www.cbr-xml-daily.ru/daily_json.js`);
  //     this.rubCourse = res.data.Valute.USD.Value;
  //   } catch (error) {
  //     message.error("Error getting Exchanges Rate");
  //   }
  // }

  @action async getTotalPrice() {
    try {
      let res = await this.setRates();
      this.totalPrice = this.totalBipBalance * this.bipPrice;
    } catch (error) {}
  }

  @action setWalletWithoutSeed(
    address: string,
    name = null,
    fromName = null,
    payload = null,
    password = false,
    link = null,
    target: TargetEnum | null
  ) {
    this.address = address;
    this.name = name;
    this.fromName = fromName;
    this.payload = payload;
    this.link = link;
    this.target = target;

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

  @action setStatus(status: string) {
    this.status = status;
    console.log(this.status);
  }
}

export const AppStoreContext = createContext(new AppStore());
