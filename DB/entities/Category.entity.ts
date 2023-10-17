import { Entity, BaseEntity, OneToMany, Column, PrimaryColumn } from "typeorm";
import { Product } from "./Product.entity.js";

@Entity()
export class Category extends BaseEntity {
  @PrimaryColumn()
  name: string;

  @OneToMany(() => Product, (product) => product.category)
  products: Product[];
}
