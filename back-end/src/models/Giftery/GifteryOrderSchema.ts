import mongoose from "mongoose";

export type GifteryOrderDocument = mongoose.Document & {
  link: string,
  id: number;
  address: string;
  product_id: number;
  face: number;
  email_to: string;
  bip_value: number;
  tx: string;
  coin: string;
  bip_amount: number;
  status: string;
  error: any;
};

const gifteryOrderSchema = new mongoose.Schema(
  {
    link: String,
    id: Number,
    address: String,
    product_id: Number,
    face: Number,
    email_to: String,
    bip_value: Number,
    tx: String,
    coin: String,
    bip_amount: Number,
    status: String,
    error: mongoose.Schema.Types.Mixed
  },
  {
    timestamps: true
  }
);

export const GifteryOrder = mongoose.model<GifteryOrderDocument>(
  "GifteryOrder",
  gifteryOrderSchema
);
