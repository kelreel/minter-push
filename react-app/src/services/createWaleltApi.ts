import qs from "qs";

import config from "../config";
import HTTP from "./http";
import { postConfig } from "./walletApi";

export const newWallet = async (
  pass: string,
  name: string,
  payload: string,
  fromName: string,
  preset: any
) => {
  const data = {
    pass,
    name,
    payload,
    fromName,
    preset: JSON.stringify(preset)
  };
  console.log(preset);
  return await HTTP.post(
    `${config.apiURL}/new`,
    qs.stringify(data),
    postConfig
  );
};

export const getBalance = async (address: string) => {
  return await HTTP.get(`${config.nodeURL}address?address=${address}`);
};
