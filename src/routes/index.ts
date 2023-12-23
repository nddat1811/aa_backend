import express from "express";
import ProductCategoryRouter from "../product_category/product_category.router";
import ProductRouter from "../product/product.router";
import AuthRouter from "../auth/auth.router";
import UserRouter from "../user/user.router";
import AddressRoute from "../address/address.router"
import CartItemRoute from "../cart/cart_item/car_item.router"
import OrderRouter from "../order/order.router"

const router = express.Router();

router.use("/v1/product_category", ProductCategoryRouter);
router.use("/v1/product", ProductRouter);
router.use("/v1/auth", AuthRouter);
router.use("/v1/user", UserRouter);
router.use("/v1/address", AddressRoute);
router.use("/v1/cart_item", CartItemRoute);
router.use("/v1/order", OrderRouter);

export default router;
