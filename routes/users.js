const express = require("express");
const usersRouter = express.Router();

const {
  createUser,
  getUserByUsername,
  getAllUsers,
  deleteUser,
  updateUser,
  makeAdmin
} = require("../db");

const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { requireUser, requireAdmin } = require('./utils');
const { JWT_SECRET } = process.env;

// GET /users/me
usersRouter.get("/me", requireUser, async (req, res, next) => {
  try {
    const user = req.user;
    delete user.password;
    res.send(user);
  } catch (error) {
    console.error("Error on user/me")
    res.status(404);
    next(error);
  }
});

usersRouter.get("/users", requireAdmin, async (req, res, next) => {
  try {
    const users = await getAllUsers();
    res.send(users);
  } catch (error) {
    console.error("Error on user/users")
    res.status(404);
    next(error)
  }
});

//POST /users/login
usersRouter.post("/login", async (req, res, next) => {
  const { username, password } = req.body;
  if (!username || !password) {
    next(new Error("Missing login credentials!"));
  }
  try {
    const user = await getUserByUsername(username);

    if (!user) {
      next(new Error(`user with username ${username} not found!`));
    } else {
      const passwordsMatch = await bcrypt.compare(password, user.password);
      if (passwordsMatch) {
        delete user.password;
        const token = jwt.sign(user, JWT_SECRET);
        res.send({
          user,
          token,
          message: `logged in as ${username} successfully!`,
        });
      } else {
        res.send({
          error: "invalid credentials!",
          message: "username and/or password is incorrect!",
        });
      }
    }
  } catch (error) {
    console.error("Error on user/login");
    throw error;
  }
});

//POST /users/register
usersRouter.post('/register', async (req, res, next) => {
  try {
    const { username, password, email } = req.body;

    if (!username || !password || !email) {
      return next(new Error("Missing credentials"));
    }

    const user = await getUserByUsername(username);

    if (user) {
      const error = new Error("username is taken");
      return res.send({
        error: "username already taken!",
        message: "username is already taken!"
      })
    }

    if (password.length < 8) {
      const error = new Error('Password must be at least 8 characters');
      return next(error);
    }

    const newUser = await createUser({ username, password, email });
    const token = jwt.sign(newUser, JWT_SECRET);
    res.send({
      user: newUser,
      token,
      message: "You are signed in!"
    });
  } catch (error) {
    console.error("Error on register/user");
    next(error);
  }
});

//PATCH /users/:userId
usersRouter.patch('/:userId', requireUser, async (req, res, next) => {
  try {
    const userId = req.user.id;
    if (userId) {
      const editUser = await updateUser(id);
      res.send(editUser);
    } else {
      return "Cannot edit user. Invalid user."
    }
  } catch (error) {
    console.error("Error editing/patching user");
    next(error);
  }
});

//DELETE /users/:userId
usersRouter.delete('/:userId', requireUser, requireAdmin, async (req, res, next) => {
  try {
    const userId = req.user.id;
    if (userId) {
      const deleteCurrentUser = await deleteUser(id);
      res.send(deleteCurrentUser);
    } else {
      return "Cannot delete user. Invalid user.";
    }
  } catch (error) {
    console.error("error deleting user");
    next(error);
  }
});

//admin => make other users admins
usersRouter.patch('/:userId', requireAdmin, async (req, res, next) => {
  try {
    if (req.user.isAdmin === true) {
      const makeUserAdmin = await makeAdmin();
      res.send(makeUserAdmin);
    } else {
      return "Cannot make user admin."
    }
  } catch (error) {
    console.error("Error on making another admin");
    next(error);
  }
});

module.exports = usersRouter;
