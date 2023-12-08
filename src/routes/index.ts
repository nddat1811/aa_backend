import express from "express";
import ProductCategoryRouter from "../product_category/product_category.router";
import ProductRouter from "../product/product.router";
import AuthRouter from "../auth/auth.router";
import UserRouter from "../user/user.router";

const router = express.Router();

router.use("/v1/product_category", ProductCategoryRouter);
router.use("/v1/product", ProductRouter);
router.use("/v1/auth", AuthRouter);
router.use("/v1/user", UserRouter);

export default router;
