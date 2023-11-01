import Stripe from 'stripe';
import express from 'express';
import "dotenv/config";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
  apiVersion: "2023-08-16",
});

const router = express.Router();

router.post('/create-customer', async (req, res) => {
  try {
    const customer = await stripe.customers.create({
      name: req.body.name,
      email: req.body.email,
      description: req.body.description,
    });

    console.log(customer.id);

    res.json({ customerId: customer.id });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error creating customer' });
  }
});

router.post('/create-product', async (req, res) => {
  try {
    const product = await stripe.products.create({
      name: req.body.name,
      images: req.body.image_url,
    });


    const price = await stripe.prices.create({
      product: product.id,
      unit_amount: req.body.unit_amount,
      currency: 'usd',
      recurring: {
        interval: 'month',
      },
      lookup_key: 'standard_monthly',
      transfer_lookup_key: true,
    });

    const paymentLink = await stripe.paymentLinks.create({
      line_items: [
        {
          price: price.id,
          quantity: 1,
        },
      ],
    });

    res.json({ product: product.id, price: price.id, paymentLink: paymentLink.url });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error creating product' });
  }
});

export default router;
