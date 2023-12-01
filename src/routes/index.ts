import express from "express";
import ProductCategoryRouter from "../product_category/product_category.router";
import ProductRouter from "../product/product.router"

const router = express.Router();

router.use("/v1/product_category", ProductCategoryRouter)
router.use("/v1/product", ProductRouter)


export default router;
