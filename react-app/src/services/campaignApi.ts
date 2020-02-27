import qs from "qs";
import HTTP from "./http";
import config from "../config";
import {postConfig} from "./walletApi";

export const newCampaign = async (
  pass: string,
  name: string,
  number: number
) => {
  const data = {
    pass,
    name,
    number
  };
  return await HTTP.post(`${config.apiURL}/campaign/new`, qs.stringify(data), postConfig);
};

export const getCampaign = async (link: string, pass: string) => {
  const data = {
    link,
    pass
  };
  return await HTTP.post(`${config.apiURL}/campaign/get`, qs.stringify(data), postConfig);
};

export const sheetAdd = async (link: string, pass: string, sheet: string) => {
  const data = {
    link,
    pass,
    sheet
  };
  return await HTTP.post(`${config.apiURL}/campaign/sheetAdd`, qs.stringify(data), postConfig);
};

export const deleteWalletFromCampaign = async (link: string, pass: string, walletLink: string) => {
  const data = {
    link,
    pass,
    walletLink
  };
  return await HTTP.post(`${config.apiURL}/campaign/deleteWallet`, qs.stringify(data), postConfig);
};


export const getWallets = async (link: string, pass: string) => {
  const data = {
    link,
    pass
  };
  return await HTTP.post(`${config.apiURL}/campaign/getWallets`, qs.stringify(data), postConfig);
};

export const editWallet = async (
  link: string,
  pass: string,
  walletLink: string,
  coin: string,
  amount: number,
  status: string,
  name: string,
  email: string
) => {
  const data = {
    link,
    pass,
    walletLink,
    coin,
    amount,
    status,
    name,
    email
  };
  return await HTTP.post(
    `${config.apiURL}/campaign/editWallet`,
    qs.stringify(data),
    postConfig
  );
};

export const setCampaign = async (
  link: string,
  pass: string,
  fromName: string,
  payload: string,
  coin: string,
  value: number,
  target: string
) => {
  const data = {
    link,
    pass,
    fromName,
    payload,
    coin,
    value,
    target
  };
  return await HTTP.post(`${config.apiURL}/campaign/set`, qs.stringify(data), postConfig);
};

export const addWallets = async (link: string, pass: string, number: number = 10) => {
  const data = {
    link,
    pass,
    number
  };
  return await HTTP.put(
    `${config.apiURL}/campaign/addWallets`,
    qs.stringify(data),
    postConfig
  );
};

export const getWalletsTxt = async (link: string, pass: string) => {
  const data = {
    link,
    pass
  };
  return await HTTP.post(
    `${config.apiURL}/campaign/getWalletsTxt.txt`,
    qs.stringify(data),
    postConfig
  );
};

export const setCampaignPreset = async (link: string, pass: string, preset: string) => {
  const data = {
    link,
    pass,
    preset
  };
  return await HTTP.post(`${config.apiURL}/campaign/setPreset`, qs.stringify(data), postConfig);
};

export const resetCampaignPreset = async (link: string, pass: string) => {
  const data = {
    link,
    pass
  };
  return await HTTP.post(`${config.apiURL}/campaign/resetPreset`, qs.stringify(data), postConfig);
};
