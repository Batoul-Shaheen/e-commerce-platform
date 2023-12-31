import express from 'express';
import { Product } from '../DB/entities/Product.entity.js';
import { getProductsById, insertProduct } from '../controllers/product.js';
import { Category } from '../DB/entities/Category.entity.js';
import { authorize } from '../middlewares/auth/authorize.js';
import { auth } from '../middlewares/auth/authenticate.js';
import multer from 'multer'

const router = express.Router();

const storage = multer.diskStorage({
    destination: (req, file, callback) => {
        callback(null, 'uploads/');
    },
    filename: (req, file, callback) => {
        callback(null, Date.now() + '-' + file.originalname)
    }
});

const upload = multer({ storage });


router.get("/category/:categoryName", async (req, res) => {
    try {
        const category = await Category.find({
            relations: ["products"],
            where: { name: req.params.categoryName }
        });

        if (!category) {
            return res.status(404).send("Category not found");
        }

        const products = category.map((categoryProduct) => ({
            products: categoryProduct.products
        }));

        res.send(products);
    } catch (error) {
        console.error(error);
        res.status(500).send("Internal server error");
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


router.post('/categoryName', auth, authorize('POST-productToCategory'), 
upload.single('image'), async (req, res, next) => {
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

        if (!req.file) {
            return next("No file uploaded for product image.")
        } 
        
        const existingProduct = await Product.findOneBy({ id: product.id });

        if (existingProduct) {
            existingProduct.quantity += product.quantity;

            await existingProduct.save();

            res.status(200).send('Product quantity increased successfully');
        } else {
            product.category = category;
            await insertProduct(product, req.file);

            res.status(201).send('Product inserted successfully');
        }

    } catch (error) {
        res.status(500).send(error)
    }
});

router.put('/update-category/:productId', auth, authorize('PUT-productToCategory'),
 async (req, res) => {
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

router.delete('/category/:categoryName/product/:productId', auth, authorize('DELETE-FromCategory'),
 async (req, res) => {
    try {
        const category = await Category.findOne({
            relations: ["products"],
            where: { name: req.params.categoryName }
        });

        if (!category) {
            return res.status(400).send('Category Not Found');
        }

        const productCartIndex = category.products.findIndex(
            (productCategory) => productCategory.id === parseInt(req.params.productId)
        );

        if (productCartIndex !== -1) {
            const productCategory = category.products[productCartIndex];
            productCategory.quantity -= 1;

            if (productCategory.quantity === 0) {
                category.products.splice(productCartIndex, 1);
            }

            await productCategory.save();
            await category.save();
            return res.status(200).json({
                message: "Category updated successfully & quantity decrease",
                category: category,
            });
        } else {
            return res.status(404).send("Product not found in the category");
        }
    } catch (error) {
        console.error(error);
        return res.status(500).send("Internal server error");
    }
});

export default router;