import Stripe from 'stripe';
import express from 'express';
import { Product } from './DB/entities/Product.entity.js';
import "dotenv/config";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
  apiVersion: "2023-08-16",
});

const router = express.Router();

router.use(express.static('public'));

const YOUR_DOMAIN = 'http://localhost:5000';

router.post("/create-checkout-session", async (req, res) => {
  try {
    const { productIds, quantities } = req.body;

    const products = await Product.findBy(productIds);

    const line_items = products.map((product, index) => ({
      price: `price_${product.id}`,
      quantity: quantities[index],
    }));

    const session = await stripe.checkout.sessions.create({
      line_items,
      mode: 'payment',
      success_url: `${YOUR_DOMAIN}/success.html`,
      cancel_url: `${YOUR_DOMAIN}/cancel.html`,
    });

    console.log("session.url", session.url)
    res.status(303).send(session.url);

  } catch (error) {
    console.log("PAYMENT ERROR, DETAILS:", error);
  }
});

router.get('/', function (req, res, next) {
  res.render('index', { title: 'Express' });
});

export default router;
