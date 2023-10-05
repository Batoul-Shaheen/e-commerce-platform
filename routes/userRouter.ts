import express from "express";

const router = express.Router();

router.post('/signup', async(req, res) => {
    try {
        
    } catch (error) {
        res.status(500).send(error)
    }
});

router.post('/login', async(req, res) =>{
    try {
        
    } catch (error) {
        res.status(500).send(error)
    }
});

router.post('/logout', async(req, res) =>{
    try {
        
    } catch (error) {
        res.status(500).send(error)
    }
});

router.get('/', async(req, res) => {
    try {
        
    } catch (error) {
        res.status(500).send(error)
    }
});

router.get('/:id', async(req, res) => {
    try {
        
    } catch (error) {
        res.status(500).send(error)
    }
});

export default router;