import express from "express";
import { Category } from "../DB/entities/Category.entity.js";
import { getCategoryByName, insertCategory } from "../controllers/category.js";
import { authorize } from "../middlewares/auth/authorize.js";

const router = express.Router();

router.get('/', async (req, res) => {
    const categoryList = await Category.find();

    if (!categoryList) {
        res.status(500).send({ success: false })
    }
    res.status(200).send(categoryList);
});

router.get('/:name', async (req, res) => {
    const name = req.params.name
    const category = await getCategoryByName(name);
    if (!category) {
        res.status(500).send('The category with the given name was not found.')
    }
    res.status(200).send(category);
});

router.post('/categoryName', authorize('POST-category'),(req, res) => {
    const category = req.body
    insertCategory(category).then((data) => {
        res.status(201).send(data)
    }).catch(err => {
        console.error(err);
        res.status(500).send(err);
    });
});

router.delete('/:name', authorize('DELETE-category'), async (req, res) => {
    const name = req.params.name;
    const category = await Category.findOneBy({ name });
    if (category) {
        category.remove();
        res.send('Category Deleted');
    } else {
        res.status(404).send('Category not found!');
    }
});

export default router