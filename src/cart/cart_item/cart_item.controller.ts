import {
  CODE_SUCCESS,
  ERROR_BAD_REQUEST,
  ERROR_UNAUTHORIZED,
} from "../../helper/constant";
import { returnResponse } from "../../helper/response";
import { Request, Response } from "express";
import { cartItemRepository } from "./cart_item.repository";
import { cartRepository } from "../cart.repository";
import { productService } from "../../product/product.service";
import { CartItem } from "../../models";
import { cartItemService } from "./cart_item.service";
/**
 * @openapi
 * /v1/cart_item/list:
 *   get:
 *     summary: Get all product (include deleted Product)
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1  # Default value for page
 *         description: The page number for pagination.
 *       - in: query
 *         name: pageSize
 *         schema:
 *           type: integer
 *           default: 10  # Default value for pageSize
 *         description: The number of items to return per page.
 *       - in: query
 *         name: del
 *         schema:
 *           type: boolean
 *           default: false  # Default value for get all product (include deleted)
 *           description: The flag to get all product
 *     responses:
 *       '200':
 *         description: The data of the product list has been successfully returned
 *       '400':
 *         description: The returned data is unsuccessful.
 */
const testAPI = async (req: Request, res: Response): Promise<void> => {
  try {
    const response = await cartItemRepository.isProductInCart(
      1,
      1,
      "Free size"
    );
    if (!response) {
      res.send(
        returnResponse(
          ERROR_BAD_REQUEST,
          "The returned data is unsuccessful.",
          response
        )
      );
    } else {
      res.send(
        returnResponse(
          CODE_SUCCESS,
          "The data of the product list has been successfully returned",
          response
        )
      );
    }
  } catch (error) {
    console.error("Error while processing products:", error);
    res.status(500).send("Internal Server Error");
  }
};
/**
 * @openapi
 * /v1/cart_item/add_cart:
 *   post:
 *     summary: add product into cart
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               productId:
 *                 type: number
 *                 description: The product code.
 *                 default: 1
 *               size:
 *                 type: string
 *                 description: The product name.
 *                 default: "Free size"
 *               quantity:
 *                 type: number
 *                 description: The product name.
 *                 default: 1

 *     responses:
 *       '200':
 *         description: The data of the product list has been successfully returned
 *       '400':
 *         description: The returned data is unsuccessful.
 */
const addToCart = async (req: Request, res: Response): Promise<void> => {
  try {
    //@ts-ignore
    const userId = req.userId;
    const { productId, quantity, size } = req.body;

    if (!productId || !quantity || !size) {
      res.send(returnResponse(ERROR_BAD_REQUEST, "Invalid request body", null));
      return;
    }

    const [cartItem, code, msg] = await cartItemService.addToCart(productId, userId,  size, quantity);
    res.send(returnResponse(code, msg, cartItem));
  } catch (error) {
    console.error("Error while processing products:", error);
    res.status(500).send("Internal Server Error");
  }
};
export { testAPI, addToCart };
