import express from "express";
import PingController from "../controllers/ping.controller";
import ProductCategoryRouter from "./product_category.router";

const router = express.Router();

/**
 * @openapi
 * /ping:
 *   get:
 *     summary: Get all product categories
 *     responses:
 *       '200':
 *         description:  App is up and running
 */
router.get("/ping", async (_req, res) => {
  const controller = new PingController();
  const response = await controller.getMessage();
  return res.send(response);
});

router.use("/product_category", ProductCategoryRouter)

export default router;
