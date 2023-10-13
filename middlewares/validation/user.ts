import express from 'express';
import isEmail from 'validator/lib/isEmail.js';

const validateUser = (req: express.Request,
  res: express.Response,
  next: express.NextFunction
) => {
  const values = ['fullName', 'email', 'password', 'type'];
  const user = req.body;
  const errorList = [];
  values.forEach(key => {
    if (!user[key]) {
      return errorList.push(`${key} is Required!`);
    }
  });

  if (!isEmail.default(user.email)) {
    errorList.push('Email is not Valid');
  }

  if (user.password.length < 6) {
    errorList.push('Password should contain at least 6 characters!');
  }

  if (!['Admin', 'User'].includes(user.type)) {
    errorList.push('User type unknown!');
  }

  if (errorList.length) {
    res.status(400).send(errorList);
  } else {
    next();
  }
}



export {
  validateUser
}