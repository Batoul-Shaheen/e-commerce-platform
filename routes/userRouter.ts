import express from "express";
import { insertUser, getUsers, getUsersById, insertRole, insertPermission, getRoles } from "../controllers/user.js";
import { validateUser } from "../middlewares/validation/user.js";
import { auth } from "../middlewares/auth/authenticate.js";
import { User } from "../DB/entities/User.entity.js";
import bcrypt from "bcrypt";
import { authorize } from "../middlewares/auth/authorize.js";

const router = express.Router();

router.post("/signup", validateUser, async (req, res, next) => {
  insertUser(req.body).then(() => {
    res.status(201).send("User and shopping cart created successfully");
  }).catch(err => {
    console.error(err);
    res.status(500).send(err);
  });
});

router.post('/role', authorize('POST_users/role'), auth,
  (req, res, next) => {
    insertRole(req.body).then((data) => {
      res.status(201).send(data)
    }).catch(err => {
      console.error(err);
      res.status(500).send(err);
    });
  });

router.post('/permission', auth, (req, res, next) => {
  insertPermission(req.body).then((data) => {
    res.status(201).send(data)
  }).catch(err => {
    console.error(err);
    res.status(500).send(err);
  });
});

router.post("/login", async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOneBy({ email });

    if (!user) {
      return res.status(404).json({ message: 'Authentication failed!!' });
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

router.get('/roles', authorize('GET_users/role'), auth,
  async (req, res, next) => {
    try {
      const roles = await getRoles();
      res.send(roles);
    } catch (error) {
      res.status(500).send("Something went wrong");
    }
  });

router.get("/", async (req, res) => {
  try {
    const AllUser = await getUsers();
    res.send(AllUser);
  } catch (error) {
    res.status(500).send(error);
  }
});

router.get("/:id", async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const UserById = await getUsersById(id);
    res.send(UserById);
  } catch (error) {
    res.status(500).send(error);
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

  res.status(200).send("successfully log out");
});

export default router;