import qs from "qs";

import config from "../config";
import HTTP from "./http";
import { postConfig } from "./walletApi";

export const getGifteryProducts = async () => {
  return await HTTP.get(`${config.apiURL}/giftery/products`);
};

export const getCertificate = async (id: string) => {
  return await HTTP.get(`${config.apiURL}/giftery/certificate/${id}`);
};

export const makeOrder = async (
  link: string,
  product_id: number,
  face: number,
  email_to: string,
  seed: string,
  coin: string
) => {
  const data = {
    link,
    product_id,
    face,
    email_to,
    seed,
    coin
  };
  return await HTTP.post(
    `${config.apiURL}/giftery/makeOrder`,
    qs.stringify(data),
    postConfig
  );
};
