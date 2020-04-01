import bcrypt from "bcryptjs";

import { User } from "../models/UserSchema";
import { HttpException } from "../utils/errorHandler";
import { generateToken } from "./Auth";

const getPasswordHash = (pass: string): string => {
  const salt = bcrypt.genSaltSync(10);
  return bcrypt.hashSync(pass, salt);
};

export const loginUser = async (login: string, password: string) => {
  try {
    const user = await User.findOne({ login });
    const comparePassword = bcrypt.compareSync(password, user.password);
    if (!comparePassword) {
      throw new HttpException(401, "Wrong login or password");
    } else {
      return {
        login,
        token: generateToken(user._id, login)
      };
    }
  } catch (error) {
    throw new HttpException(401, "Wrong login or password");
  }
};

export const createUser = async (
  login: string,
  password: string,
  email?: string
) => {
  let findUser = await User.findOne({ login });

  if (findUser) throw new HttpException(400, "User already exists");
  if (!password) throw new HttpException(400, "Password not provided");

  let user = new User({
    login,
    password: getPasswordHash(password),
    email
  });

  try {
    await user.save();
    return {
      login,
      token: generateToken(user._id, user.login)
    };
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const editUser = async (
  _id: string,
  email: string,
  password: string | null
) => {
  try {
    let user = await User.findById(_id);
    if (email) user.email = email;
    if (password) user.password = getPasswordHash(password);
    await user.save();
    return {
      login: user.login,
      email: user.email
    };
  } catch (error) {
    throw error;
  }
};
