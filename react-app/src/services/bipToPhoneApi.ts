import HTTP from "./http";
import config from "../config";
import qs from "qs";

export const getInfo = async () => {
  return await HTTP.get(`${config.apiURL}/phone/getInfo`);
};

export const getKeyword = async (phone: string) => {
  const data = { phone };
  return await HTTP.post(
    `${config.apiURL}/phone/getKeyword`,
    qs.stringify(data),
    {
      headers: { "content-type": "application/x-www-form-urlencoded" }
    }
  );
};
