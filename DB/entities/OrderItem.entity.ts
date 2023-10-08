import { Entity, BaseEntity, Column, ManyToOne } from "typeorm";
import { Product } from "./Product.entity.js";

@Entity()
export class OrderItem extends BaseEntity {
  @Column()
  quantity: number;

  @ManyToOne(() => Product, (product) => product.orderItems)
  product: Product;
}
