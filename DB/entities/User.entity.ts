import { Entity, BaseEntity, PrimaryGeneratedColumn, Column, OneToMany, BeforeInsert } from "typeorm";
import { Order } from "./Order.entity.js";
import bcrypt from 'bcrypt';

@Entity()
export class User extends BaseEntity {
    @PrimaryGeneratedColumn('increment')
    id: number;

    @Column({ length: 50, nullable: false })
    username: string;

    @BeforeInsert()
    async hashPassword() {
        if (this.password) {
            this.password = await bcrypt.hash(this.password, 6)
        }
    }

    @Column({ nullable: false })
    password: string;

    @Column({ nullable: false })
    email: string;

    @Column()
    phone: string;

    @Column({
        type: 'enum',
        enum: ['Admin', 'User'],
        default: 'user'
    })
    type: string ;

    @OneToMany(() => Order, (order) => order.user)
    orders: Order[];
  
 }