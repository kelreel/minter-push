import mongoose from "mongoose";

export type UserDocument = mongoose.Document & {
  login: string;
  email?: string;
  password: string;
};

const userSchema = new mongoose.Schema(
  {
    login: {
      type: String,
      index: true,
      unique: true,
      required: true
    },
    email: String,
    password: String,
  },
  {
    timestamps: true
  }
);

export const User = mongoose.model<UserDocument>("User", userSchema);
