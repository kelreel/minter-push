import mongoose from "mongoose";

export type GifteryOrderDocument = mongoose.Document & {
  id: number,
  product_id: number,
  face: number,
  email_to: string,
  bip_value: number,
  tx: string
};

const gifteryOrderSchema = new mongoose.Schema(
  {
    id: Number,
    product_id: Number,
    face: Number,
    email_to: String,
    bip_value: Number,
    tx: String
  },
  {
    timestamps: true
  }
);

export const GifteryOrder = mongoose.model<GifteryOrderDocument>(
  "GifteryOrder",
  gifteryOrderSchema
);
