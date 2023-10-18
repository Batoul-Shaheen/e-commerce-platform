import express from "express";
import { Product } from "../DB/entities/Product.entity.js";
import { User } from "../DB/entities/User.entity.js";
import { ShoppingCart } from "../DB/entities/ShoppingCart.entity.js";
import { isUser } from "../middlewares/auth/authorize.js";
import { insertProduct } from "../controllers/poduct.js";

const router = express.Router();

// Get Shopping Cart depended on Id 
router.get("/:id", isUser, async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const products = await Product.find({
      where: { id },
    });
    res.send(products);
  } catch (error) {
    res.status(500).send(error);
  }
});

// Create a new shopping cart for a user
router.post("/carts", async (req, res) => {
  try {
    const { userId, productIds } = req.body;

    const user = await User.findOne(userId);
    if (!user) {
      return res.status(404).send("User not found");
    }

    const products = await Product.find(productIds);

    const cart = new ShoppingCart();
    cart.products = products;
    cart.users = user;

    // Calculate the total bill
    cart.bill = products.reduce((total, product) => total + product.price, 0);

    await cart.save();

    return res.status(201).send(cart);
  } catch (error) {
    console.error(error);
    return res.status(500).send("Shopping Cart not Created");
  }
});

// router.post('/', isAdmin, async (req, res) => {
//     try {
//         const product = req.body;
//         const cartId = req.body.shoppingCartId;
//         if (!cartId) {
//             return res.status(400).send('shoppingCart is missing');
//         }
//         const cart = await ShoppingCart.find(cartId);
//         if (!cart) {
//             return res.status(400).send('shoppingCart Not Found');
//         }

//         await insertProduct({
//             ...product,
//             cart
//         });
//         res.status(201).send('Product inserted successfully');
//     } catch (error) {
//         res.status(500).send(error)
//     }
// });

// router.post('/', async (req, res) => {
//     try {
//       const  cartId  = req.body;
//       const productData = req.body;
  
//       // Fetch the shopping cart by its ID
//       const shoppingCart = await ShoppingCart.findBy(cartId);
  
//       if (!shoppingCart) {
//         return res.status(404).json({ message: 'Shopping Cart not found' });
//       }
  
//       // Create a new Product entity using the insertProduct function
//       const products = await insertProduct({
//         ...productData,
//       });
  
//       // Add the product to the shopping cart
//       shoppingCart.product.push(productData);
  
//       // Calculate the new bill amount based on the added product
//       shoppingCart.bill += productData.price;
  
//       // Save the changes to the database
//       await shoppingCart.save();
  
//       res.status(201).json({ message: 'Product added to shopping cart successfully' });
//     } catch (error) {
//       res.status(500).json({ error: 'Internal server error' });
//     }
//   });

router.post("/carts", async (req, res) => {
    try {
      const { userId, productIds } = req.body;
  
      const user = await User.findOneBy(userId);
      if (!user) {
        return res.status(404).send("User not found");
      }
  
      const products = await Product.find(productIds);
  
      const cart = new ShoppingCart();
      cart.products = products;
      cart.users = user;
  
      // Calculate the total bill
      cart.bill = products.reduce((total, product) => total + product.price, 0);
  
      await cart.save();
  
      return res.status(201).send(cart);
    } catch (error) {
      console.error(error);
      return res.status(500).send("Shopping Cart not Created");
    }
  });

  
export default router;
