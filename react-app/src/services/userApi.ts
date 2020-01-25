import qs from "qs";
import HTTP from "./http";
import config from '../config'

export const getCurrentUser = async () => {
  return await HTTP.get(
    `${config.apiURL}/users/${localStorage.getItem("wallet")}`
  );
}

export const getUser = async (address: string) => {
  return await HTTP.get(`${config.apiURL}/users/${address}`);
};

export const checkUser = async () => {
  const data = {
    seed: localStorage.getItem("seed")
  };
  return await HTTP.post(`${config.apiURL}/users/check`, qs.stringify(data), {
    headers: { "content-type": "application/x-www-form-urlencoded" }
  });
};

export type UserTop = {
  address: string;
  balance: number;
  games: number;
  id: string;
}

export const getTop = async () => {
  return await HTTP.get<Array<UserTop>>(`${config.apiURL}/users/top`);
}