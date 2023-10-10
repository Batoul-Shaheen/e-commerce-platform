import { Entity, BaseEntity, Column, ManyToOne,PrimaryGeneratedColumn} from "typeorm";
import { Product } from "./Product.entity.js";
import { Order } from "./Order.entity.js";

@Entity()
export class OrderItem extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  quantity: number;

  @ManyToOne(() => Product, (product) => product.orderItems)
  product: Product;

  @ManyToOne(() => Order, order => order.orderItems)
  order: Order;
}
