import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from "typeorm";
import {
  UserPayment,
  Cart,
  ProductReview,
  Address,
  Transaction,
  OrderDetail,
} from "./index";

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  role!: string;

  @Column()
  name?: string;

  @Column()
  password?: string;

  @Column()
  phone?: string;

  @Column()
  email?: string;

  @Column()
  address?: string;

  @Column()
  dob?: Date;

  @Column({ name: "last_login" })
  lastLogin?: Date;

  @CreateDateColumn({ name: "created_at" })
  createdAt?: Date;

  @UpdateDateColumn({ name: "updated_at" })
  updatedAt?: Date;

  @OneToMany(() => UserPayment, (userPayment) => userPayment.user)
  userPayment?: UserPayment[];

  @OneToMany(() => Address, (userAddress) => userAddress.user)
  userAddress?: Address[];

  @OneToMany(() => Cart, (userCart) => userCart.user)
  userCart?: Cart[];

  @OneToMany(() => ProductReview, (productReview) => productReview.user)
  productReview?: ProductReview[];

  @OneToMany(() => Transaction, (userTransaction) => userTransaction.user)
  userTransaction?: Transaction[];

  @OneToMany(() => OrderDetail, (userOder) => userOder.user)
  userOder?: OrderDetail[];
}
