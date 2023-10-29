import express from 'express';
import { Product } from '../DB/entities/Product.entity.js';
import { getProductsById, insertProduct } from '../controllers/product.js';
import { Category } from '../DB/entities/Category.entity.js';
import { authorize } from '../middlewares/auth/authorize.js';

const router = express.Router();


// router.get('/:categoryName', async (req, res) => {
//     const categoryName = req.params.categoryName;
//     try {
//         const category = await Category.findOne({ where: { name: categoryName } });
    
//         if (!category) {
//           return res.status(404).json({ message: 'Category not found' });
//         }
    
//         const products = await Product.findOneBy({ where: { category } });
    
//         res.status(200).json(products);
//       } catch (error) {
//         console.error(error);
//         res.status(500).json({ error: "Internal Server Error" });
//       }
//     });
    

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


router.post('/:categoryName', authorize('POST-productToCategory'), async (req, res) => {
    try {
        const product = req.body;
        const categoryName = product.categoryName;
        if (!categoryName) {
            return res.status(400).send('Category Name is missing');
        }

        const category = await Category.findOneBy({ name: categoryName });
        if (!category) {
            return res.status(400).send('Category Not Found');
        }

        const existingProduct = await Product.findOneBy({ id: product.id });

        if (existingProduct) {
            existingProduct.quantity += product.quantity;

            await existingProduct.save();

            res.status(200).send('Product quantity increased successfully');
        } else {
            product.category = category;
            await insertProduct({
                ...product,
            });

            res.status(201).send('Product inserted successfully');
        }

    } catch (error) {
        res.status(500).send(error)
    }
});

router.put('/update-category/:productId', async (req, res) => {
    const productId = parseInt(req.params.productId);
    const newCategoryName = req.body.newCategoryName;

    try {
        const product = await Product.findOneBy({ id: productId });

        if (!product) {
            return res.status(404).send('Product not found');
        }

        product.category = newCategoryName;

        await product.save();

        res.send('Category updated for the product');
    } catch (error) {
        res.status(500).send(error);
    }
});


export default router;