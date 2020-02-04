// @ts-nocheck

import { generateWallet, walletFromMnemonic } from "minterjs-wallet";
import { Wallet, WalletStatus, WalletDocument } from "../models/WalletSchema";
import bcrypt from "bcryptjs";
import uuid from "uuid/v4";
import short from "short-uuid";
import { Campaign } from "../models/CampaignSchema";

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
    name,
    wallets: [],
    password: hash,
    link: short.generate().substring(0, 6)
  });

  await campaign.save();

  return campaign;
};

export const addWallets = async (campaignId: any, number: number = 10) => {
  try {
    //let campaign = await Campaign.findById(campaignId);
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
