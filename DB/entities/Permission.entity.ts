import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity('permissions')
export class Permission extends BaseEntity {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column({ unique: true })
  name: string;
}