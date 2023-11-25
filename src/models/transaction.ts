import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
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

  @Column({ name: "created_at" })
  createdAt?: Date;

  @Column({ name: "updated_at" })
  updatedAt?: Date;

  @ManyToOne(() => User, (user) => user.id)
  @JoinColumn({
    name: "user_id",
    referencedColumnName: "id",
  })
  user?: User;

  @ManyToOne(() => OrderDetail, (order) => order.id)
  @JoinColumn({
    name: "order_detail_id",
    referencedColumnName: "id",
  })
  order?: OrderDetail;
}
