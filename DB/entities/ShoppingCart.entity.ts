import {
  BaseEntity,
  Entity,
  JoinColumn,
<<<<<<< HEAD
=======
  JoinTable,
>>>>>>> 682417f40580da4e6224eb726404de3e8106e331
  Column,
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
