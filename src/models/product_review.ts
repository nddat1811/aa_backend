import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  ManyToOne,
  JoinColumn,
  OneToOne,
} from "typeorm";
import { Product, User } from "./index";

@Entity()
export class ProductReview {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ length: 255 })
  content?: string;

  @Column()
  like?: number;

  @CreateDateColumn({ name: "created_at" })
  createdAt?: Date;

  @UpdateDateColumn({ name: "updated_at" })
  updatedAt?: Date;

  @Column({ name: "deleted_at" })
  deletedAt?: boolean;

  @ManyToOne(() => Product, (product) => product.id)
  @JoinColumn({
    name: "product_id",
    referencedColumnName: "id",
  })
  product?: Product;

  @OneToOne(() => ProductReview)
  @JoinColumn({ name: "parent_review_id", referencedColumnName: "id" })
  parentReview?: ProductReview;

  @ManyToOne(() => User, (user) => user.id)
  @JoinColumn({
    name: "user_id",
    referencedColumnName: "id",
  })
  user?: User;
}
