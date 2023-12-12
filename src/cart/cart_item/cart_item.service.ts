import { CartItem } from "../../models";
import { cartItemRepository } from "./cart_item.repository";
import { cartRepository } from "../cart.repository";
import { productService } from "../../product/product.service";
import {
    CODE_SUCCESS,
    ERROR_BAD_REQUEST,
    ERROR_UNAUTHORIZED,
  } from "../../helper/constant";

class CartItemService {
  async addToCart(
    productId: string,
    userId: number,
    size: string,
    quantity: number
  ): Promise<[CartItem | null, number, string]> {
    try {
      const product = await productService.findProductById(productId);
      const checkCartExist = await cartRepository.checkCartExist(userId);

      if (!checkCartExist) {
        const cart = await cartRepository.createNewCart(userId);

        if (!cart?.id || !product) {
          return [null, ERROR_BAD_REQUEST, "Can't create new cart or can't find product"]
        }

        const newCartItem = await cartItemRepository.createNewItem(
          quantity,
          +product.price!,
          +productId,
          cart.id
        );

        return [newCartItem, CODE_SUCCESS,  "Add to cart has been successfully returned"];
      } else {
        const checkExist = await cartItemRepository.isProductInCart(
          +productId,
          userId,
          size
        );

        if (checkExist) {
          (checkExist as CartItem).quantity += quantity;

          const inventoryQuantity = product?.inventory;
          //@ts-ignore
          if (checkExist.quantity > inventoryQuantity) {
            return [null, ERROR_BAD_REQUEST, "The quantity > the inventory quantity"];
          }

          const updatedCartItem = await cartItemRepository.updateCartItem(
            checkExist
          );
          return [updatedCartItem, CODE_SUCCESS,  "Add to cart has been successfully returned"];
        } else if (product) {
          const newCartItem = await cartItemRepository.createNewItem(
            quantity,
            +product.price!,
            +productId,
            checkCartExist.id
          );

          return [newCartItem, CODE_SUCCESS,  "Add to cart has been successfully returned"];
        }
      }
      return [null, 0, ""];
    } catch (error) {
      console.error("Error while processing products:", error);
      return [null, 500, "Internal Server Error"];
    }
  }
}

const cartItemService = new CartItemService();

export { cartItemService };
