import { Entity, BaseEntity, PrimaryGeneratedColumn, Column, ManyToMany, JoinTable, ManyToOne } from "typeorm";
import { Order } from "./Order.entity.js";
import { ShoppingCart } from "./ShoppingCart.entity.js";

@Entity()
export class Product extends BaseEntity {
    @PrimaryGeneratedColumn('increment')
    id: number;

    @Column()
    name: string;

    @Column()
    description: string;

    @Column('decimal', { precision: 10, scale: 2 })
    price: number;

    @Column()
    quantity: number;

    @Column()
    category: string ;

    @ManyToMany(() => Order, (order) => order.products)
    orders: Order[];

    @ManyToMany(() => ShoppingCart, (cart) => cart.products)
    @JoinTable()
    shoppingCarts: ShoppingCart[];

}