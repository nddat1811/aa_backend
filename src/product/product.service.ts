import { Brackets, DataSource, getManager, getRepository } from "typeorm";
import {
  Product,
  ProductCategory,
  ProductDiscount,
  ProductInventory,
} from "../models";
import { CreateProductDto } from "./dto/create_product.dto";
import { elasticSearchClient } from "../helper/elasticsearch";
import { productRepository } from "./product.repository";
import {
  CODE_SUCCESS,
  ERROR_BAD_REQUEST,
  ERROR_NOT_FOUND,
} from "src/helper/constant";
import { productInventoryRepository } from "src/inventory/inventory.repository";
import { productCategoryRepository } from "src/product_category/product_category.repository";

interface ProductPage {
  total: number;
  currentTotal: number;
  currentPage: number;
  data: Array<Product>;
}

interface SearchTotalHits {
  value: number;
  relation: string;
}

const indexName = "products";
class ProductService {
  async getAllProducts(
    offset: number,
    limit: number,
    del: boolean
  ): Promise<ProductPage> {
    const transactionalEntityManager = getManager();
    try {
      const { total, currentTotal, currentPage, data } =
        await productRepository.getListProduct(
          offset,
          limit,
          del,
          transactionalEntityManager
        );

      return {
        total,
        currentTotal,
        currentPage,
        data: data,
      };
    } catch (error) {
      console.error("Error fetching products", error);
      throw error;
    }
  }

  async createProduct(
    createProductDto: CreateProductDto
  ): Promise<[Product | null, number, Error | null]> {
    try {
      const transactionalEntityManager = getManager();
      const [createdProduct, code, err] = await productRepository.createProduct(
        createProductDto,
        transactionalEntityManager
      );

      return [createdProduct, code, err];
    } catch (error) {
      console.error("Error creating product", error);
      throw error;
    }
  }

  async findProductById(productId: number): Promise<Product | null> {
    try {
      const product = await productRepository.findProductById(productId);
      return product;
    } catch (error) {
      console.error("Error while finding product by ID:", error);
      throw error; // You might want to handle this error more gracefully in a production environment
    }
  }
  
  async searchProducts(
    offset: number,
    limit: number,
    fullTextSearch: string,
    categoryName: string,
    priceMin: number,
    priceMax: number,
    sortValue: string
  ): Promise<ProductPage> {
    try {
      const { total, currentTotal, currentPage, data } =
        await productRepository.searchProducts(
          offset,
          limit,
          fullTextSearch,
          categoryName,
          priceMin,
          priceMax,
          sortValue
        );

      return {
        total,
        currentTotal,
        currentPage,
        data: data,
      };
    } catch (error) {
      console.error("Error while searching products:", error);
      throw error; // You might want to handle this error more gracefully in a production environment
    }
  }

  async updateProduct(
    productId: number,
    updateProductDto: CreateProductDto
  ): Promise<[Product | null, number, Error | null]> {
    const transactionalEntityManager = getManager();

    try {
      const [updatedProduct, code, err] = await productRepository.updateProduct(
        productId,
        updateProductDto,
        transactionalEntityManager
      );
      return [updatedProduct, code, err];
    } catch (error) {
      console.error("Error updating product", error);
      throw error;
    }
  }
}

const productService = new ProductService();

export { productService };
