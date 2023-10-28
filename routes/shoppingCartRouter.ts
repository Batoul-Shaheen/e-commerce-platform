import express from "express";
import { Product } from "../DB/entities/Product.entity.js";
import { ShoppingCart } from "../DB/entities/ShoppingCart.entity.js";
import { ProductCart } from "../DB/entities/ProductCart.entity.js";
import { authorize } from "../middlewares/auth/authorize.js";
import { Sale } from "../DB/entities/Sale.entity.js";
import { LessThanOrEqual, MoreThanOrEqual } from "typeorm";

const router = express.Router();

router.post("/add-to-cart/product/:productId/cart/:cartId", async (req, res) => {
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

    const existingProductCart = shoppingCart.productCarts ? shoppingCart.productCarts.find(
      (productCart) => productCart.product.id === parseInt(req.params.productId)
    )
      : undefined;

    if (existingProductCart) {
      existingProductCart.quantity += 1;
      const activeSale = await Sale.findOne({
        where: {
          products: {
            id: product.id,
          },
          startDate: LessThanOrEqual(new Date()),
          endDate: MoreThanOrEqual(new Date()),
        },
      });

      if (activeSale) {
        const saleDiscount = (activeSale.discountPercentage || 0) / 100;
        existingProductCart.product.salePrice = existingProductCart.product.price * (1 - saleDiscount);
      }

      shoppingCart.bill += (existingProductCart.product.salePrice || existingProductCart.product.price) * existingProductCart.quantity;
      await existingProductCart.save();
    } else {
      const newProductCart = new ProductCart();
      newProductCart.product = product;
      newProductCart.quantity = 1;
      const activeSale = await Sale.findOne({
        where: {
          products: {
            id: product.id,
          },
          startDate: LessThanOrEqual(new Date()),
          endDate: MoreThanOrEqual(new Date()),
        },
      });

      if (activeSale) {
        const saleDiscount = (activeSale.discountPercentage || 0) / 100;
        newProductCart.product.salePrice = newProductCart.product.price * (1 - saleDiscount);
      }

      shoppingCart.bill += (newProductCart.product.salePrice || newProductCart.product.price) * newProductCart.quantity;

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

router.get("/shopping-cart/:id", async (req, res) => {
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

router.delete("/remove-from-cart/product/:productId/cart/:cartId", authorize('DELETE-FSC'), async (req, res) => {
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