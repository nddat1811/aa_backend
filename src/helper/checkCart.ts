import { cartItemRepository } from "../cart/cart_item/cart_item.repository";
import { CartItem } from "../models";

export async function checkProductInCart(
  productId: string,
  userId: string,
  size: string
): Promise<number | false> {
  const cartItem: CartItem | null = await cartItemRepository.isProductInCart(
    +productId,
    +userId,
    size
  );

  return cartItem !== null ? cartItem.quantity || false : false;
}
