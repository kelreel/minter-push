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

export const createWallet = async (
  password: string | null = null,
  name: string | null = null,
  payload: string | null = null,
  fromName: string | null = null
) => {
  const seed = generateSeed();
  const address = getAddressFromSeed(seed);
  let hash: string | null = null;

  if (password) {
    const salt = bcrypt.genSaltSync(10);
    hash = bcrypt.hashSync(password, salt);
  }

  const link = short.generate().substring(0, 6);

  const wallet = new Wallet({
    address,
    seed,
    name,
    payload,
    status: WalletStatus.created,
    password: hash,
    fromName,
    link
  });

  await wallet.save();

  return {
    address,
    seed,
    link
  };
};

export const getWalletFromCampaign = async (wallet: WalletDocument) => {
  let camp = await Campaign.findOne({ _id: wallet.campaign });
  console.log(camp);
  
  wallet.status = WalletStatus.opened;
  await wallet.save();

  return {
    address: wallet.address,
    name: wallet.name,
    fromName: camp.fromName,
    payload: camp.payload,
    password: wallet.password ? true : false,
    seed: wallet.password ? null : wallet.seed
  };
};
