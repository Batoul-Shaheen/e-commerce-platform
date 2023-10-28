import { Entity, BaseEntity, PrimaryGeneratedColumn, Column, ManyToMany, JoinTable } from "typeorm";
import { Product } from "./Product.entity.js";

@Entity()
export class Sale extends BaseEntity {
  @PrimaryGeneratedColumn("increment")
  id: number;

  @Column()
  name: string;

  @Column()
  startDate: Date;

  @Column()
  endDate: Date;

  @Column('decimal', { precision: 5, scale: 2 })
  discountPercentage: number;

  @ManyToMany(() => Product, (product) => product.sales)
  products: Product[];
}
