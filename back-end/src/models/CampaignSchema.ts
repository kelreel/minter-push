import mongoose from "mongoose";
import { WalletStatus } from "./WalletSchema";

export type CampaignDocument = mongoose.Document & {
  address: string;
  seed: string;
  password: string | null;
  name: string | null;
  fromName: string | null;
  payload: string | null;
  status: WalletStatus;
  link: string;
  walelts: String[] | null;
  amount: Number | null,
  coin: String | null,
  returnDay: Number | null
};

const campaignSchema = new mongoose.Schema(
  {
    address: String,
    seed: String,
    name: String,
    payload: String,
    password: String,
    fromName: String,
    link: {
      type: String,
      index: true
    },
    wallets: [String],
    amount: Number,
    coin: String,
    returnDay: Number
  },
  {
    timestamps: true
  }
);

export const Campaign = mongoose.model<CampaignDocument>(
  "Campaign",
  campaignSchema
);
