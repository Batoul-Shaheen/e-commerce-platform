import { Entity,BaseEntity, PrimaryGeneratedColumn,Column} from "typeorm";

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
}