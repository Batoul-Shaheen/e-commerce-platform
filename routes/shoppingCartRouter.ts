import express from "express";
import { Product } from "../DB/entities/Product.entity.js";
import { ShoppingCart } from "../DB/entities/ShoppingCart.entity.js";
import { ProductCart } from "../DB/entities/ProductCart.entity.js";
import { authorize } from "../middlewares/auth/authorize.js";

const router = express.Router();

router.post("/add-to-cart/product/:productId/cart/:cartId",// authorize('POST-shoppingCart'), 
async (req, res) => {
    try {
      const shoppingCart = await ShoppingCart.findOne({
        relations: ["products"],
        where: { id: parseInt(req.params.cartId) },
      });
      const product = await Product.findOne({
        where: { id: parseInt(req.params.productId) },
      });

      if (!shoppingCart || !product) {
        return res.status(404).send("Shopping cart or product not found");
      }

      let existingProduct = shoppingCart.products.find((p) => p.id === parseInt(req.params.productId));

      if (existingProduct) {
        existingProduct.quantity += 1;
      shoppingCart.bill += (existingProduct.price * existingProduct.quantity);
        console.log(shoppingCart.bill);
        existingProduct.save();
        return res.status(200).send('Product quantity updated and added to the shopping cart');
      } else {
        shoppingCart.products.push(product);
        shoppingCart.bill += (product.price * product.quantity);
        console.log(shoppingCart.bill);
        await shoppingCart.save()
        return res.status(200).send('Product added to the shopping cart');
      }
    } catch (error) {
      console.error(error);
      return res.status(500).send("Internal server error");
    }
  });




router.get("/shopping-cart/:id", //authorize('GET-shoppingCart'), 
async (req, res) => {
    try {
      const shoppingCart = await ShoppingCart.findOne({
        relations: ["products"],
        where: { id: parseInt(req.params.id) },
      });

      if (!shoppingCart) {
        return res.status(404).send("Shopping cart not found");
      }
      res.send({
        product: shoppingCart.products,
        bill: shoppingCart.bill
      });
    } catch (error) {
      console.error(error);
      res.status(500).send("Internal server error");
    }
  });

router.delete("/remove-from-cart/product/:productId/cart/:cartId",// authorize('DELETE-FSC'), 
async (req, res) => {
  try {
    const shoppingCartId = parseInt(req.params.cartId);
    const productId = req.params.productId;

    const shoppingCart = await ShoppingCart.findOne({
      relations: ["products"],
      where: { id: shoppingCartId },
    });

    if (!shoppingCart) {
      return res.status(404).send("Shopping cart not found");
    }

    const productToRemove = shoppingCart.products.find(
      (product) => product.id === +productId
    );

    if (!productToRemove) {
      return res
        .status(404)
        .send({ message: "Product not found in the shopping cart" });
    }

    shoppingCart.products = shoppingCart.products.filter(
      (product) => product.id !== +productId
    );
    await shoppingCart.save();

    res.send("Product removed from shopping cart");
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal server error");
  }
}
);

export default router;