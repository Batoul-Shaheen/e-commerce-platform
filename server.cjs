const stripe = require('stripe')('sk_test_51O0JVdJHA59sl0kVPOuEu6qMtN2Jxd3d5tBPC7Nn78n8Yylymx1iaN776ZfDxcpgghGcHG3ksBa7SY1u0wrJF8UJ00qSoCgncI');
const express = require('express');
const app = express();

app.use(express.static('public'));

const YOUR_DOMAIN = 'http://localhost:5000';

app.post("/create-checkout-session", async (req, res) => {
  const session = await stripe.checkout.sessions.create({
    line_items: [
      {
        price: '{{PRICE_ID}}',
        quantity: 1,
      },
    ],
    mode: 'payment',
    success_url: `${YOUR_DOMAIN}/success.html`,
    cancel_url: `${YOUR_DOMAIN}/cancel.html`,
  });

  res.redirect(303, session.url);
});

app.listen(5000, () => console.log('Running on port 5000'));