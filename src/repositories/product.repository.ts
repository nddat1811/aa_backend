import { DataSource, getRepository } from "typeorm";
import { Product } from "../models";
interface ProductPage {
  total: number;
  limit: number;
  currentPage: number;
  data: Array<Product>;
}

class ProductRepository {
  async getAllProducts(offset: number, limit: number): Promise<ProductPage> {
    const productRepository = getRepository(Product);

    try {
      const [products, total] = await productRepository
        .createQueryBuilder("product")
        .leftJoinAndSelect("product.category", "category")
        .leftJoinAndSelect("product.inventory", "inventory")
        .leftJoinAndSelect("product.productReviews", "productReviews")
        .leftJoinAndSelect("product.cartItems", "cartItems")
        .leftJoinAndSelect("product.orderItems", "orderItems")
        .leftJoinAndSelect("product.discount", "discount")
        .skip(offset)
        .take(limit)
        .getManyAndCount();

      const currentPage = Math.ceil((offset + 1) / limit);

      return {
        total,
        limit,
        currentPage,
        data: products,
      };
    } catch (error) {
      console.error("Error fetching products", error);
      throw error;
    }
  }
}

const productRepository = new ProductRepository();

export { productRepository };
