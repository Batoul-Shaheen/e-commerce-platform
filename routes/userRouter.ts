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
  insertUser(req.body).then(() => {
    res.status(201).send("User and shopping cart created successfully");
  }).catch(err => {
    console.error(err);
    res.status(500).send(err);
  });
});
// router.post("/signup", validateUser, async (req, res, next) => {
//   try {
//     const userData = req.body;
//     const shoppingCartData = req.body.shoppingCart;

//     const user = await insertUser(userData);

//     if (userData.type === 'User') {
//       const shoppingCart = ShoppingCart.create(shoppingCartData);
//       shoppingCart.users = user;
//       await shoppingCart.save();
//       res.status(201).send('User and shopping cart created successfully');

//     } else if (userData.type === 'Admin') {
//       res.send("You are 'Admin', There is no shoppingCart for you ;)");

//     } else {
//       res.status(400).send("Invalid user type");
//     }
//   } catch (error) {
//     res.status(500).send('Internal server error');
//   }
// });

// login user
router.post("/login", async (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;
  loginUser(email, password)
    .then((data) => {
      res.cookie('username', data.username, {
        maxAge: 60 * 60 * 1000
      });
      res.cookie('loginTime', Date.now(), {
        maxAge: 60 * 60 * 1000
      });
      res.cookie('token', data.token, {
        maxAge: 60 * 60 * 1000
      });

      res.send();
    })
    .catch(err => {
      res.status(401).send(err);
    })
});

// logout user
router.get("/logout", async (req, res, next) => {
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
