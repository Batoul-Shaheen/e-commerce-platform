import express from "express";
import {
  insertUser,
  loginUser,
  getUsers,
  getUsersById,
} from "../controllers/user.js";
import { validateUser } from "../middlewares/validation/user.js";
import { authenticate } from "../middlewares/auth/authenticate.js";

const router = express.Router();

router.post("/signup", validateUser, async (req, res, next) => {
  insertUser(req.body)
    .then(() => {
      res.status(201).send();
    })
    .catch((err) => {
      next(err);
    });
});

router.post("/login", async (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;

  loginUser(email, password)
    .then((data) => {
      res.cookie("fullName", data.user, {
        maxAge: 60 * 60 * 1000,
      });
      res.cookie("loginTime", Date.now(), {
        maxAge: 60 * 60 * 1000,
      });
      res.cookie("token", data.token, {
        maxAge: 60 * 60 * 1000,
      });

      res.send();
    })
    .catch((err) => {
      next({
        code: "INVALID_CREDENTIALS",
        message: err,
      });
    });
});

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

router.get("/", authenticate, async (req, res) => {
  try {
    const AllUser = await getUsers();
    res.send(AllUser);
  } catch (error) {
    res.status(500).send(error);
  }
});

router.get("/:name", authenticate, async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const UserById = await getUsersById(id);
    res.send(UserById);
  } catch (error) {
    res.status(500).send(error);
  }
});

export default router;
