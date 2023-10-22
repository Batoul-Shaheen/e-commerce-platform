import express from "express";
import {
  insertUser,
  getUsers,
  getUsersById,
} from "../controllers/user.js";
import { validateUser } from "../middlewares/validation/user.js";
import { auth } from "../middlewares/auth/authenticate.js";
import { ShoppingCart } from "../DB/entities/ShoppingCart.entity.js";
import { User } from "../DB/entities/User.entity.js";
import bcrypt from "bcrypt";

const router = express.Router();

// signup user
router.post("/signup", validateUser, async (req, res, next) => {
  try {
    const userData = req.body;
    const shoppingCartData = req.body.shoppingCart;

    const user = await insertUser(userData);

    if (userData.type === 'User') {
      const shoppingCart = ShoppingCart.create(shoppingCartData);
      shoppingCart.users = user;
      await shoppingCart.save();
      res.status(201).send('User and shopping cart created successfully');

    } else if (userData.type === 'Admin') {
      res.send("You are 'Admin', There is no shoppingCart for you ;)");

    } else {
      res.status(400).send("Invalid user type");
    }
  } catch (error) {
    res.status(500).send('Internal server error');
  }
});

router.post("/login", async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOneBy({ email });

    if (!user) {
      return res.status(401).json({ message: 'Authentication failed!!' });
    }

    const isPasswordValid = await bcrypt.compare(password, user?.password || '')

    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Authentication failed' });
    }

    res.status(200).json({ message: 'Login successful', user });
  } catch (error) {
    res.status(500).json({ message: 'An error occurred' });
  }
});

router.get("/logout", async (req, res, next) => {
  const username = req.body
  res.cookie("username", "", {
    maxAge: -1,
    expires: new Date(Date.now() - 1000),
  });
  res.cookie("loginTime", "", {
    maxAge: -1,
  });
  res.cookie("token", "", {
    maxAge: -1,
  });

  res.send("successfully log out");
});

// get all user
router.get("/", async (req, res) => {
  try {
    const AllUser = await getUsers();
    res.send(AllUser);
  } catch (error) {
    res.status(500).send(error);
  }
});

//get user by id
router.get("/:id", async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const UserById = await getUsersById(id);
    res.send(UserById);
  } catch (error) {
    res.status(500).send(error);
  }
});

export default router;
