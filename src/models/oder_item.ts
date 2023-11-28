import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
  OneToMany,
} from "typeorm";
import { Product, OrderDetail } from "./index";

@Entity({name: "order_items"})
export class OrderItem {
  @PrimaryGeneratedColumn()
  id!: number;

  @CreateDateColumn({ name: "created_at" })
  createdAt?: Date;

  @UpdateDateColumn({ name: "updated_at" })
  updatedAt?: Date;

  @ManyToOne(() => Product, (product) => product.orderItems)
  @JoinColumn({
    name: "product_id",
    referencedColumnName: "id",
  })
  product?: Product;

  @OneToMany(() => OrderDetail, (orderDetails) => orderDetails.order)
  orderDetails?: OrderDetail[];
}
