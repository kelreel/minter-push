import mongoose from "mongoose";

export type TxDocument = mongoose.Document & {
  txn: number,
  hash: string,
  block: number,
  timestamp: Date,
  type: number,
  payload: string,
  from: string,
  coin: string,
  value: number
};

const txSchema = new mongoose.Schema(
  {
    question: String,
    answer: String
  },
  {
    timestamps: true
  }
);

export const Tx = mongoose.model<TxDocument>(
  "Tx",
  txSchema
);
