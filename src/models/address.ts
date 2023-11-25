import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from "typeorm";
import { User } from "./index";

@Entity()
export class Address {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  street?: string;

  @Column()
  city?: string;

  @Column({ name: "postal_code" })
  postalCode?: string;

  @Column({ name: "is_default" })
  isDefault?: boolean;

  @ManyToOne(() => User, (user) => user.userAddresses)
  @JoinColumn({
    name: "user_id",
    referencedColumnName: "id",
  })
  user?: User;
}
