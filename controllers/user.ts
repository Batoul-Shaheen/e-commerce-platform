import dataSource from "../DB/dataSource.js";
import { User } from "../DB/entities/User.entity.js";
import { NSUser } from "../types.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const insertUser = (payload: NSUser.User) => {
  return dataSource.manager.transaction(async (transaction) => {
    const newUser = User.create({
      ...payload,
    });
    await transaction.save(newUser);
  });
};

const loginUser = async (email: string, password: string) => {
  const user = await User.findOne({ where: { email } });
  if (!user) {
    throw new Error("User not found");
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    throw new Error("Invalid password");
  }

  const token = jwt.sign({ email: user.email }, process.env.SECRET_KEY || "", {
    expiresIn: "14d",
  });
  return { user, token };
};

const getUsers = () => {
  return User.find();
};

const getUsersById = async (id: number) => {
  try {
    const user = await User.findOne({ where: { id } });
    return user;
  } catch (error) {
    console.log(error);
  }
};

export default { insertUser, loginUser, getUsers, getUsersById };
