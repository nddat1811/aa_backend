import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  JoinColumn,
  ManyToOne,
  OneToMany,
} from "typeorm";
import { User, Transaction, OrderItem } from "./index";

@Entity()
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

  @ManyToOne(() => User, (user) => user.id)
  @JoinColumn({
    name: "user_id",
    referencedColumnName: "id",
  })
  user?: User;

  @ManyToOne(() => OrderItem, (order) => order.id)
  @JoinColumn({
    name: "order_id",
    referencedColumnName: "id",
  })
  order?: OrderItem;

  @OneToMany(() => Transaction, (userTransaction) => userTransaction.order)
  userTransaction?: Transaction[];
}
