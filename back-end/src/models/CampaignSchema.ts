import mongoose from "mongoose";
import { WalletStatus } from "./WalletSchema";

export enum TargetEnum {
  timeloop = "timeloop",
  bip2phone = "bip2phone",
  yandexEda = "yandexEda",
  nut = "nut"
}

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
  target: TargetEnum | null,
  preset: any
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
    target: {
      type: String,
      default: null,
      enum: ["timeloop", "yandexEda", "bip2phone", "nut", "", null]
    },
    preset: {
      type: mongoose.Schema.Types.Mixed,
      default: null
    }
  },
  {
    timestamps: true
  }
);

export const Campaign = mongoose.model<CampaignDocument>(
  "Campaign",
  campaignSchema
);
