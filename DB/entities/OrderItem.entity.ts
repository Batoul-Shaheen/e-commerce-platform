import { Entity, BaseEntity, Column, ManyToOne,PrimaryGeneratedColumn, Relation} from "typeorm";
import { Product } from "./Product.entity.js";
import { Order } from "./Order.entity.js";

@Entity()
export class OrderItem extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  quantity: number;

  @ManyToOne(() => Product, (product) => product.orderItems)
  product: Relation<Product>;

  @ManyToOne(() => Order, order => order.orderItems)
  order: Relation<Order>;
}
