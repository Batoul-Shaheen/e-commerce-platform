import { Entity,BaseEntity, PrimaryGeneratedColumn,Column} from "typeorm";

@Entity()
export class Order extends BaseEntity {
@PrimaryGeneratedColumn('increment')
  id: number;

  @Column()
  orderDate: Date;

  @Column('decimal', { precision: 10, scale: 2 })
  totalAmount: number;

  @Column()
  status: string;
}