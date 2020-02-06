import qs from "qs";
import HTTP from "./http";
import config from "../config";
import { detect } from "detect-browser";

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
  return await HTTP.post(`${config.apiURL}/getSeed`, qs.stringify(data), {
    headers: { "content-type": "application/x-www-form-urlencoded" }
  });
};

export const setTouched = async (link: string) => {
  const data = {
    link
  };
  return await HTTP.post(`${config.apiURL}/touched`, qs.stringify(data), {
    headers: { "content-type": "application/x-www-form-urlencoded" }
  });
};

export const sendBrowserInfo = async (link: string) => {
  let info = detect();
  const data = {
    link,
    browser: JSON.stringify(info)
  };
  return await HTTP.post(`${config.apiURL}/detect`, qs.stringify(data), {
    headers: { "content-type": "application/x-www-form-urlencoded" }
  });
};

export const getBalanceFromExplorer = async (address: string) => {
  return await HTTP.get(`${config.explorerURL}/addresses/${address}`);
};

export const getPrice = async () => {
  return await HTTP.get(`${config.mbankAPI}/price`);
};

export const getProfile = async (address: string) => {
  return await HTTP.get(`https://minter-scoring.space/api/profile/${address}`);
};
