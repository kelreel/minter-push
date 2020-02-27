import qs from "qs";
import HTTP from "./http";
import config from '../config'
import {postConfig} from "./walletApi";

export const newWallet = async (pass: string, name: string, payload: string, fromName: string) => {
  const data = {
    pass,
    name,
    payload,
    fromName
  };
  return await HTTP.post(`${config.apiURL}/new`, qs.stringify(data), postConfig);
};

export const getBalance = async (address: string) => {
  return await HTTP.get(`${config.nodeURL}address?address=${address}`);
}
