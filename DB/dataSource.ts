import { DataSource } from "typeorm";
import { Order } from "./entities/Order.entity.js";
import { Product } from "./entities/Product.entity.js";
import { ShoppingCart } from "./entities/ShoppingCart.entity.js";
import { User } from "./entities/User.entity.js";
import { Category } from "./entities/Category.entity.js";
import { ProductCart } from "./entities/ProductCart.entity.js"
import "dotenv/config";
import { Role } from "./entities/Role.entity.js";
import { Permission } from "./entities/Permission.entity.js";
import { OrderItem } from "./entities/orderItem.entity.js";
import {Sale} from "./entities/Sale.entity.js";

const dataSource = new DataSource({
  type: 'mysql',
  supportBigNumbers: false,
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  username: process.env.DB_USER_NAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  entities: [
    User,
    Product,
    Order,
    ShoppingCart,
    Category,
    ProductCart,
    Role,
    Permission,
    OrderItem,
    Sale
  ],
  migrations: ['./**/migration/*.ts'],
  synchronize: true,
  logging: false
});

export const initDB = async () =>
  await dataSource.initialize().then(() => {
    console.log("Connected to DB :)");
  }).catch(err => {
    console.error('Failed to connect to DB: ' + err);
  });

export default dataSource;