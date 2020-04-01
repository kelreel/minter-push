import request from "request-promise";

import config from "../config";
import { Phone } from "../models/PhoneSchema";

export const getBiptoPhoneInfo = async () => {
  let r = await request.post(config.b2phoneAPI, {
    formData: {
      curs: 1,
      key1: config.b2phoneKEY
    }
  });
  try {
    r = JSON.parse(r);
    return r;
  } catch (error) {
    throw error;
  }
};

export const getKeywordByPhone = async (phone: string) => {
  let r = await request.post(config.b2phoneAPI, {
    formData: {
      key1: config.b2phoneKEY,
      phone: phone,
      contact: 1
    }
  });
  r = JSON.parse(r);
  if (!r.keyword) throw r.responce;
  await new Phone({ phone, keyword: r.keyword }).save();
  return r.keyword;
};

export const getStatusPhone = async (phone: string, keyword?: string) => {
  let r = await request.post(config.b2phoneAPI, {
    formData: {
      key1: config.b2phoneKEY,
      phone: phone,
      status: 1
    }
  });
  try {
    r = JSON.parse(r);
    return r;
  } catch (error) {
    throw error;
  }
};
