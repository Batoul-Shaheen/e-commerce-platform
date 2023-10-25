import "../dist/config.js";
import express from "express";
import request from "supertest";
import usersRouter from "../dist/routes/userRouter.js";
import orderRouter from "../dist/routes/orderRouter.js";
import {Order} from "../dist/DB/entities/Order.entity.js";
import {User} from "../dist/DB/entities/User.entity.js";
import { CreateOrder } from "../dist/controllers/order.js";
import { getCategoryByName } from "../dist/controllers/category.js";
import { getProductsById } from "../dist/controllers/product.js";
import dataSource from "../dist/DB/dataSource.js";
import dotenv from "dotenv";

dotenv.config();
const app = express();
app.use(express.json());
app.use("/orders", orderRouter)
app.use("/users", usersRouter);
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
      email: "raghad@gmail.com",
      password: "123456",
    };

    const response = await request(app).post("/users/login").send(user);
    expect(response.status).toBe(200);
  });

  it("should return 404 for invalid credentials", async () => {
    const userData = {
      email: 'hala@gmail.com',
      password: '123456', 
    };

    jest.spyOn(User, 'findOneBy').mockResolvedValue(null);

    const response = await request(app)
      .post('/login')
      .send(userData);

    expect(response.status).toBe(404);
    expect(response.body.message).toBe(undefined);
  });

  it("should handle errors gracefully", async () => {
    jest.spyOn(User, 'findOneBy').mockRejectedValue(new Error('Database error'));

    const response = await request(app)
      .post('/login')
      .send({
        email: "raghad@gmail.com",
        password: "123456",
      });

    expect(response.status).toBe(404);
    expect(response.body.message).toBe(undefined);
  });
});

///////////////////////////////////////////////////////////////////////////////////////////////////////////////

describe("Logout process", () => {
  it("should logout with valid credentials", async () => {
    const user = {
      username: "raghad"
    };

    const response = await request(app).get("/users/logout").send(user);
    expect(response.status).toBe(200);
  });
});

/////////////////////////////////////////////////////////////////////////////////////////////////////////////

const categoryData = {
  name: 'skin',
}

describe("get category by name", () => {
  let category;
  beforeAll(async () => {
    category = await getCategoryByName(categoryData.name);
  })
  
  it("returns a category", async () => {
    expect(category).toBeTruthy();
  });
});

///////////////////////////////////////////////////////////////////////////////////////////////////////////

const productData = {
  id: 1 ,
}

describe("get product by id", () => {
  let product;
  beforeAll(async () => {
    product = await getProductsById(productData.id);
  })
  
  it("returns a product", async () => {
    expect(product).toBeTruthy();
  });
});

//////////////////////////////////////////////////////////////////////////////////////////////////////////////

const orderData = {
  "orderDate": "19-10-2023",
  "status": "Pending" ,
  "city": "Hebron",
  "country": "Palestine",
  "phone": "0569999997"
};

describe("create order", () => {
  let order;
  beforeAll(async () => {
    order = await CreateOrder(orderData.orderDate, orderData.city, orderData.country, orderData.phone);
  })

  it("returns a order", async () => {
    expect(order).toBeTruthy();
  });
});

describe("Edit Order Status", () => {
  let orderId;

  beforeAll(async () => {
    const newOrder = new Order({ status: 'Pending' }); 
    await newOrder.save();
    orderId = newOrder.id;
  });

  it("should update the order status", async () => {
    const newStatus = 'Done'; 

    const response = await request(app)
      .put(`/orders/${orderId}`)
      .send({ status: newStatus });

    expect(response.status).toBe(200);
    expect(response.body.status).toEqual(newStatus);

    const updatedOrder = await Order.findOne({ where: { id: orderId } });
    expect(updatedOrder.status).toBe(newStatus);
  });
  
    it("should return 404 for non-existent order", async () => {
      const response = await request(app)
        .put('/orders/9999') 
        .send({ status: 'pending' });
  
      expect(response.status).toBe(404);
      expect(response.text).toBe("Order not found");
    });

    it("should handle errors gracefully", async () => {
      jest.spyOn(Order, 'findOne').mockRejectedValue(new Error('Database error'));
    
      const response = await request(app)
        .put(`/orders/${orderId}`)
        .send({ status: 'pending' });
    
      expect(response.status).toBe(500);
      expect(response.text).toBe("Error updating order:");
    });
});
