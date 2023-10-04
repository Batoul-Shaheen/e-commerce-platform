import { Entity,BaseEntity, PrimaryGeneratedColumn,Column} from "typeorm";

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
}