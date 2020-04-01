import express from "express";
import * as jwt from "jsonwebtoken";

import config from "../config";

export type DecodedTokenType = {
  _id?: string;
  login?: string;
};

export const getToken = (req: express.Request): string =>
  req.headers.authorization.split(" ")[1];

export const generateToken = (_id: string, login: string) => {
  const data = {
    _id,
    login
  };
  return jwt.sign(data, config.tokenSecret, {
    expiresIn: config.tokenExpiration
  });
};

export const decodeToken = (token: string): DecodedTokenType => {
  return jwt.verify(token, config.tokenSecret) as DecodedTokenType;
};
