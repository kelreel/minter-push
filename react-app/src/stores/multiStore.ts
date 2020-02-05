import { message } from "antd";
import { Minter } from "minter-js-sdk";
import { action, computed, observable } from "mobx";
import { createContext } from "react";

import config from "../config";
import HTTP from "../services/http";
import { getBalanceFromExplorer, getPrice } from "../services/walletApi";
import { getCampaign, setCampaign, getWallets } from "../services/campaignApi";

const minter = new Minter({ apiType: "node", baseURL: config.nodeURL });

const { walletFromMnemonic, isValidMnemonic } = require("minterjs-wallet");

export type Balance = {
  coin: string;
  value: number;
  bip_value?: number;
};

class MultiStore {
  @observable link: string | null = window.localStorage.getItem("mlink");
  @observable password: string | null = window.localStorage.getItem("mpass");
  @observable address: string | null = null;
  @observable seed: string | null = null;
  @observable coin: string | null = null;
  @observable value: number | null = null;
  @observable name: string | null = null;
  @observable fromName: string | null = null;
  @observable payload: string | null = null;
  @observable priority: string | null = null;
  @observable target: string | null = null;
  @observable created: Date | null = null;
  @observable wallets: string[] = [];
  @observable walletsData: any[] = [];

  constructor() {}

  // @action async checkBalance() {
  //   this.isLoading = true;
  //   try {
  //     let res = await getBalanceFromExplorer(
  //       // `Mxa0240b1070cb72f9600f4f4c3e427dd0dbc94cd6`
  //       // "Mx63f5509fe5347916c829664c6d92d09d87229998"
  //       // "Mxcf3b7531dd5ee878c5cc30ab198d30b427555555"
  //       this.address!
  //     );
  //     let balances = res?.data?.data?.balances;

  //     for (let item of balances) {
  //     let bipVal = 0;
  //       if (item.coin === "BIP") {
  //         bipVal += parseFloat(item.amount as string);
  //         this.totalBipBalance += bipVal;
  //         item.bip_value = bipVal;
  //         item.value =
  //           Math.round(parseFloat(item.amount as string) * 100) / 100;
  //       } else {
  //         let r;
  //         try {
  //           r = await minter.estimateCoinSell({
  //             coinToSell: item.coin,
  //             valueToSell: parseFloat(item.amount as string),
  //             coinToBuy: "BIP"
  //           });
  //         } catch (error) {
  //           r.will_get = 0;
  //         }
  //         bipVal = Math.round(parseFloat(r.will_get) * 100) / 100;
  //         this.totalBipBalance += Math.round(
  //           (parseFloat(r.will_get) * 100) / 100
  //         );
  //         item.bip_value = bipVal;
  //         item.value =
  //           Math.round(parseFloat(item.amount as string) * 100) / 100;
  //       }
  //       delete item["amount"];
  //     }
  //     let r = balances.filter((x: { value: number }) => x.value !== 0);
  //     r = r.filter((x: { value: number, bip_value: number }) => (x.bip_value > 0.1 || r.length === 1));
  //     r = r.sort((a: { bip_value: number; }, b: { bip_value: number; }) => {
  //       if (a.bip_value > b.bip_value) return -1
  //       else return 1
  //     })
  //     this.balance = r;
  //     console.log(r);
  //   } catch (error) {
  //     console.log(error);
  //     message.error("Error while getting balance");
  //   } finally {
  //     this.isLoading = false;
  //   }
  // }

  @action async initCampaign(
    link: string,
    pass: string = localStorage.getItem("mpass")!
  ) {
    let res = await getCampaign(link, pass);
    this.link = link;
    this.password = pass;
    this.address = res.data.address;
    this.seed = res.data.seed;
    this.name = res.data.name;
    this.fromName = res.data.fromName;
    this.payload = res.data.payload;
    this.wallets = res.data.wallets;
    this.created = res.data.createdAt;
    this.coin = res.data.coin;
    this.value = res.data.value;

    window.localStorage.setItem("mpass", pass);
    window.localStorage.setItem("mlink", link);

    await this.getWalletsData();
  }

  @action async setCampaign() {
    await setCampaign(
      window.localStorage.getItem("mlink")!,
      window.localStorage.getItem("mpass")!,
      this.fromName!,
      this.payload!,
      this.coin!,
      this.value!,
      this.target!
    );
    await this.initCampaign(this.link!, window.localStorage.getItem("mpass")!);
  }

  @action async getWalletsData() {
    try {
      let res = await getWallets(this.link!, this.password!);
      this.walletsData = res.data;
    } catch (error) {
      console.log(error);
      message.error("Error while getting wallets");
    }
  }
}

export const MultiStoreContext = createContext(new MultiStore());
