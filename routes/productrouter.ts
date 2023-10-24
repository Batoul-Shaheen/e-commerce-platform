import express from 'express';
import { Product } from '../DB/entities/Product.entity.js';
import { getProductsById, insertProduct } from '../controllers/product.js';
import { Category } from '../DB/entities/Category.entity.js';
import { authorize } from '../middlewares/auth/authorize.js';

const router = express.Router();

router.get('/:categoryName', async (req, res) => {
    try {
        const categoryName = req.body;
        const products = await Product.find(
            categoryName
        );
        res.send(products);
    } catch (error) {
        res.status(500).send("no products")
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

router.post('/:categoryName/:productId',// authorize('POST-PTC'),
async (req, res) => {
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
        product.category = category;

        if (!category || !product) {
            return res.status(404).send("Shopping cart or product not found");
          }
    
          let existingProduct = category.products.find((p) => p.id === parseInt(req.params.productId));
    
          if (existingProduct) {
            existingProduct.quantity += 1;
            existingProduct.save();
            return res.status(200).send('Product quantity updated and added to the category');
          }else{
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
    const newCategoryName = req.body.newCategoryName; // The new category name

    try {
        // Find the product by its ID
        const product = await Product.findOneBy({id: productId});

        if (!product) {
            return res.status(404).send('Product not found');
        }

        // Set the category field to the new category name
        product.category = newCategoryName;

        // Save the updated product
        await product.save();

        res.send('Category updated for the product');
    } catch (error) {
        res.status(500).send(error);
    }
});

// router.delete('/remove-category/:productId', async (req, res) => {
//     const productId = parseInt(req.params.productId);

//     try {
//         // Find the product by its ID
//         const product = await Product.findOneBy({id :productId});

//         if (!product) {
//             return res.status(404).send('Product not found');
//         }
        
//         // Update the category field to remove the reference to the category name
//         category.products = null; // Or, set it to another default category or handle as needed

//         // Save the updated product
//         await product.save();

//         res.send('Category name removed from the product');
//     } catch (error) {
//         res.status(500).send(error);
//     }
// });

// router.delete('/remove-category/:categoryName', async (req, res) => {
//     const categoryName = req.params.categoryName;

//     try {
//         // Find all products with the specified categoryName
//         const productsToUpdate = await Product.find({ category: categoryName });

//         if (productsToUpdate.length === 0) {
//             return res.status(404).send('No products found with this category name');
//         }

//         // Update each product to remove the category name
//         for (const product of productsToUpdate) {
//             product.category = null; // Or, set it to another default category or handle as needed
//             await product.save();
//         }

//         res.send('Category name removed from products');
//     } catch (error) {
//         res.status(500).send(error);
//     }
// });

// router.delete('/:categoryName' ,// authorize('DELETE-FC'), 
// async (req, res) => {
//     try {
//         const categoryName = req.params.categoryName;
//         const productId = req.body.productId;
//         const category = await Category.findOneBy({name :categoryName});

//         if (!category) {
//             return res.status(404).send('Category not found');
//         }
//         const product = await Product.findOneBy({ id: productId} );

//         if (!product) {
//             return res.status(404).send('Product not found');
//         }

//         const productIndex = category.products.findIndex((item) => item.toString() === productId);

//         if (productIndex === -1) {
//             return res.status(404).send('Product is not in the Category');
//         }

//         category.products.splice(productIndex, 1);
//         await category.save();
//         res.send('Product removed from the Category');
//     } catch (error) {
//         res.status(500).send("something went wrong");
//     }
// });

export default router;