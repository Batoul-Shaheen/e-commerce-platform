import express from 'express';
import { Product } from '../DB/entities/Product.entity.js';
import { Sale } from "../DB/entities/Sale.entity.js";

const router = express.Router();

router.post('/', async (req, res) => {
    try {
        const { name, startDate, endDate, discountPercentage, productIds } = req.body;

        const products = await Product.findBy(productIds);

        if (!products || products.length === 0) {
            return res.status(400).send("No valid products selected for the sale.");
        }

        const newSale = Sale.create({
            name,
            startDate,
            endDate,
            discountPercentage,
            products,
        });

        const savedSale = await Sale.save(newSale);

        return res.status(201).json(savedSale);
    } catch (error) {
        console.error(error);
        return res.status(500).send("Internal server error");
    }
});

router.put('/:id', async (req, res) => {
    try {
        const { name, startDate, endDate, discountPercentage, productIds } = req.body;

        const sale = await Sale.findOne({ relations: ["products"], where: { id: parseInt(req.params.id) } });

        if (!sale) {
            return res.status(404).send("Sale not found.");
        }

        if (productIds) {
            const products = await Product.findBy(productIds);
            sale.products = products;
        }

        if (name) sale.name = name;
        if (startDate) sale.startDate = startDate;
        if (endDate) sale.endDate = endDate;
        if (discountPercentage) sale.discountPercentage = discountPercentage;

        const updatedSale = await Sale.save(sale);

        return res.status(200).json(updatedSale);
    } catch (error) {
        console.error(error);
        return res.status(500).send("Internal server error");
    }
});

export default router;