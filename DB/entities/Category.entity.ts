import { Entity, BaseEntity, OneToMany, Column } from "typeorm";
import { Product } from "./Product.entity.js";

@Entity()
export class Category extends BaseEntity {
  @Column()
  name: string;

  @Column()
  icon: string;

  @Column()
  color: string;

  @OneToMany(() => Product, (product) => product.category)
  products: Product[];
}
