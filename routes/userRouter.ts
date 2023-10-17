import express from "express";
import {
  insertUser,
  loginUser,
  getUsers,
  getUsersById,
} from "../controllers/user.js";
import { validateUser } from "../middlewares/validation/user.js";
import { auth } from "../middlewares/auth/authenticate.js";

const router = express.Router();

// signup user
router.post("/signup", validateUser, async (req, res, next) => {
  insertUser(req.body)
    .then(() => {
      res.status(201).send("Successfully Added the user");
    })
    .catch((err) => {
      next(err);
    });
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

  res.send();
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
