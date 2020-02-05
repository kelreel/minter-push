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
  wallets: string[] | null;
  value: number | null;
  coin: string | null;
  returnDay: number | null;
  target: string | null
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
    value: Number,
    coin: String,
    returnDay: Number,
    target: String
  },
  {
    timestamps: true
  }
);

export const Campaign = mongoose.model<CampaignDocument>(
  "Campaign",
  campaignSchema
);
