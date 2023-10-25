import express from 'express';
import { NSUser } from '../../types.js';

const authorize = (api: string) => {
    return (
      req: express.Request,
      res: express.Response,
      next: express.NextFunction
    ) => {
      const permissions: NSUser.Permission[] = res.locals.user?.role?.permissions || [];
      if (permissions.filter(p => p.name === api).length > 0) {
        next();
      } else {
        res.status(403).send("You don't have the permission to access this resource!");
      }
    }
  }
  
  export {
    authorize
  }
