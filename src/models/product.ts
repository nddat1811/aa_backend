import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
  OneToOne,
  OneToMany,
} from "typeorm";
import {
  ProductCategory,
  ProductInventory,
  ProductReview,
  CartItem,
  OrderItem,
} from "./index";

@Entity()
export class Product {
  @PrimaryGeneratedColumn()
  id: number | undefined;

  @Column()
  code?: string;

  @Column()
  name?: string;

  @Column()
  images?: string;

  @Column()
  origin?: string;

  @Column()
  material?: string;

  @Column()
  size?: string;

  @Column()
  warranty?: string;

  @Column()
  description?: string;

  @Column()
  price?: number;

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

  @ManyToOne(() => ProductCategory, (category) => category.products)
  @JoinColumn({
    name: "category_id",
    referencedColumnName: "id",
  })
  category?: ProductCategory;

  @OneToOne(() => ProductInventory)
  @JoinColumn({
    name: "inventory_id",
    referencedColumnName: "id",
  })
  invertory?: ProductInventory;

  @OneToMany(() => ProductReview, (productReviews) => productReviews.product)
  productReviews?: ProductReview[];

  @OneToMany(() => CartItem, (cartItems) => cartItems.product)
  cartItems?: CartItem[];

  @OneToMany(() => OrderItem, (orderItems) => orderItems.product)
  orderItems?: OrderItem[];
}
