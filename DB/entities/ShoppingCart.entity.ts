import {
  BaseEntity,
  Entity,
  JoinColumn,
<<<<<<< HEAD
=======
  JoinTable,
  Column,
>>>>>>> 3497d264b47e818740406aeda049072bb959d848
  ManyToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { User } from "./User.entity.js";
import { Product } from "./Product.entity.js";

@Entity()
export class ShoppingCart extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  bill: number;

  @ManyToMany(() => Product, (product) => product.shoppingCarts)
  products: Product[];

  @OneToOne(() => User)
  @JoinColumn()
  users: User;
}
