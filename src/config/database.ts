import { createConnection, ConnectionOptions } from "typeorm";
import { ProductCategory } from "../models";

export async function connectToDatabase(): Promise<void> {
  const dbConfig: ConnectionOptions = {
    type: "mysql",
    host: "db", //npm run dev thi localhost, docker thì db
    port: 3306,
    username: "test",
    password: "test",
    database: "test",
    entities: [ProductCategory],
    synchronize: true,
  };

  try {
    // Kết nối đến cơ sở dữ liệu
    const connection = await createConnection(dbConfig);
    console.log("Connected to the database");
    // Thực hiện các thao tác khác ở đây nếu cần thiết
  } catch (error) {
    console.error("Unable to connect to the database:", error);
    // Xử lý lỗi kết nối ở đây, có thể throw hoặc thực hiện các hành động cần thiết
  }
}
