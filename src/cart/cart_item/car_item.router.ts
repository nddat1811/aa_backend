import express from "express";
import { addToCart, testAPI } from "./cart_item.controller";
import { isAuthenticated } from "../../middleware/authorized";

const router = express.Router();

router.get("/list", testAPI);
router.post("/add_cart", isAuthenticated, addToCart);

export default router;
