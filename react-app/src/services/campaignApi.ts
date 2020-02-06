import qs from "qs";
import HTTP from "./http";
import config from "../config";

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
  return await HTTP.post(`${config.apiURL}/campaign/new`, qs.stringify(data), {
    headers: { "content-type": "application/x-www-form-urlencoded" }
  });
};

export const getCampaign = async (link: string, pass: string) => {
  const data = {
    link,
    pass
  };
  return await HTTP.post(`${config.apiURL}/campaign/get`, qs.stringify(data), {
    headers: { "content-type": "application/x-www-form-urlencoded" }
  });
};

export const deleteWalletFromCampaign = async (link: string, pass: string, walletLink: string) => {
  const data = {
    link,
    pass,
    walletLink
  };
  return await HTTP.post(`${config.apiURL}/campaign/deleteWallet`, qs.stringify(data), {
    headers: { "content-type": "application/x-www-form-urlencoded" }
  });
};


export const getWallets = async (link: string, pass: string) => {
  const data = {
    link,
    pass
  };
  return await HTTP.post(`${config.apiURL}/campaign/getWallets`, qs.stringify(data), {
    headers: { "content-type": "application/x-www-form-urlencoded" }
  });
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
  return await HTTP.post(`${config.apiURL}/campaign/set`, qs.stringify(data), {
    headers: { "content-type": "application/x-www-form-urlencoded" }
  });
};

export const addWallets = async (link: string, pass: string, number: number = 10) => {
  const data = {
    link,
    pass,
    number
  };
  return await HTTP.post(
    `${config.apiURL}/campaign/addWallets`,
    qs.stringify(data),
    {
      headers: { "content-type": "application/x-www-form-urlencoded" }
    }
  );
};