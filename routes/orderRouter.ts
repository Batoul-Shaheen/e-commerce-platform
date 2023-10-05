import express from 'express';

const router = express.Router();

router.get('/orders', async (req, res) => {
    try {
       
    } catch (error) {
        res.status(500).send(error)
    }
});

router.post('/orders',  async (req, res) => {
    try {
       
    } catch (error) {
        res.status(500).send(error)
    }

});

router.post('/orders/checkout',  async (req, res) => {
    try {
       
    } catch (error) {
        res.status(500).send(error)
    }

});

export default router;