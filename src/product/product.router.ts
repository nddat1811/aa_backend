import express from "express";
import { createNewProduct, findProductById, getProducts } from "./product.controller";


const router = express.Router();

router.get("/", getProducts);
router.post("/new_product", createNewProduct);
router.get("/detail/:id", findProductById);

export default router;
