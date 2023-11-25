import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
} from "typeorm";

@Entity({name: "product_discounts"})
export class ProductDiscount {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  name?: string;

  @Column()
  description?: string;

  @Column()
  active?: boolean;

  @Column({ name: "discount_percent" })
  discountPercent?: number;

  @CreateDateColumn({ name: "created_at" })
  createdAt?: Date;

  @UpdateDateColumn({ name: "updated_at" })
  updatedAt?: Date;

  @Column({
    name: "deleted_at",
    type: "boolean", // Use a supported data type (e.g., boolean)
    nullable: true, // Ensure it allows null values if needed
  })
  deletedAt?: boolean | null;
}
