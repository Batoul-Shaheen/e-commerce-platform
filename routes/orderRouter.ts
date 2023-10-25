import express from "express";
import { Order } from "../DB/entities/Order.entity.js";
import { CreateOrder } from "../controllers/order.js";
import { User } from "../DB/entities/User.entity.js";
import { Product } from "../DB/entities/Product.entity.js";
import { authorize } from "../middlewares/auth/authorize.js";
import { OrderItem } from "../DB/entities/orderItem.entity.js";

const router = express.Router();

router.post("/:userId", authorize('POST-order'), async (req, res) => {
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

router.post("/add-to-order/product/:productId/order/:orderId", authorize('POST-PTO'), async (req, res) => {
  try {
    const order = await Order.findOne({
      relations: ["orderItems.product","products"],
      where: { id: parseInt(req.params.orderId) },
    });
    const product = await Product.findOne({
      where: { id: parseInt(req.params.productId) },
    });

    if (!order || !product) {
      return res.status(404).send("Order or product not found");
    }

    const existingProductCart = order.orderItems? order.orderItems.find(
      (orderItems) => orderItems.product.id === parseInt(req.params.productId)
    )
    :undefined;

    if (existingProductCart) {
      existingProductCart.quantity += 1;
      order.totalAmount += (existingProductCart.product.price * existingProductCart.quantity);
      await existingProductCart.save();
    } else {
      const newProductCart = new OrderItem();
      newProductCart.product = product;
      newProductCart.quantity = 1;
      order.totalAmount += (newProductCart.product.price * newProductCart.quantity);

      if (!order.orderItems) {
        order.orderItems = [];
      }

    order.orderItems.push(newProductCart);
    await newProductCart.save();
    await order.save();
  }

    return res.status(200).send("Product added to the order");
  } catch (error) {
    console.error(error);
    return res.status(500).send("Internal server error");
  }
});


router.get("/:userId/:orderId", authorize('GET-order'), async (req, res) => {
  try {
    const userId = req.params.userId;
    const orderId = parseInt(req.params.orderId)

    const user = await User.find({ where: { id: parseInt(userId) } });

    if (!user) {
      return res.status(404).send("User not found");
    }

    const orders = await Order.find({
      where: { id: parseInt(userId) },
    });

    const order = await Order.findOne({ relations: ['products'], where: { id: orderId } });
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    const productDetails = order.products.map((product) => {
      return {
        id: product.id,
        name: product.name,
        description: product.description,
        price: product.price,
        quantity: product.quantity,
      };
    });

    res.status(200).send({
      user: user,
      orders: orders,
      Product: productDetails,
    });
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal server error");
  }
});

router.put("/:orderId", authorize('PUT-order'), async (req, res) => {
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
}
);

export default router;

