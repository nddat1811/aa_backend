import "reflect-metadata";
import { createConnection } from "typeorm";
import express, { Express } from "express";
import morgan from "morgan";
import Router from "./routes";
import swaggerDocs from "./utils/swagger";
import {connectToDatabase} from "./config/database"

const PORT = 8000;

const app: Express = express();


app.use(express.json());
app.use(morgan("tiny"));
app.use(express.static("public"));


app.use(Router);

app.listen(PORT, async () => {

  console.log(`App is running at http://localhost:${PORT}`);
  
  await connectToDatabase();
  swaggerDocs(app, PORT);
});
