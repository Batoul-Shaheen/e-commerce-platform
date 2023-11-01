import express from 'express';
import { Product } from '../DB/entities/Product.entity.js';
import { Sale } from "../DB/entities/Sale.entity.js";
import { auth } from '../middlewares/auth/authenticate.js';
import { authorize } from '../middlewares/auth/authorize.js';

const router = express.Router();

router.post('/sales', auth, authorize("Post-sale"), async (req, res) => {
    const { name, startDate, endDate, discountPercentage, productIds } = req.body;
    try {
        const sale = new Sale();
        sale.name = name;
        sale.startDate = new Date(startDate);
        sale.endDate = new Date(endDate);
        sale.discountPercentage = discountPercentage;

        const products = await Product.findByIds(productIds);

        products.forEach(product => {
            product.salePrice = product.price - (product.price * discountPercentage) / 100;
            product.save();
        });

        sale.products = products;

        await sale.save();

        res.status(201).json(sale);
    } catch (error) {
        console.error('An error occurred:', error);
        res.status(500).json({ error: 'An error occurred.' });
    }
});

export default router;