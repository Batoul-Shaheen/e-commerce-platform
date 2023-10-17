import {
  Entity,
  BaseEntity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  ManyToMany,
  JoinTable,
  ManyToOne,
  JoinColumn,
} from "typeorm";
import { Order } from "./Order.entity.js";
import { ShoppingCart } from "./ShoppingCart.entity.js";
import { Category } from "./Category.entity.js";
<<<<<<< HEAD
// import { OrderItem } from "./OrderItem.entity.js";

=======
import { OrderItem } from "./OrderItem.entity.js";
>>>>>>> 889f90019186f4d83eeeab89bc3158a9395967e5
@Entity()
export class Product extends BaseEntity {
  @PrimaryGeneratedColumn("increment")
  id: number;

  @Column()
  name: string;

  @Column()
  description: string;

  @Column("decimal", { precision: 10, scale: 2 })
  price: number;

  @Column()
  quantity: number;

  @ManyToMany(() => Order, (order) => order.products)
  orders: Order[];

  @ManyToMany(() => ShoppingCart, (cart) => cart.products)
  @JoinTable()
  shoppingCarts: ShoppingCart[];

  @ManyToOne(() => Category, (category) => category.products)
  @JoinColumn()
  category: Category;

  // @OneToMany(() => OrderItem, (orderItem) => orderItem.product)
  // orderItems: OrderItem[];
}
