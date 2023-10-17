import express from "express";
import { Product } from "../DB/entities/Product.entity.js";
import { User } from "../DB/entities/User.entity.js";
import { ShoppingCart } from "../DB/entities/ShoppingCart.entity.js";
import { isUser } from "../middlewares/auth/authorize.js";

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

export default router;
