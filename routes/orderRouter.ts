import express from 'express';
import { Order } from '../DB/entities/Order.entity.js';

const router = express.Router();

router.get('/', async (req, res) => {
    try {
       
    } catch (error) {
        res.status(500).send(error)
    }
});

router.post('/',  async (req, res) => {
    try {
       
    } catch (error) {
        res.status(500).send(error)
    }

});

router.post('/checkout',  async (req, res) => {
    try {
        const orderCount = await Order.findAndCount();

        if(!orderCount) {
            res.status(500).json({success: false})
        } 
        res.send({
            orderCount: orderCount
        });
    } catch (error) {
        res.status(500).send(error)
    }

});

export default router;