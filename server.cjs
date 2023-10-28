var express = require("express");
var { Product } = require("./DB/entities/Product.entity");
const stripe = require("stripe")(
  "sk_test_51O0JVdJHA59sl0kVPOuEu6qMtN2Jxd3d5tBPC7Nn78n8Yylymx1iaN776ZfDxcpgghGcHG3ksBa7SY1u0wrJF8UJ00qSoCgncI"
);
var router = express.Router();

router.use(express.static("public"));

const YOUR_DOMAIN = "http://localhost:5000";

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
      mode: "payment",
      success_url: `${YOUR_DOMAIN}/success.html`,
      cancel_url: `${YOUR_DOMAIN}/cancel.html`,
    });

    console.log("session.url", session.url);
    res.redirect(303, session.url);
  } catch (error) {
    console.log("PAYMENT ERROR, DETAILS:", error);
  }
});

router.get("/", function (req, res, next) {
  res.render("index", { title: "Express" });
});

module.exports = router;
