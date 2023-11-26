import express from "express";
import getProductCategories from "../controllers/product_category.controller";


const router = express.Router();

router.get("/", getProductCategories);

export default router;
