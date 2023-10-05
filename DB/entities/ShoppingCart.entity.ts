import { Entity, JoinColumn, JoinTable, ManyToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { User } from "./User.entity.js";
import { Product } from "./Product.entity.js";

@Entity()
export class ShoppingCart {
    @PrimaryGeneratedColumn()
    id: number;
    
    @ManyToMany(() => Product, (product) => product.shoppingCarts)
    @JoinTable()
    products: Product[];
    
    @OneToOne(() => User)
    @JoinColumn()
    users: User;
}
