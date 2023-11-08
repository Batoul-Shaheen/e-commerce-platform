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
import { ProductCart } from "./ProductCart.entity.js";
import { OrderItem } from "./orderItem.entity.js";
import {Sale} from './Sale.entity.js';

@Entity()
export class Product extends BaseEntity {
  @PrimaryGeneratedColumn("increment")
  id: number;

  @Column()
  name: string;

  @Column()
  description: string;

  @Column('decimal', { precision: 10, scale: 2 })
  price: number;

  @Column()
  quantity: number;

  @Column('decimal', { precision: 10, scale: 2 })
  salePrice: number;

  @Column({ nullable: false })
  image: string;

  @ManyToMany(() => Order, (order) => order.products)
  orders: Order[];

  @ManyToMany(() => ShoppingCart, (cart) => cart.products)
  @JoinTable()
  shoppingCarts: ShoppingCart[];

  @ManyToOne(() => Category, (category) => category.products)
  @JoinColumn()
  category: Category;

  @OneToMany(() => ProductCart, (productCart) => productCart.product)
  productCarts: ProductCart[];

  @OneToMany(() => OrderItem, (orderItem) => orderItem.products)
  orderItems: OrderItem[];

  @ManyToMany(() => Sale, (sale) => sale.products)
  @JoinTable()
  sales: Sale;
}
