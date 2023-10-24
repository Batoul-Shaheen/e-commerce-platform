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
// import { auth } from './authenticate.js';

// // For User 
// const isUser = (
//     req: express.Request,
//     res: express.Response,
//     next: express.NextFunction
// ) => {
//     auth(req, res, () => {
//         if (res.locals.user.id === req.params.id || res.locals.user.isAdmin) {
//             next();
//         } else {
//             res.status(403).send("Access denied. Not authorized...");
//         }
//     });
// };

// // For Admin
// const isAdmin = (
//     req: express.Request,
//     res: express.Response,
//     next: express.NextFunction
// ) => {
//     auth(req, res, () => {
//         if (res.locals.user.isAdmin) {
//             next();
//         } else {
//             res.status(403).send("Access denied. Not authorized...");
//         }
//     });
// };

// export {
//     isUser,
//     isAdmin
// };
