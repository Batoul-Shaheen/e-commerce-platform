import express from "express";
import {
  insertUser,
  loginUser,
  getUsers,
  getUsersById,
} from "../controllers/user.js";
import { validateUser } from "../middlewares/validation/user.js";
import { auth } from "../middlewares/auth/authenticate.js";
import { ShoppingCart } from "../DB/entities/ShoppingCart.entity.js";

const router = express.Router();

// signup user
router.post("/signup", validateUser, async (req, res, next) => {
  try {
    // Extract user and shopping cart data from the request body
    const userData = req.body;
    const shoppingCartData = req.body.shoppingCart;

    // Create a new user
    const user = await insertUser(userData);

    // Create a new shopping cart
    if (userData.type === 'User') {
      const shoppingCart = ShoppingCart.create(shoppingCartData);
      shoppingCart.users = user;
      await shoppingCart.save();
      res.status(201).send('User and shopping cart created successfully');

    } else if (userData.type === 'Admin') {
      res.send("You are 'Admin', There is no shoppingCart for you ;)");

    } else {
      // Handle the case where the user type is neither 'User' nor 'Admin'
      res.status(400).send("Invalid user type");
    }
  } catch (error) {
    res.status(500).send('Internal server error');
  }
});

// login user
router.post("/login", auth, async (req, res, next) => {
    const email = req.body.email;
    const password = req.body.password;

    if (email && password) {
      loginUser(email, password)
        .then((data) => {
          res.status(200).send(data);
        })
        .catch((err) => {
          res.status(404).send(err);
        });
    } else {
      res.status(400).send(`Invalid email or password.`);
    }
  });

// logout user
router.post("/logout", async (req, res, next) => {
  res.cookie("fullName", "", {
    maxAge: -1, // This means the cookie will be deleted
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
