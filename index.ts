import "./config.js";
import express from "express";
import { initDB } from "./DB/dataSource.js";
import usersRouter from "./routes/userRouter.js";
import orderRouter from "./routes/orderRouter.js";
import categoryRouter from "./routes/categoryRouter.js";
import shoppingCartRouter from "./routes/shoppingCartRouter.js";
import productRouter from './routes/productrouter.js'

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use("/users", usersRouter);
app.use("/category", categoryRouter);
app.use("/category", productRouter);
app.use("/orders", orderRouter);
app.use("/shoppingCart", shoppingCartRouter)

app.get("/health", (req, res) => {
  res.send("Hello, From E-Commerce :)");
});

app.listen(PORT, () => {
  console.log(`APP is listening in port ${PORT}`);
  initDB();
});

export default app;
