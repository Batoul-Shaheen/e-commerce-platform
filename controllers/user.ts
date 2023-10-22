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

export { insertUser, getUsers, getUsersById };
