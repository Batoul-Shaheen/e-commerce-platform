import { Entity, BaseEntity, PrimaryGeneratedColumn, Column, OneToMany, Admin } from "typeorm";
import { Order } from "./Order.entity.js";

@Entity()
export class User extends BaseEntity {
    @PrimaryGeneratedColumn('increment')
    id: number;

    @Column({ length: 50, nullable: false })
    username: string;

    @Column({ nullable: false })
    password: string;

    @Column({ nullable: false })
    email: string;

    @Column()
    phone: string;

    @Column()
    type: string;

    @OneToMany(() => Order, (order) => order.user)
    orders: Order[];
  
 }