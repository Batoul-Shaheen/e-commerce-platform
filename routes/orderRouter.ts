import express from "express";
import { Order } from "../DB/entities/Order.entity.js";
import dataSource from "../DB/dataSource.js";
import { getordersById, CreateOrder } from "../controllers/order.js";
import { User } from "../DB/entities/User.entity.js";

const router = express.Router();

// Get All Order
router.get("/", async (req, res) => {
  try {
    const orders = await dataSource.manager.find(Order);
    res.status(200).send(orders);
  } catch (error) {
    res.status(500).send(error);
  }
});

// Get Order dependent on OrderId
router.get("/:id", async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const order = await getordersById(id);
    if (!order) {
      return res.status(404).send("Order not found");
    }
    res.send(order);
  } catch (error) {
    res.status(500).send(error);
  }
});

router.post('/checkout',  async (req, res) => {
    try {
        const orderCount = await Order.findAndCount();

        if(!orderCount) {
            res.status(500).json({success: false})
        } 
        res.send({
            orderCount: orderCount
        });
    } catch (error) {
        res.status(500).send(error)
    }
});
// Create Order
router.post("/", async (req, res) => {
  try {
    const userId = req.body;

    // Check if the user exists
    const user = await User.findOne({ where: { id: userId } });
    if (!user) {
      return res.status(404).send("User not found");
    }
    CreateOrder(req.body).then(() => {
      res.status(201).send();
    });
  } catch (error) {
    res.status(500).send(error);
  }
});

// Delete Order dependent on OrderId
router.delete("/:id", async (req, res) => {
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
});

// Update the status of an order by ID
router.put("/:id", async (req, res) => {
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
    console.error("Error updating order:", error);
    res.status(500).send("Internal Server Error");
  }
});

// router.post("/checkout", async (req, res) => {
//   try {
//   } catch (error) {
//     res.status(500).send(error);
//   }
// });

export default router;
