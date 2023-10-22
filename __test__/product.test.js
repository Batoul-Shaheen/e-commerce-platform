import "../dist/config.js";
import express from "express";
import request from "supertest";
import productRouter from "../dist/routes/productRouter.js"
import dataSource from "../dist/DB/dataSource.js";
import dotenv from "dotenv";

dotenv.config();
const app = express();
app.use(express.json());
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

describe("insert product to category process", () => {
    it("should insert product to category with valid credentials", async () => {
      const product = {
        product: "serum",
        categoryName: "hair",
        price: "70",
      };
  
      const response = await request(app).post("/product/:categoryName").send(product);
      console.log("flower",response);
  
      expect(response.status).toBe(201);
    });
  })