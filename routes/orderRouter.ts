import express from "express";
import { Order } from "../DB/entities/Order.entity.js";
import dataSource from "../DB/dataSource.js";
import { getordersById, CreateOrder } from "../controllers/order.js";
import { User } from "../DB/entities/User.entity.js";
import { Product } from "../DB/entities/Product.entity.js";
import { auth } from "../middlewares/auth/authenticate.js";
import { isAdmin, isUser } from "../middlewares/auth/authorize.js";

const router = express.Router();

router.post("/orders", async (req, res) => {
  try {
    const { userId, productIds, city, country, phone } = req.body;

    // Find the user
    const user = await User.findOne(userId);
    if (!user) {
      return res.status(404).send("User not found");
    }

    // Find the selected products
    const products = await Product.find(productIds);
    if (products.length !== productIds.length) {
      return res.status(400).send("Some products not found");
    }

    // Calculate the total amount based on product prices
    const totalAmount = products.reduce(
      (total, product) => total + product.price,
      0
    );

    // Create a new order
    const order = new Order();
    order.orderDate = new Date();
    order.totalAmount = totalAmount;
    order.status = "Pending";
    order.city = city;
    order.country = country;
    order.phone = phone;
    order.user = user;
    order.products = products;

    await Order.save(order);

    return res.status(201).send(order);
  } catch (error) {
    return res.status(500).send(error);
  }
});

// // Create Order
// router.post("/", async (req, res) => {
//   try {
//     const userId = req.body;
//     // Check if the user exists
//     const user = await User.findOne({ where: { id: userId } });
//     if (!user) {
//       return res.status(404).send("User not found");
//     }
//     CreateOrder(req.body).then((data) => {
//       res.status(201).send(data);
//     });
//   } catch (error) {
//     res.status(500).send(error);
//   }
// });

// Get All Order
router.get(
  "/", //isAdmin,
  async (req, res) => {
    try {
      const orders = await dataSource.manager.find(Order);
      res.status(200).send(orders);
    } catch (error) {
      res.status(500).send(error);
    }
  }
);

// Get Order dependent on OrderId
router.get(
  "/:id", //isUser,
  async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const order = await getordersById(id);
      if (!order) {
        return res.status(404).send("Order not found");
      }
      res.status(200).send(order);
    } catch (error) {
      res.status(500).send(error);
    }
  }
);

//GET USER ORDERS
router.get("/find/:userId", async (req, res) => {
  try {
    const userId = parseInt(req.params.userId);
    const orders = await Order.findOne({ where: { id: userId } });
    if (orders) {
      // If the order is found.
      res.status(200).send(orders);
    } else {
      // If no order is found.
      res.status(404).send("Order not found");
    }
  } catch (err) {
    res.status(500).send(err);
  }
});

// Delete Order dependent on OrderId
router.delete(
  "/:id", //isUser,
  async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const order = await Order.findOneBy({ id });
      if (order) {
        await order.remove();
        res.send("Order deleted");
      } else {
        res.status(404).send("Order not found !");
      }
    } catch (error) {
      res.status(500).send(error);
    }
  }
);

// Update the status of an order by ID
router.put(
  "/:id", //isUser,
  async (req, res) => {
    const id = parseInt(req.params.id);
    const { status } = req.body;

    try {
      const order = await Order.findOneBy({ id });
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

