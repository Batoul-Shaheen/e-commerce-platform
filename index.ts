import "./config.js";
import express from "express";
import { initDB } from "./DB/dataSource.js";
import usersRouter from "./routes/userRouter.js";
import orderRouter from "./routes/orderRouter.js";
import categoryRouter from "./routes/categoryRouter.js";
import shoppingCartRouter from "./routes/shoppingCartRouter.js";
<<<<<<< HEAD
import productRouter from './routes/productrouter.js';
=======
import productRouter from './routes/productRouter.js'
import router from "./review.js";
>>>>>>> 682417f40580da4e6224eb726404de3e8106e331

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());

app.use("/users", usersRouter);
app.use("/category", categoryRouter);
app.use("/category", productRouter);
app.use("/orders", orderRouter);
app.use("/shoppingCart", shoppingCartRouter);
app.use(router);



app.get("/health", (req, res) => {
  res.send("Hello, From E-Commerce :)");
});

app.listen(PORT, () => {
  console.log(`APP is listening in port ${PORT}`);
  initDB();
});

export default app;
