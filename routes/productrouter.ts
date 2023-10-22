import express from 'express';
import { Product } from '../DB/entities/Product.entity.js';
import { getProductsById, insertProduct} from '../controllers/product.js';
import { Category } from '../DB/entities/Category.entity.js';
import { ShoppingCart } from '../DB/entities/ShoppingCart.entity.js';
import { isAdmin } from '../middlewares/auth/authorize.js';

const router = express.Router();

// router.get('/:categoryName', async (req, res) => {
//     try {
//         const categoryName = req.body;
//         const products = await Product.find(
//             categoryName
//         );
//         res.send(products);
//     } catch (error) {
//         res.status(500).send(error)
//     }
// });

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

router.post('/:categoryName',// isAdmin, 
async (req, res) => {
    try {
        const product = req.body;
        const categoryName = product.categoryName;
        if (!categoryName) {
            return res.status(400).send('Category Name is missing');
        }
        const category = await Category.findOneBy({name: categoryName});
        if (!category) {
            return res.status(400).send('Category Not Found');
        }
        await insertProduct({
            ...product,
        });
        res.status(201).send('Product inserted successfully');
    } catch (error) {
        res.status(500).send(error)
    }
});



router.delete('/:categoryName', isAdmin, async (req, res) => {
    try {
        const categoryName = req.body.categoryName;
        const productId = req.body.productId;
        const category = await Category.findOneBy(categoryName);

        if (!category) {
            return res.status(404).send('Category not found');
        }
        const product = await Product.findOneBy(productId);

        if (!product) {
            return res.status(404).send('Product not found');
        }

        const productIndex = category.products.findIndex((item) => item.id === productId);

        if (productIndex === -1) {
            return res.status(404).send('Product is not in the Category');
        }

        category.products.splice(productIndex, 1);
        await category.save();
        res.send('Product removed from the Category');
    } catch (error) {
        res.status(500).send(error);
    }
});



export default router;