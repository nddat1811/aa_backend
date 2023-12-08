import express from "express";
import { isAuthenticated } from "../middleware/authorized";
import { findUserByEmail } from "./user.controller";
// import {
//   createNewProductCategory,
//   getProductCategories,
//   updateProductCategory
// } from "./product_category.controller";

const router = express.Router();

router.get("/test", isAuthenticated, findUserByEmail);


export default router;
