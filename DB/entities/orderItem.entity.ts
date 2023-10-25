import { Entity, BaseEntity, Column, ManyToOne,PrimaryGeneratedColumn, Relation} from "typeorm";
import { Product } from "./Product.entity.js";
import { Order } from "./Order.entity.js";

@Entity()
export class OrderItem extends BaseEntity {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column()
  quantity: number;

  @ManyToOne(() => Product, (product) => product.orderItems)
  products: Relation<Product>;

  @ManyToOne(() => Order, (order) => order.orderItem)
  orders: Relation<Order>;
}