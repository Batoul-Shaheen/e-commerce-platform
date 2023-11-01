import express from "express";
import { Category } from "../DB/entities/Category.entity.js";
import { insertCategory } from "../controllers/category.js";
import { authorize } from "../middlewares/auth/authorize.js";
import { auth } from "../middlewares/auth/authenticate.js";

const router = express.Router();

router.get('/', async (req, res) => {
    const categoryList = await Category.find();

    if (!categoryList) {
        res.status(500).send({ success: false })
    }
    res.status(200).send(categoryList);
});

router.post('/categoryName', auth, authorize('POST-category'), (req, res) => {
    const category = req.body
    insertCategory(category).then((data) => {
        res.status(201).send(data)
    }).catch(err => {
        console.error(err);
        res.status(500).send(err);
    });
});

export default router