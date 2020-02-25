import mongoose from "mongoose";

export enum DigitalAcceptance {
  no = "no", // only printing
  any = "any",
  eshop = "eshop",
  offline = "offline"
}

export type ProductDocument = mongoose.Document & {
  id: number;
  title: string;
  url: string;
  brief: string;
  categories: number[];
  faces: number[];
  face_step: number;
  face_min: number;
  face_max: number;
  image_url: string;
  disclaimer: string;
  digital_acceptance: DigitalAcceptance;
};

const txSchema = new mongoose.Schema(
  {
    id: Number,
    title: String,
    url: String,
    brief: String,
    categories: [Number],
    faces: [Number],
    face_step: Number,
    face_min: Number,
    face_max: Number,
    image_url: String,
    disclaimer: String,
    digital_acceptance: String
  },
  {
    timestamps: true
  }
);

export const Product = mongoose.model<ProductDocument>("Product", txSchema);
