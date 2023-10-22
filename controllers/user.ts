import dataSource from "../DB/dataSource.js";
import { User } from "../DB/entities/User.entity.js";
import { ShoppingCart } from "../DB/entities/ShoppingCart.entity.js";
import { NSUser } from "../types.js";


const insertUser = (payload: NSUser.User) => {
  return dataSource.manager.transaction(async (transaction) => {
    const newUser = User.create({
      ...payload,
    });
    await transaction.save(newUser);
    if(payload.type === 'User'){
      const shoppingCartData = ShoppingCart.create({
        id : newUser.id
      });
      shoppingCartData.users = newUser;
      await transaction.save(shoppingCartData)
    }
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
