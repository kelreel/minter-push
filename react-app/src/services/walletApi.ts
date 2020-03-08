import qs from "qs";
import HTTP from "./http";
import config from "../config";
import {detect} from "detect-browser";

export const postConfig = {
  headers: {"content-type": "application/x-www-form-urlencoded"}
};

export const getWallet = async (address: string) => {
  return await HTTP.get(`${config.apiURL}/wallet/${address}`);
};

export const getWalletCount = async () => {
  return await HTTP.get(`${config.apiURL}/count`);
};

export const getSeed = async (pass: string, link: string) => {
  const data = {
    pass,
    link
  };
  return await HTTP.post(`${config.apiURL}/getSeed`, qs.stringify(data), postConfig);
};

export const setTouched = async (link: string) => {
  const data = {
    link
  };
  return await HTTP.post(`${config.apiURL}/touched`, qs.stringify(data), postConfig);
};

export const sendBrowserInfo = async (link: string) => {
  let info = detect();
  const data = {
    link,
    browser: JSON.stringify(info)
  };
  return await HTTP.post(`${config.apiURL}/detect`, qs.stringify(data), postConfig);
};

export const getBalanceFromExplorer = async (address: string) => {
  return await HTTP.get(`${config.explorerURL}/addresses/${address}`);
};

export const getRates = async () => {
  return await HTTP.get(`${config.apiURL}/rates`)
}

export const getProfile = async (address: string) => {
  return await HTTP.get(`https://minter-scoring.space/api/profile/${address}`);
};

export const repackWallet = async (seed: string, name?: string) => {
  const data = {
    seed,
    name
  };
  return await HTTP.post(`${config.apiURL}/repack`, qs.stringify(data), postConfig);
};

export const sendEmail = async (email: string, link: string, fromName?: string | null) => {
  const data = {
    email, link, fromName
  };
  return await HTTP.post(`${config.apiURL}/email`, qs.stringify(data), postConfig);
};

export const getBitcoinAddressToRefill = async (email: string, address: string) => {
  return HTTP.get(`https://api.bip.dev/api/bitcoinDepositAddress`, {
    params: {
      email,
      minterAddress: address
    }
  })
}
