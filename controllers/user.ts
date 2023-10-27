import dataSource from "../DB/dataSource.js";
import { User } from "../DB/entities/User.entity.js";
import { ShoppingCart } from "../DB/entities/ShoppingCart.entity.js";
import { NSUser } from "../types.js";
import { Role } from "../DB/entities/Role.entity.js";
import { Permission } from "../DB/entities/Permission.entity.js";
import { In } from "typeorm";


const insertUser = (payload: NSUser.User) => {
  return dataSource.manager.transaction(async (transaction) => {
    const role = await Role.findOneBy({ name: payload.type });
    const newUser = User.create({
      ...payload,
      role: role as Role
    });
    await transaction.save(newUser);
    if (payload.type === 'User') {
      const shoppingCartData = ShoppingCart.create({
        id: newUser.id
      });
      shoppingCartData.users = newUser;
      await transaction.save(shoppingCartData)
    }
  });
};

const insertRole = async (payload: NSUser.Role) => {
  try {
    const role = new Role();
    role.name = payload.name;
    role.permissions = await Permission.findBy({
      id: In(payload.permissions)
    });
    await role.save();
    return role;
  } catch (error) {
    console.error(error);
    throw ("Something went wrong");
  }
}

const insertPermission = async (payload: NSUser.Permission) => {
  try {
    const permission = Permission.create({
      name: payload.name
    });
    await permission.save();
    return permission;
  } catch (error) {
    console.error(error);
    throw ("Something went wrong");
  }
}

const getRoles = () => {
  return Role.find();
}
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

export {
  insertUser,
  getUsers,
  getUsersById,
  insertRole,
  insertPermission,
  getRoles
};
