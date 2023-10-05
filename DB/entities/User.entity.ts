import { Entity, BaseEntity, PrimaryGeneratedColumn, Column, OneToOne, ManyToMany } from "typeorm";
import { Order } from "./Order.entity.js";
import { ShoppingCart } from "./ShoppingCart.entity.js";

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

    @ManyToMany(() => Order, (order) => order.user)
    orders: Order[];

//     @OneToOne(() => ShoppingCart)
//     shoppingCart: ShoppingCart;
 }