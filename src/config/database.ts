// file ./config/database.ts
import { ConnectionOptions } from "typeorm";
import { ProductCategory } from "../models";

const dbConfig: ConnectionOptions = {
  type: "mysql",
  host: "localhost", //npm run dev thi localhost, docker thì db
  port: 3306,
  username: "test",
  password: "test",
  database: "test",
  entities: [ProductCategory],
  synchronize: true,
};

export default dbConfig;
