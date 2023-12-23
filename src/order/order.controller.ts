import {
  CODE_SUCCESS,
  ERROR_BAD_REQUEST,
  ERROR_UNAUTHORIZED,
} from "../helper/constant";
import { returnResponse } from "../helper/response";
import { Request, Response } from "express";
import { CreateOrderDto } from "./dto/create_product.dto";
import { orderDetailService } from "./order.service";

/**
   * @openapi
   * /v1/cart_item/update_cart:
   *   put:
   *     summary: Update cartItem in cart
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
   *         description: Update Item in cart has been successfully returned
   *       '400':
   *         description: Error
   */
const creatNewOrder = async (req: Request, res: Response): Promise<void> => {
  try {
    //@ts-ignore
    const userId = req.userId;
    const createOrder: CreateOrderDto = req.body;
    console.log(createOrder);
    const [newOrder, code, msg] = await orderDetailService.createNewOrderDetail(
      +userId,
      createOrder
    );
    res.send(returnResponse(code, msg, newOrder));
  } catch (error) {
    console.error("Error while processing products:", error);
    res.status(500).send("Internal Server Error");
  }
};

const getListOrder = async (req: Request, res: Response): Promise<void> => {
  try {
    //@ts-ignore
    const userId = req.userId;
    // const createOrder: CreateOrderDto = req.body;
    const [listOrder, code, msg] = await orderDetailService.getListOrder(
      +userId,
    );
    res.send(returnResponse(code, msg, listOrder));
  } catch (error) {
    console.error("Error while processing products:", error);
    res.status(500).send("Internal Server Error");
  }
};

const getOrderDetailById = async (req: Request, res: Response): Promise<void> => {
  try {
    //@ts-ignore
    const userId = req.userId;
    const orderId = req.params.id;
    const [orderDetail, code, msg] = await orderDetailService.getOrderDetailById(
      +userId,
      +orderId,
    );
    res.send(returnResponse(code, msg, orderDetail));
  } catch (error) {
    console.error("Error while processing products:", error);
    res.status(500).send("Internal Server Error");
  }
};

export { creatNewOrder, getListOrder, getOrderDetailById };
