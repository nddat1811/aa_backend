import express from "express";
import ProductCategoryController from "../controllers/product_category.controller";

const router = express.Router();

router.get("/", async (_req, res) => {
  const controller = new ProductCategoryController();
  const response = await controller.getProductCategories();
  return res.send(response);
});

router.get("/:id", async (req, res) => {
  const controller = new ProductCategoryController();
  const response = "await controller.getComment(req.params.id);"
  if (!response) res.status(404).send({message: "No comment found"})
  return res.send(response);
});

export default router;
