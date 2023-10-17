import express from "express";
import { getordersById } from "../controllers/order.js";
import { insertOrderItem } from "../controllers/orderItem.js";
import { isUser } from "../middlewares/auth/authorize.js";

const router = express.Router();

// Crete OrderItem 
router.post("/", isUser, async (req, res, next) => {
  insertOrderItem(req.body)
    .then((data) => {
      res.status(201).send(data);
    })
    .catch((err) => {
      next(err);
    });
});

router.get("/calculateTotal/:orderId", isUser, async (req, res) => {
  try {
    const orderId = parseInt(req.params.orderId);
    // Find the order by its ID and include its associated order items
    const order = await getordersById(orderId);

    if (!order) {
      return res.status(404).send("Order not found");
    }

    // Calculate the totalAmount by summing up the prices of order items
    const totalAmount = order.orderItems.reduce((total, orderItem) => {
      return total + orderItem.product.price * orderItem.quantity;
    }, 0);

    // Update the order's totalAmount property
    order.totalAmount = totalAmount;
    await order.save();

    return res.send({ totalAmount });
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal server error");
  }
});


export default router;
