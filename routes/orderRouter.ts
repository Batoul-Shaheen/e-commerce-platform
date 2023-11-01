import express from "express";
import { Order } from "../DB/entities/Order.entity.js";
import { CreateOrder } from "../controllers/order.js";
import { User } from "../DB/entities/User.entity.js";
import { Product } from "../DB/entities/Product.entity.js";
import { authorize } from "../middlewares/auth/authorize.js";
import { OrderItem } from "../DB/entities/orderItem.entity.js";
import { auth } from "../middlewares/auth/authenticate.js";

const router = express.Router();

router.post("/:userId", auth, authorize('POST-order'), async (req, res) => {
  try {
    const { userId } = req.params;
    const userData = await User.findOne({ where: { id: parseInt(userId) } });

    if (!userData) {
      return res.status(404).json({ error: "User not found" });
    }

    const orderData = {
      ...req.body,
      user: userData,
    };

    const newOrder = await CreateOrder(orderData);

    res.status(201).send(newOrder);
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal server error");
  }
});

router.post("/add-to-order/product/:productId/order/:orderId", auth, authorize('POST-productToOrder'), async (req, res) => {
  try {
    const order = await Order.findOne({
      relations: ["orderItem.products", "products"],
      where: { id: parseInt(req.params.orderId) },
    });

    const product = await Product.findOne({
      where: { id: parseInt(req.params.productId) },
    });

    if (!order || !product) {
      return res.status(404).send("Order or product not found");
    }

    if (product.sales) {
      const currentDate = new Date();
      if (currentDate < product.sales.startDate || currentDate > product.sales.endDate) {
        return res.status(400).send("Product sale is not valid.");
      }
    }

    let orderItem = order.orderItem.find(
      (oi) => oi.products.id === parseInt(req.params.productId)
    );

    if (orderItem) {
      orderItem.quantity += 1;
      const productPrice = product.salePrice || product.price;

      order.totalAmount += productPrice;
      orderItem.products = product;
      orderItem.orders = order;

      await orderItem.save();
      await order.save();
      res.status(200).send('Product quantity increased successfully');
    } else {
      orderItem = new OrderItem();
      orderItem.products = product;
      orderItem.quantity = 1;

      const productPrice = product.salePrice || product.price;

      order.totalAmount += productPrice;
      orderItem.orders = order;

      if (!order.orderItem) {
        order.orderItem = [];
      }
      order.orderItem.push(orderItem);
    }

    await orderItem.save();
    await order.save();
    return res.status(200).send("Product added to the order");
  } catch (error) {
    console.error(error);
    return res.status(500).send("Internal server error");
  }
});

router.get("/:id", async (req, res) => {
  try {
    const productOrder = await OrderItem.find({
      where: { orders: { id: parseInt(req.params.id) } },
      relations: ["products"],
    });

    if (!productOrder || productOrder.length === 0) {
      return res.status(404).send("No products found in the order");
    }

    const order = await Order.findOne({
      relations: ["orderItem.products"],
      where: { id: parseInt(req.params.id) },
    });

    const products = productOrder.map((productCart) => ({
      product: productCart.products,
      quantityOrder: productCart.quantity,
    }));

    res.send({
      products,
      totalAmount: order?.totalAmount
    });
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal server error");
  }
});

router.put("/:orderId", auth, authorize('PUT-order'), async (req, res) => {
  const orderId = parseInt(req.params.orderId);
  const { status } = req.body;

  try {
    const order = await Order.findOne({ where: { id: orderId } });
    if (!order) {
      res.status(404).send("Order not found");
    } else {
      order.status = status;
      await Order.save(order);
      res.send(order);
    }
  } catch (error) {
    res.status(500).send("Error updating order:");
  }
});

export default router;