import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from "typeorm";
import { User, OrderDetail } from "./index";

@Entity()
export class Transaction {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  type?: number;

  @Column()
  mode?: number;

  @Column()
  status?: number;

  @Column({ type: "text" })
  content?: string;

  @CreateDateColumn({ name: "created_at" })
  createdAt?: Date;

  @UpdateDateColumn({ name: "updated_at" })
  updatedAt?: Date;

  @ManyToOne(() => User, (user) => user.userTransactions)
  @JoinColumn({
    name: "user_id",
    referencedColumnName: "id",
  })
  user?: User;

  @ManyToOne(() => OrderDetail, (order) => order.userTransactions)
  @JoinColumn({
    name: "order_detail_id",
    referencedColumnName: "id",
  })
  order?: OrderDetail;
}
