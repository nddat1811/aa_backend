import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  JoinColumn,
  ManyToOne,
  OneToMany,
} from "typeorm";
import { User, Transaction, OrderItem } from "./index";

@Entity({name: "order_details"})
export class OrderDetail {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  total?: number;

  @Column({ name: "created_at" })
  createdAt?: Date;

  @Column({ name: "updated_at" })
  updatedAt?: Date;

  @Column({ name: "session_id" })
  sessionId!: number;

  @ManyToOne(() => User, (user) => user.userOders)
  @JoinColumn({
    name: "user_id",
    referencedColumnName: "id",
  })
  user?: User;

  @ManyToOne(() => OrderItem, (order) => order.orderDetails)
  @JoinColumn({
    name: "order_id",
    referencedColumnName: "id",
  })
  order?: OrderItem;

  @OneToMany(() => Transaction, (userTransactions) => userTransactions.order)
  userTransactions?: Transaction[];
}
