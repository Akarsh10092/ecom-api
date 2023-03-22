const router = require("express").Router();
require("dotenv").config({ path: "./.env" });
const stripe = require("stripe")(process.env.KEY);

// router.post("/payment", async (req, res) => {
//   try {
//     const paymentIntent = await stripe.paymentIntents.create({
//       amount: req.body.amount,
//       currency: "usd",
//       shipping: "req.body.shipping",
//     });
//     res.json({ paymentIntent });
//   } catch (error) {
//     res.status(400).json({ error: { message: error.message } });
//   }
// });
router.post("/payment", async (req, res) => {
  const line_items = req.body.cart.products.map((item) => {
    return {
      price_data: {
        currency: "inr",
        product_data: {
          name: item.title,
          images: [item.img],
          description: item.desc,
          metadata: {
            id: item._id,
          },
        },
        unit_amount: item.price * 100,
      },
      quantity: item.quantity,
    };
  });
  const session = await stripe.checkout.sessions.create({
    shipping_address_collection: { allowed_countries: ["US", "IN"] },
    shipping_options: [
      {
        shipping_rate_data: {
          type: "fixed_amount",
          fixed_amount: { amount: 0, currency: "inr" },
          display_name: "Free shipping",
          delivery_estimate: {
            minimum: { unit: "business_day", value: 5 },
            maximum: { unit: "business_day", value: 7 },
          },
        },
      },
    ],
    line_items,
    mode: "payment",
    success_url: "http://localhost:3000/success",
    cancel_url: "http://localhost:3000/cart",
  });

  res.json({ url: session.url });
});

module.exports = router;
