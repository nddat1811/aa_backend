import express from "express";
import PingController from "../controllers/ping.controller";
import ProductCategoryRouter from "./product_category.router";

const router = express.Router();

router.get("/ping", async (_req, res) => {
  const controller = new PingController();
  const response = await controller.getMessage();
  return res.send(response);
});

router.use("/product_category", ProductCategoryRouter)

export default router;
