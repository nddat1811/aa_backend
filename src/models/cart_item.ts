import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from "typeorm";
import { Product, Cart } from "./index";

@Entity()
export class CartItem {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  quantity?: number;

  @Column()
  price?: number;

  @Column({ name: "created_at" })
  createdAt?: Date;

  @Column({ name: "updated_at" })
  updatedAt?: Date;

  @ManyToOne(() => Product, (product) => product.id)
  @JoinColumn({
    name: "product_id",
    referencedColumnName: "id",
  })
  product?: Product;

  @ManyToOne(() => Cart, (cart) => cart.id)
  @JoinColumn({
    name: "cart_id",
    referencedColumnName: "id",
  })
  cart?: Cart;
}
