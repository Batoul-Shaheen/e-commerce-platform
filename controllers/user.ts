import dataSource from "../DB/dataSource.js";
import { User } from "../DB/entities/User.entity.js";
import { ShoppingCart } from "../DB/entities/ShoppingCart.entity.js";
import { NSUser } from "../types.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

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

const loginUser = async (email: string, password: string) => {
  try{
    
    const user = await User.findOneBy({ email });
    
    const passwordMatching = await bcrypt.compare(password, user?.password || '');
    
    if (user && passwordMatching) {
      const token = jwt.sign(
        {
          email: user.email,
          username: user.username
        },
        process.env.SECRET_KEY || '',
        {
          expiresIn: "30m"
        }
      );

      return { token, username: user.username };
    } else {
      throw ("Invalid Username or password!");
    }
  }catch(error){
    throw ("Invalid Username or password!");
  }
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

export { insertUser, loginUser, getUsers, getUsersById };
