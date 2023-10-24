import {
  BaseEntity,
  Entity,
  JoinColumn,
  JoinTable,
  Column,
  ManyToMany,
  OneToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { User } from "./User.entity.js";
import { Product } from "./Product.entity.js";
import { ProductCart } from "./ProductCart.entity.js";

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

  @OneToMany(() => ProductCart, (productCart) => productCart.cart)
  productCarts: ProductCart[];
}
