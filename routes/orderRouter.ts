import express from 'express';

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
       
    } catch (error) {
        res.status(500).send(error)
    }

});

export default router;