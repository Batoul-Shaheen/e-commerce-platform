import {
    BaseEntity,
    Column,
    Entity,
    PrimaryGeneratedColumn,
    OneToMany,
    JoinTable,
    ManyToMany
  }
    from "typeorm";
  
  import { Permission } from "./Permission.entity.js";
  import { User } from "./User.entity.js"
  
  @Entity('roles')
  export class Role extends BaseEntity {
    @PrimaryGeneratedColumn('increment')
    id: number;
  
    @Column({ unique: true })
    name: string;
  
    @ManyToMany(() => Permission, { cascade: true, eager: true })
    @JoinTable()
    permissions: Permission[];
  
    @OneToMany(() => User, user => user.role)
    users: User[];
  }