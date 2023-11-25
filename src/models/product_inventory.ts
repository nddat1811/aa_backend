import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from "typeorm";

@Entity()
export class ProductInventory {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  quantity?: number;

  @CreateDateColumn({ name: "created_at" })
  createdAt?: Date;

  @UpdateDateColumn({ name: "updated_at" })
  updatedAt?: Date;

  @Column({ name: "deleted_at" })
  deletedAt?: boolean;
}
