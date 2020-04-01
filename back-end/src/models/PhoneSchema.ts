import mongoose from "mongoose";

export type PhoneDocument = mongoose.Document & {
  phone: number;
  keyword: string;
};

const txSchema = new mongoose.Schema(
  {
    phone: Number,
    keyword: String
  },
  {
    timestamps: true
  }
);

export const Phone = mongoose.model<PhoneDocument>("Phone", txSchema);
