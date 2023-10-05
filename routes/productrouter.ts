import express from 'express';

const router = express.Router();

router.get('/Product', async(req,res) => {
    try {
       
    } catch (error) {
        res.status(500).send(error)
    }

});

router.get('/product/:id', async(req,res) => {
    try {
       
    } catch (error) {
        res.status(500).send(error)
    }

});

router.post('/product', async(req,res) => {
    try {
       
    } catch (error) {
        res.status(500).send(error)
    }

});

router.delete('/product/:id', async(req,res) => {
    try {
       
    } catch (error) {
        res.status(500).send(error)
    }

});

export default router;