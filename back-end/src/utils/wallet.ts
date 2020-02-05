import bcrypt from 'bcryptjs';
import { generateWallet, walletFromMnemonic } from 'minterjs-wallet';
import short from 'short-uuid';

import config from '../config';
import { Wallet, WalletStatus } from '../models/WalletSchema';

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