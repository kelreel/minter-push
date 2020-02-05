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

// export const getWallet = async (address: string) => {
//   return await HTTP.get(`${config.apiURL}/wallet/${address}`);
// };

// export const getWalletCount = async () => {
//   return await HTTP.get(`${config.apiURL}/count`);
// };

// export const getSeed = async (pass: string, link: string) => {
//   const data = {
//     pass,
//     link
//   };
//   return await HTTP.post(`${config.apiURL}/getSeed`, qs.stringify(data), {
//     headers: { "content-type": "application/x-www-form-urlencoded" }
//   });
// };

// export const getBalanceFromExplorer = async (address: string) => {
//   return await HTTP.get(`${config.explorerURL}/addresses/${address}`);
// };

// export const getPrice = async () => {
//   return await HTTP.get(`${config.mbankAPI}/price`);
// };

// export const getProfile = async (address: string) => {
//   return await HTTP.get(`https://minter-scoring.space/api/profile/${address}`);
// };
