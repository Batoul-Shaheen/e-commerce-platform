import "../dist/config.js";
import express from "express";
import request from "supertest";
import usersRouter from "../dist/routes/userRouter.js";
import productRouter from "../dist/routes/productRouter.js"
import dataSource from "../dist/DB/dataSource.js";
import dotenv from "dotenv";

dotenv.config();
const app = express();
app.use(express.json());
app.use("/users", usersRouter);
app.use("/product", productRouter)
app.use(express.urlencoded({ extended: false }));


beforeAll(async () => {
  await dataSource.initialize().then(() => {
        console.log('DB connected');
    }).catch(err => {
        console.log("DB connection failed", err);
    });
}, 500000);

afterAll(async () => {
  await dataSource.destroy();
});

describe("Login process", () => {
  it("should login with valid credentials", async () => {
    const user = {
      email: "hala@gmail.com",
      password: "123456",
    };

    const response = await request(app).post("/users/login").send(user);

    expect(response.status).toBe(200);
  });
});

describe("Logout process", () => {
  it("should logout with valid credentials", async () => {
    const user = {
      username: "hala"
    };

    const response = await request(app).get("/users/logout").send(user);

    expect(response.status).toBe(200);
  });
});
