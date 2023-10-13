import express from 'express';
import { auth } from './authenticate.js';

// For User 
const isUser = (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
) => {
    auth(req, res, () => {
        if (res.locals.user.id === req.params.id || res.locals.user.isAdmin) {
            next();
        } else {
            res.status(403).send("Access denied. Not authorized...");
        }
    });
};

// For Admin
const isAdmin = (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
) => {
    auth(req, res, () => {
        if (res.locals.user.isAdmin) {
            next();
        } else {
            res.status(403).send("Access denied. Not authorized...");
        }
    });
};

export {
    isUser,
    isAdmin
};
