import express from "express";
import { isAuthenticated } from "../middleware/authorized";
import { findUserByEmail, getDetailUserById, updateUser, updateUserPassword } from "./user.controller";
// import {
//   createNewProductCategory,
//   getProductCategories,
//   updateProductCategory
// } from "./product_category.controller";

const router = express.Router();

router.get("/test", isAuthenticated, findUserByEmail);
router.get("/detail/:id", getDetailUserById);
router.put("/update/:id", updateUser);
router.put("/update_password/:id", updateUserPassword);
//còn thiếu search user
//update (update cả payment và address)

export default router;
