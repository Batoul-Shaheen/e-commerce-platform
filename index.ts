import "./config.js";
import express from "express";
import { initDB } from "./DB/dataSource.js";
import usersRouter from "./routes/userRouter.js";
import orderRouter from "./routes/orderRouter.js";
import productRouter from "./routes/productrouter.js";
import categoryRouert from "./routes/catagoryRouter.js";
import shoppingCartRouter from "./routes/shoppingCartRouter.js"

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());
app.use("/users", usersRouter);
app.use("/product", productRouter);
app.use("/category", categoryRouert);
app.use("/orders", orderRouter);
app.use("shoppingCart", shoppingCartRouter)

app.get("/health", (req, res) => {
  res.send("Hello, From E-Commerce :)");
});

app.listen(PORT, () => {
  console.log(`APP is listining in port ${PORT}`);
  initDB();
});

export default app;
