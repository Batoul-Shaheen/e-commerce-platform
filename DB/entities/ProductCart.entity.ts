import { Entity, BaseEntity, PrimaryGeneratedColumn, Column, ManyToOne } from "typeorm";
import { Product } from "./Product.entity.js";
import { ShoppingCart } from "./ShoppingCart.entity.js";

@Entity()
export class ProductCart extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  quantity: number;

  @ManyToOne(() => Product, (product) => product.productCarts)
  product: Product;

  @ManyToOne(() => ShoppingCart, (cart) => cart.productCarts)
  cart: ShoppingCart;
}