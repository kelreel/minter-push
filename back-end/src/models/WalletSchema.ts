import mongoose from "mongoose";

export enum WalletStatus {
  waiting = "waiting", // waiting balance
  created = "created",
  opened = "opened",
  touched = "touched"
}

export type WalletDocument = mongoose.Document & {
  address: string;
  seed: string;
  password: string | null;
  name: string | null;
  fromName: string | null;
  payload: string | null;
  status: WalletStatus;
  link: string;
  campaign: mongoose.Types.ObjectId | null;
  redeem: any;
  browser: any;
  active: boolean;
  coin: string | null;
  amount: string | null;
  email: string | null;
  preset: any;
};

const walletSchema = new mongoose.Schema(
  {
    address: String,
    seed: String,
    password: String,
    fromName: String,
    name: String,
    payload: String,
    campaign: {
      type: mongoose.Types.ObjectId,
      ref: "Campaign"
    },
    link: {
      type: String,
      index: true
    },
    status: {
      type: String,
      enum: ["waiting", "created", "opened", "touched"],
      default: "created"
    },
    browser: mongoose.Schema.Types.Mixed,
    redeem: mongoose.Schema.Types.Mixed,
    active: {
      type: Boolean,
      default: true
    },
    coin: {
      type: String,
      default: null
    },
    amount: {
      type: String,
      default: null
    },
    email: {
      type: String,
      default: null
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

export const Wallet = mongoose.model<WalletDocument>("Wallet", walletSchema);
