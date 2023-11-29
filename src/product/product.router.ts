import express from "express";
import { createNewProduct, findProductById, getProducts, searchProduct } from "./product.controller";


const router = express.Router();

router.get("/", getProducts);
router.post("/new_product", createNewProduct);
router.get("/detail/:id", findProductById);
router.get("/search", searchProduct);

export default router;
