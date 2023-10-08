import express from 'express';
import { Product } from '../DB/entities/Product.entity.js';

const router = express.Router();

router.get('/', async(req,res) => {
    try {
       
    } catch (error) {
        res.status(500).send(error)
    }

});

router.get('/:id', async(req,res) => {
    try {
       
    } catch (error) {
        res.status(500).send(error)
    }

});

router.post('/', async(req,res) => {
    try {
       
    } catch (error) {
        res.status(500).send(error)
    }

});

router.delete('/:id', async(req,res) => {
    try {
        const id = Number(req.params.id)
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