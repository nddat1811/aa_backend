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

  @Column({ name: "deleted_at" })
  deletedAt?: boolean;

  @ManyToOne(() => ProductCategory, (category) => category.id)
  @JoinColumn({
    name: "category_id",
    referencedColumnName: "id",
  })
  category?: ProductCategory;

  @OneToOne(() => ProductInventory, (inventory) => inventory.id)
  @JoinColumn({
    name: "inventory_id",
    referencedColumnName: "id",
  })
  invertory?: ProductInventory;

  @OneToMany(() => ProductReview, (productReview) => productReview.product)
  productReview?: ProductReview[];

  @OneToMany(() => CartItem, (cartItem) => cartItem.product)
  cartItem?: CartItem[];

  @OneToMany(() => OrderItem, (orderItem) => orderItem.product)
  orderItem?: OrderItem[];
}
