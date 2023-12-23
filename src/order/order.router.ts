
import express from "express";
import { isAuthenticated } from "../middleware/authorized";
import { creatNewOrder, getListOrder, getOrderDetailById } from "./order.controller";

const router = express.Router();

router.get("/list", isAuthenticated, getListOrder );
router.post("/new", isAuthenticated, creatNewOrder);
router.get("/detail/:id", isAuthenticated, getOrderDetailById );
// router.put("/update_cart", isAuthenticated, updateCart);
// router.delete("/delete", isAuthenticated, deleteItemInCart);

export default router;
