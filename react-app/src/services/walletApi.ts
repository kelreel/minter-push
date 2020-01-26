import qs from "qs";
import HTTP from "./http";
import config from "../config";

export const getWallet = async (address: string) => {
  return await HTTP.get(`${config.apiURL}/wallet/${address}`);
};

export const getSeed = async (
  pass: string,
  link: string
) => {
  const data = {
    pass,
    link
  };
  return await HTTP.post(`${config.apiURL}/getSeed`, qs.stringify(data), {
    headers: { "content-type": "application/x-www-form-urlencoded" }
  });
};

export const getBalanceFromExplorer = async (address: string) => {
  return await HTTP.get(`${config.explorerURL}/addresses/${address}`);
};

export const getPrice = async () => {
  return await HTTP.get(`${config.mbankAPI}/price`);
}