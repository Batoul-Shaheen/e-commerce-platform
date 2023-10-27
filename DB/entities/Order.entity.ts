import { Entity, BaseEntity, PrimaryGeneratedColumn, Column, ManyToOne, ManyToMany, JoinTable, OneToMany } from "typeorm";
import { User } from "./User.entity.js";
import { Product } from "./Product.entity.js";
import { OrderItem } from "./orderItem.entity.js";

@Entity()
export class Order extends BaseEntity {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column()
  orderDate: string;

  @Column('decimal', { precision: 10, scale: 2 })
  totalAmount: number;

  @Column({ default: 'Pending' })
  status: "Pending" | "Canceled" | "Done";

  @Column()
  city: string;

  @Column()
  country: string;

  @Column()
  phone: string;

  @ManyToOne(() => User, (user) => user.orders)
  user: User;

  @ManyToMany(() => Product, (product) => product.orders)
  @JoinTable()
  products: Product[];

  @OneToMany(() => OrderItem, (orderItems) => orderItems.orders)
  orderItem: OrderItem[];

}