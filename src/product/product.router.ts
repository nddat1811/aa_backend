import express from "express";
import {
  createNewProduct,
  findProductById,
  getProducts,
  searchProduct,
  updateProduct,
} from "./product.controller";

const router = express.Router();

router.get("/list", getProducts);
router.post("/new_product", createNewProduct);
router.get("/detail/:id", findProductById);
router.get("/search", searchProduct);
router.put("/update_product/:id", updateProduct);

export default router;
