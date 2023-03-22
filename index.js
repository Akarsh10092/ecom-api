const express = require("express");
const app = express();
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const userRouter = require("./routes/user");
const authRouter = require("./routes/auth");
const productRouter = require("./routes/product");
const cartRouter = require("./routes/cart");
const orderRouter = require("./routes/order");
const stripeRouter = require("./routes/stripe");
const cors = require("cors");
dotenv.config();
const MONGO_URL = process.env.MONGO_URL;
mongoose
  .connect(MONGO_URL)
  .then(() => {
    console.log("Connected Successfully");
  })
  .catch((error) => {
    console.log(error);
  });
app.use(cors());
app.use(express.json());
app.get("/api/test", (req, res) => {
  res.send("<h1>Working</h1>");
});

app.use("/api/users", userRouter);
app.use("/api/auth", authRouter);
app.use("/api/products", productRouter);
app.use("/api/carts", cartRouter);
app.use("/api/orders", orderRouter);
app.use("/api/checkout", stripeRouter);
app.listen(process.env.PORT || 5000, () => {
  console.log(`Server is running on ${5000}`);
});
