import express from 'express';
import jwt from 'jsonwebtoken';
import { User } from '../../DB/entities/User.entity.js';

const authenticate = async (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) => {
  const token = req.headers['authorization'] || req.cookies['token'] || '';  
  let tokenIsValid;
  try {
    tokenIsValid = jwt.verify(token, process.env.SECRET_KEY || '');
  } catch (error) { }

  if (tokenIsValid) {
    const decoded = jwt.decode(token, { json: true });
    const user = await User.findOneBy({ email: decoded?.email || '' })
    res.locals.user = user;
    next();
  } else {
    res.status(401).send("You are Unauthorized!");
  }
}

export {
  authenticate
}