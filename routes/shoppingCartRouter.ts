import express from "express";
import { Product } from "../DB/entities/Product.entity.js";
import { ShoppingCart } from "../DB/entities/ShoppingCart.entity.js";
import { ProductCart } from "../DB/entities/ProductCart.entity.js";
import { auth } from "../middlewares/auth/authenticate.js";
import { authorize } from "../middlewares/auth/authorize.js";

const router = express.Router();

router.post("/add-to-cart/product/:productId/cart/:cartId", auth, authorize('POST-productToCart'), async (req, res) => {
  try {
    const shoppingCart = await ShoppingCart.findOne({
      relations: ["productCarts.product", "products"],
      where: { id: parseInt(req.params.cartId) },
    });

    const product = await Product.findOne({
      where: { id: parseInt(req.params.productId) },
    });

    if (!shoppingCart || !product) {
      return res.status(404).send("Shopping cart or product not found");
    }

    if (product.sales) {
      const currentDate = new Date();
      if (currentDate < product.sales.startDate || currentDate > product.sales.endDate) {
        return res.status(400).send("Product sale is not valid.");
      }
    }

    const existingProductCart = shoppingCart.productCarts ? shoppingCart.productCarts.find(
      (productCart) => productCart.product.id === parseInt(req.params.productId)
    )
      : undefined;

    if (existingProductCart) {
      existingProductCart.quantity += 1;
      const productPrice = product.salePrice

      shoppingCart.bill += productPrice;

      await existingProductCart.save();
      await shoppingCart.save();
    } else {
      const newProductCart = new ProductCart();
      newProductCart.product = product;
      newProductCart.quantity = 1;

      const productPrice = product.price;

      shoppingCart.bill += (productPrice * newProductCart.quantity);

      if (!shoppingCart.productCarts) {
        shoppingCart.productCarts = [];
      }

      shoppingCart.productCarts.push(newProductCart);
      await newProductCart.save();
      await shoppingCart.save();
    }
    return res.status(200).send("Product added to the shopping cart");
  } catch (error) {
    console.error(error);
    return res.status(500).send("Internal server error");
  }
});

router.get("/:id", auth, authorize('GET-productToCart'), async (req, res) => {
  try {
    const productCarts = await ProductCart.find({
      where: { cart: { id: parseInt(req.params.id) } },
      relations: ["product"],
    });

    if (!productCarts || productCarts.length === 0) {
      return res.status(404).send("No products found in the shopping cart");
    }

    const shoppingCart = await ShoppingCart.findOne({
      relations: ["productCarts.product"],
      where: { id: parseInt(req.params.id) },
    });

    const products = productCarts.map((productCart) => ({
      product: productCart.product,
      quantityInShoppingCart: productCart.quantity,
    }));

    res.send({
      products,
      bill: shoppingCart?.bill
    });
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal server error");
  }
});

router.delete("/:productId/cart/:cartId", auth, authorize('DELETE-productFromCart'), async (req, res) => {
  try {
    const shoppingCart = await ShoppingCart.findOne({
      relations: ["productCarts.product"],
      where: { id: parseInt(req.params.cartId) },
    });

    if (!shoppingCart) {
      return res.status(404).send("Shopping cart not found");
    }

    const productCartIndex = shoppingCart.productCarts.findIndex(
      (productCart) => productCart.product.id === parseInt(req.params.productId)
    );

    if (productCartIndex !== -1) {
      const productCart = shoppingCart.productCarts[productCartIndex];
      productCart.quantity -= 1;
      shoppingCart.bill -= productCart.product.price;

      if (productCart.quantity === 0) {
        shoppingCart.productCarts.splice(productCartIndex, 1);
      }

      await productCart.save();
      await shoppingCart.save();
      return res.status(200).json({
        message: "Cart updated successfully",
        cart: shoppingCart,
      });
    } else {
      return res.status(404).send("Product not found in the shopping cart");
    }
  } catch (error) {
    console.error(error);
    return res.status(500).send("Internal server error");
  }
});

export default router;