import {message} from "antd";
import {Minter} from "minter-js-sdk";
import {action, computed, observable} from "mobx";
import {createContext} from "react";

import config from "../config";
import HTTP from "../services/http";
import {getBalanceFromExplorer, getPrice} from "../services/walletApi";
import {getCampaign, setCampaign, getWallets} from "../services/campaignApi";
import {getBalance} from "../services/createWaleltApi";
import {Preset} from "./presetStore";

const minter = new Minter({apiType: "node", baseURL: config.nodeURL});

const {walletFromMnemonic, isValidMnemonic} = require("minterjs-wallet");

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
    @observable balance: number = 0;
    @observable isLoadingWalletsData: boolean = false;
    @observable preset: Preset | null = null;

    constructor() {
    }

    @action
    async initCampaign(
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
        this.target = res.data.target;
        this.preset = res.data.preset;

        window.localStorage.setItem("mpass", pass);
        window.localStorage.setItem("mlink", link);

        await this.getWalletsData();
        await this.checkBalance();
    }

    @action
    async checkBalance() {
        try {
            let res = await getBalance(this.address!);
            let val =
                Math.round(
                    (parseFloat(res.data.result.balance[this.coin!]) /
                        1000000000000000000) *
                    100
                ) / 100;
            if (isNaN(val)) val = 0;
            this.balance = val;
        } catch (error) {
            console.log(error);
        }
    }

    @action
    async setCampaign() {
        await setCampaign(
            window.localStorage.getItem("mlink")!,
            window.localStorage.getItem("mpass")!,
            this.fromName!,
            this.payload!,
            this.coin!,
            this.value!,
            this.target!
        );
        this.initCampaign(this.link!, window.localStorage.getItem("mpass")!);
    }

    @action
    async getWalletsData() {
        try {
            this.isLoadingWalletsData = true;
            let res = await getWallets(this.link!, this.password!);
            this.walletsData = res.data;
        } catch (error) {
            console.log(error);
            message.error("Error while getting wallets");
        }
        this.isLoadingWalletsData = false;
    }
}

export const MultiStoreContext = createContext(new MultiStore());
