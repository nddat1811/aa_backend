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
@Entity({name: "users"})
export class User {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  role!: string;

  @Column()
  name?: string;

  @Column()
  password?: string;

  @Column({
    name: "phone",
  })
  phone?: string;

  @Column()
  email?: string;

  @Column({
    name: "dob",
  })
  dob?: Date;

  @CreateDateColumn({ name: "last_login"})
  lastLogin?: Date;

  @CreateDateColumn({ name: "created_at" })
  createdAt?: Date;

  @UpdateDateColumn({ name: "updated_at" })
  updatedAt?: Date;

  @OneToMany(() => UserPayment, (userPayments) => userPayments.user)
  userPayments?: UserPayment[];

  @OneToMany(() => Address, (userAddresses) => userAddresses.user)
  userAddresses?: Address[];

  @OneToMany(() => Cart, (userCarts) => userCarts.user)
  userCarts?: Cart[];

  @OneToMany(() => ProductReview, (productReviews) => productReviews.user)
  productReviews?: ProductReview[];

  @OneToMany(() => Transaction, (userTransactions) => userTransactions.user)
  userTransactions?: Transaction[];

  @OneToMany(() => OrderDetail, (userOders) => userOders.user)
  userOders?: OrderDetail[];
}