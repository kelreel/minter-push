// @ts-nocheck
import bcrypt from "bcryptjs";
import { Minter, TX_TYPE } from "minter-js-sdk";
import { generateWallet, walletFromMnemonic } from "minterjs-wallet";
import short from "short-uuid";

import { Campaign } from "../models/CampaignSchema";
import { Wallet, WalletDocument, WalletStatus } from "../models/WalletSchema";
import config from "../config";

const minter = new Minter({ apiType: "node", baseURL: config.nodeURL });

export const generateSeed = () => {
  const wallet = generateWallet();
  return wallet.getMnemonic();
};

export const getAddressFromSeed = (seed: string): string => {
  let wallet;
  try {
    wallet = walletFromMnemonic(seed);
    return wallet.getAddressString();
  } catch (error) {
    throw "invalid seed";
  }
};

export const createCampaign = async (
  password: string | null = null,
  name: string | null = null
) => {
  const seed = generateSeed();
  const address = getAddressFromSeed(seed);
  let hash: string | null = null;

  const salt = bcrypt.genSaltSync(10);
  hash = bcrypt.hashSync(password, salt);

  const link = short.generate().substring(0, 6);

  const campaign = new Campaign({
    address,
    seed,
    fromName: "",
    payload: "",
    name,
    coin: "BIP",
    value: 10,
    wallets: [],
    password: hash,
    target: null,
    link: short.generate().substring(0, 6)
  });

  await campaign.save();

  return campaign;
};

export const addWallets = async (campaignId: any, number: number = 10) => {
  try {
    //let campaign = await Campaign.findById(campaignId);
    if (number > 50) number = 50;
    let wallets = [];
    for (let i = 0; i < number; i++) {
      let seed = generateSeed();
      let wallet = {
        seed,
        address: getAddressFromSeed(seed),
        link: short.generate().substring(0, 6),
        name: null,
        payload: null,
        password: null,
        fromName: null,
        campaign: campaignId
      };
      wallets.push(wallet);
    }
    await Wallet.insertMany(wallets);
    await Campaign.updateOne(
      { _id: campaignId },
      { $push: { wallets: wallets.map(x => x.link) } }
    );
  } catch (error) {
    console.log(error);
  }
};

export const getWalletFromCampaign = async (wallet: WalletDocument) => {
  let camp = await Campaign.findOne({ _id: wallet.campaign });

  if (wallet.active === false) return null;

  if (wallet.status === WalletStatus.created) {
    try {
      let r = await payToWallet(
        wallet.address,
        camp.seed,
        camp.coin,
        camp.value
      );
      wallet.redeem = {
        coin: camp.coin,
        value: camp.value,
        result: r,
        date: Date.now()
      };
      wallet.status = WalletStatus.opened;
      await wallet.save();
    } catch (error) {
      wallet.redeem = {
        coin: camp.coin,
        value: camp.value,
        result: null,
        date: Date.now()
      };
      wallet.status = WalletStatus.opened;
      await wallet.save();
      return {
        address: wallet.address,
        name: wallet.name,
        fromName: camp.fromName,
        payload: camp.payload,
        target: camp.target,
        password: wallet.password ? true : false,
        seed: wallet.password ? null : wallet.seed
      };
    }
  }

  return {
    address: wallet.address,
    name: wallet.name,
    fromName: camp.fromName,
    payload: camp.payload,
    password: wallet.password ? true : false,
    seed: wallet.password ? null : wallet.seed,
    target: camp.target
  };
};

export const payToWallet = async (
  toAddress: string,
  seed: string,
  coin: string = "BIP",
  amount: number = 1
) => {
  const wallet = walletFromMnemonic(seed);
  const privateKey = wallet.getPrivateKeyString();

  const txParams = {
    privateKey,
    chainId: config.chainId,
    type: TX_TYPE.SEND,
    data: {
      to: toAddress,
      value: amount,
      coin
    },
    gasCoin: coin
  };

  let res = await minter.postTx(txParams, { gasRetryLimit: 2 });
  console.log(res);

  return res;
};

export const getWallets = async campaignId => {
  let camp = await Campaign.findOne({ _id: campaignId });
  let wallets = await Wallet.find({ link: { $in: camp.wallets } });
  return wallets.map(x => {
    return {
      link: x.link,
      status: x.status,
      address: x.address,
      active: x.active,
      redeem: x.redeem,
      browser: x.browser,
      lastVisit: x.status !== WalletStatus.created ? x.updatedAt : null
    };
  });
};

export const getWalletsLinksTxt = async campaignId => {
  let camp = await Campaign.findOne({ _id: campaignId });
  let wallets = await Wallet.find({ link: { $in: camp.wallets } });
  let res = "";

  wallets.forEach(item => {
    res += `https://tap.mn/${item.link}\n`;
  });
  return res;
};


export const getStats = async (link: string) => {
  let camp = await Campaign.findOne({link})
  let wallets = await Wallet.find({ link: { $in: camp.wallets } });

  
}