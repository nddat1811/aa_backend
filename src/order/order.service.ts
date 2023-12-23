import {
  CODE_SUCCESS,
  ERROR_BAD_REQUEST,
  ERROR_UNAUTHORIZED,
} from "../helper/constant";
import { CreateOrderDto } from "./dto/create_product.dto";
import { OrderDetail, OrderItem } from "../models";
import { orderDetailRepository } from "./order.repository";
import { orderItemRepository } from "./order_item/order_item.repository";
import { cartItemRepository } from "../cart/cart_item/cart_item.repository";
import { getRepository, getConnection, getManager } from "typeorm";
import { productInventoryRepository } from "../inventory/inventory.repository";

class OrderDetailService {
  async createNewOrderDetail(
    userId: number,
    createOrder: CreateOrderDto
  ): Promise<[OrderDetail | null, number, string]> {
    return getConnection().transaction(async (transactionalEntityManager) => {
      let errorOccurred = false;

      try {
        const createdNewOrderDetail =
          await orderDetailRepository.createNewOrderDetail(
            createOrder,
            userId,
            transactionalEntityManager
          );

        if (!createdNewOrderDetail) {
          return [null, ERROR_BAD_REQUEST, "Can't create new order detail"];
        }

        const orderItemPromises = createOrder.items.map(async (item) => {
          if (!errorOccurred) {
            const newOrderItem = await orderItemRepository.createNewOderItem(
              item.quantity,
              item.price,
              item.product_id,
              createdNewOrderDetail.id,
              transactionalEntityManager
            );

            if (!newOrderItem) {
              errorOccurred = true;
              transactionalEntityManager.query("ROLLBACK");
              console.log(`Can't create new order item ${item.product_id}`);
            }

            // Assuming cartItemRepository has a method to delete a cart item
            const del = await cartItemRepository.deleteCartItem(
              item.product_id,
              userId
            );
            if (!del) {
              transactionalEntityManager.query("ROLLBACK");
              errorOccurred = true;
              console.log(`Can't delete item ${item.product_id} in cart`);
            }

            const editQuantity = await productInventoryRepository.editInventory(
              item.product_id,
              item.quantity,
              transactionalEntityManager
            );
            if (!editQuantity) {
              transactionalEntityManager.query("ROLLBACK");
              errorOccurred = true;
              console.log(
                `Can't edit quantity item ${item.product_id} in cart`
              );
            }
          }
        });

        // Wait for all promises inside the loop to resolve
        await Promise.all(orderItemPromises);

        if (errorOccurred) {
          await transactionalEntityManager.query("ROLLBACK");
          return [
            null,
            ERROR_BAD_REQUEST,
            "Error occurred during order creation",
          ];
        }

        return [
          createdNewOrderDetail,
          CODE_SUCCESS,
          "Order created successfully",
        ];
      } catch (error) {
        // If any error occurs, the transaction will be rolled back
        console.error("Error creating new order", error);
        return [null, ERROR_BAD_REQUEST, "Error creating new order"];
      }
    });
  }

  async getOrderDetailById(
    userId: number,
    orderId: number
  ): Promise<[OrderDetail | null, number, string]> {
    const transactionalEntityManager = getManager(); // Replace with your method of obtaining the EntityManager
    const orderDetail = await orderDetailRepository.getOrderDetailById(
      userId,
      orderId,
      transactionalEntityManager
    );
    if(!orderDetail ){
      return [null, ERROR_BAD_REQUEST, `Can't get order ${orderId}`];
    }
    return [orderDetail, CODE_SUCCESS, "Get list order successfully"];
  }
  async getListOrder(
    userId: number
  ): Promise<[Array<OrderDetail> | null, number, string]> {
    const transactionalEntityManager = getManager(); // Replace with your method of obtaining the EntityManager
    const listOrder = await orderDetailRepository.getListOrder(
      userId,
      transactionalEntityManager
    );
    if(!listOrder || listOrder.length == 0){
      return [null, ERROR_BAD_REQUEST, "Can't get list order"];
    }
    return [listOrder, CODE_SUCCESS, "Get list order successfully"];
  }
}

const orderDetailService = new OrderDetailService();

export { orderDetailService };