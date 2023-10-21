import "./config.js";
import express from "express";
import { initDB } from "./DB/dataSource.js";
import usersRouter from "./routes/userRouter.js";
import orderRouter from "./routes/orderRouter.js";
import categoryRouter from "./routes/categoryRouter.js";
import shoppingCartRouter from "./routes/shoppingCartRouter.js";
import productRouter from './routes/productRouter.js'
import cookieParser from 'cookie-parser';
 import router from "./review.js";

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cookieParser());

app.use(express.json());
app.use("/users", usersRouter);
app.use("/category", categoryRouter);
app.use("/category", productRouter);
app.use("/orders", orderRouter);
app.use("/shoppingCart", shoppingCartRouter);
app.use("/review", router)



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
