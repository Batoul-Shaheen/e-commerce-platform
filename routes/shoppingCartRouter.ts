import express from "express";
import { Product } from "../DB/entities/Product.entity.js";
import { isUser } from "../middlewares/auth/authorize.js";

const router = express.Router();

router.get('/:id', isUser, async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        const products = await Product.find({
            where: { id }
        });
        res.send(products);
    } catch (error) {
        res.status(500).send(error)
    }
});

export default router;