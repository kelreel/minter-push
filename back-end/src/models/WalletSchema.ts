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
  link: string
};

const walletSchema = new mongoose.Schema(
  {
    address: String,
    seed: String,
    password: String,
    fromName: String,
    name: String,
    payload: String,
    link: String,
    status: {
      type: String,
      enum: ["waiting", "created", "opened", "touched"],
      default: "waiting"
    }
  },
  {
    timestamps: true
  }
);

export const Wallet = mongoose.model<WalletDocument>("Wallet", walletSchema);
