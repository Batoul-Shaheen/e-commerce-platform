import { Entity, BaseEntity, PrimaryGeneratedColumn, Column, ManyToOne, Relation } from "typeorm";
import { Product } from "./Product.entity.js";
import { ShoppingCart } from "./ShoppingCart.entity.js";

@Entity()
export class ProductCart extends BaseEntity {
  @PrimaryGeneratedColumn("increment")
  id: number;

  @Column()
  quantity: number;

  @ManyToOne(() => Product, (product) => product.productCarts)
  product: Relation<Product>;

  @ManyToOne(() => ShoppingCart, (cart) => cart.productCarts)
  cart: Relation<ShoppingCart>;

}