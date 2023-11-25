import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  OneToMany,
} from "typeorm";
import { Product } from "./product";


@Entity()
export class ProductCategory {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  code?: string;

  @Column()
  name?: string;

  @CreateDateColumn({
    name: "created_at",
  })
  createdAt?: Date;

  @UpdateDateColumn({
    name: "updated_at",
  })
  updatedAt?: Date;

  @DeleteDateColumn({
    name: "deleted_at",
  })
  deletedAt?: Date | null;

  @OneToMany(() => Product, (product) => product.id)
  product?: Product[];
}
