import { Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class ShoppingCart {
    @PrimaryGeneratedColumn()
    id: number;

}
