import { EntityManager, Transaction, getRepository } from "typeorm";
import { OrderDetail } from "../models";
import { CreateOrderDto } from "./dto/create_product.dto";
import { OrderStatus } from "../helper/constant";

class OrderDetailRepository {
  async createNewOrderDetail(
    createNewOrderDetail: CreateOrderDto,
    userId: number,
    transactionalEntityManager: EntityManager
  ): Promise<OrderDetail | null> {
    const orderDetailRepository =
      transactionalEntityManager.getRepository(OrderDetail);

    try {
      const newOrderDetail = orderDetailRepository.create({
        user: { id: userId },
        total: createNewOrderDetail.total,
        shipMethod: createNewOrderDetail.shipMethod,
        modePay: createNewOrderDetail.modePay,
        status: OrderStatus.WAIT_DELIVER,
        note: createNewOrderDetail.note,
        address: { id: createNewOrderDetail.addressId },
      });
      const createdOrderDetail = await orderDetailRepository.save(
        newOrderDetail
      );
      return createdOrderDetail;
    } catch (error) {
      console.error("Error updating last login", error);
      throw error;
    }
  }
  async getListOrder(
    userId: number,
    transactionalEntityManager: EntityManager
  ): Promise<Array<OrderDetail> | null> {
    const orderDetailRepository =
      transactionalEntityManager.getRepository(OrderDetail);

    try {
      const listOrder = await orderDetailRepository
        .createQueryBuilder("orderDetail")
        .leftJoin("orderDetail.user", "user")
        .leftJoin("orderDetail.address", "address")
        .leftJoin("orderDetail.orderItems", "orderItems")
        .where("user.id = :userId", { userId })
        .select([
          "orderDetail",
          "user.name",
          "user.id",
          "user.role",
          "user.avatar",
          "orderItems",
          "address"
        ])
        .getMany();

      return listOrder;
    } catch (error) {
      console.error("Error updating last login", error);
      throw error;
    }
  }

  async getOrderDetailById(
    userId: number,
    orderId: number,
    transactionalEntityManager: EntityManager
  ): Promise<OrderDetail | null> {
    const orderDetailRepository =
      transactionalEntityManager.getRepository(OrderDetail);

    try {
      const orderDetail = await orderDetailRepository
        .createQueryBuilder("orderDetail")
        .leftJoin("orderDetail.user", "user")
        .leftJoin("orderDetail.address", "address")
        .leftJoin("orderDetail.orderItems", "orderItems")
        .where("orderDetail.id = :orderId", { orderId })
        .andWhere("user.id = :userId", { userId })
        .select([
          "orderDetail",
          "user.name",
          "user.id",
          "user.role",
          "user.avatar",
          "orderItems",
          "address"
        ])
        .getOne();

      return orderDetail;
    } catch (error) {
      console.error("Error updating last login", error);
      throw error;
    }
  }
}

const orderDetailRepository = new OrderDetailRepository();
export { orderDetailRepository };
