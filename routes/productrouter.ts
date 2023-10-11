import express from 'express';
import { Product } from '../DB/entities/Product.entity.js';
import { Equal } from 'typeorm';
import { getProductsById, insertProduct } from '../controllers/poduct.js';
import { Category } from '../DB/entities/Category.entity.js';

const router = express.Router();

router.get('/:categoryId', async (req, res) => {
    try {
        const categoryId = req.params.categoryId;
        const products = await Product.find({
            where: { category: Equal(categoryId) }
        });
        res.send(products);
    } catch (error) {
        res.status(500).send(error)
    }
});

router.get('/:id', async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        const product = await getProductsById(id);
        if (!product) {
            return res.status(404).send('Product not found');
        }
        res.send(product);
    } catch (error) {
        res.status(500).send(error)
    }

});

router.post('/', async (req, res) => {
    try {
        const product = req.body;
        const categoryName = product.categoryName;
        if(!categoryName){
            return res.status(400).send('Category Name is missing' );
        }
        const category = await Category.findOne(categoryName);
        if(!category){
            return  res.status(400).send('Category Not Found') ;
        }
        await insertProduct({
            ...product ,
            category
        });
        await product.save()
        res.status(201).send('Product inserted successfully');
    } catch (error) {
        res.status(500).send(error)
    }
});

router.delete('/:id', async (req, res) => {
    try {
        const id = parseInt(req.params.id)
        const product = await Product.findOneBy({ id });
        if (product) {
            await product.remove();
            res.send('Product deleted');
        } else {
            res.status(404).send('Product not found !')
        }
    } catch (error) {
        res.status(500).send(error)
    }
});

export default router;