import { Entity, BaseEntity, PrimaryGeneratedColumn, Column, OneToMany, BeforeInsert, ManyToOne, JoinColumn } from "typeorm";
import { Order } from "./Order.entity.js";
import bcrypt from 'bcrypt';
import { Role } from "./Role.entity.js";

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
    type: 'Admin' | 'User' ;

    @ManyToOne(() => Role, role => role.users, { cascade: true, eager: true, nullable: true })
    @JoinColumn()
    role: Role;

    @OneToMany(() => Order, (order) => order.user)
    orders: Order[];
  
 }