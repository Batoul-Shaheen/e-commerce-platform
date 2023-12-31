import "./config.js";
import express from "express";
import { initDB } from "./DB/dataSource.js";
import usersRouter from "./routes/userRouter.js";
import orderRouter from "./routes/orderRouter.js";
import categoryRouter from "./routes/categoryRouter.js";
import shoppingCartRouter from "./routes/shoppingCartRouter.js";
import productRouter from './routes/productrouter.js';
import saleRouter from "./routes/saleRouter.js";
import cookieParser from 'cookie-parser';
import router from "./review.js";
import cors from "cors";
import stripeRouter from './stripe.js';


const app = express();
const PORT = process.env.PORT || 5000;

app.use(cookieParser());
app.use(express.json());
app.use(cors({ origin: 'http://127.0.0.1:5500', credentials: true }));
app.use("/users", usersRouter);
app.use("/category", categoryRouter);
app.use("/product", productRouter);
app.use("/orders", orderRouter);
app.use("/shoppingCart", shoppingCartRouter);
app.use("/sale", saleRouter);
app.use("/review", router);
app.use("/stripe", stripeRouter)

app.get("/health", (req, res) => {
  res.send("Hello, From E-Commerce :)");
});

app.get("/", (req, res) => {
  res.send("Hello World :)");
});

app.listen(PORT, () => {
  console.log(`APP is listening in port ${PORT}`);
  initDB();
});

export default app;
