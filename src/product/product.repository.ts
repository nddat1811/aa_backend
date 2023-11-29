import { Brackets, DataSource, getRepository } from "typeorm";
import {
  Product,
  ProductCategory,
  ProductDiscount,
  ProductInventory,
} from "../models";
import { CreateProductDto } from "./dto/create_product.dto";
import { elasticSearchClient } from "../helper/elasticsearch";

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
class ProductService {
  async getAllProducts(
    offset: number,
    limit: number,
    del: boolean
  ): Promise<ProductPage> {
    const productRepository = getRepository(Product);

    try {
      const queryBuilder = productRepository
        .createQueryBuilder("product")
        .leftJoin("product.category", "category")
        .leftJoin("product.inventory", "inventory")
        .leftJoinAndSelect("product.cartItems", "cartItems")
        .leftJoinAndSelect("product.productReviews", "productReviews")
        .leftJoinAndSelect("product.orderItems", "orderItems")
        .leftJoinAndSelect("product.discount", "discount")
        .select([
          "product.id",
          "product.code",
          "product.name",
          "product.images",
          "product.origin",
          "product.material",
          "product.size",
          "product.warranty",
          "product.createdAt",
          "product.updatedAt",
          "inventory.quantity",
          "category.name",
          "cartItems",
          "orderItems",
          "discount",
          "productReviews",
        ])
        .skip(offset)
        .take(limit);

      if (!del) {
        // Only include this condition if del is false (include soft-deleted records)
        queryBuilder.withDeleted();
      }

      const [products, total] = await queryBuilder.getManyAndCount();

      const currentPage = Math.ceil((offset + 1) / limit);
      const currentTotal = products.length;
      return {
        total,
        currentTotal,
        currentPage,
        data: products,
      };
    } catch (error) {
      console.error("Error fetching products", error);
      throw error;
    }
  }

  async createProduct(createProductDto: CreateProductDto): Promise<Product> {
    const productRepository = getRepository(Product);
    const categoryRepository = getRepository(ProductCategory);
    const inventoryRepository = getRepository(ProductInventory);
    const discountRepository = getRepository(ProductDiscount);

    try {
      const { quantity, categoryId, discountId, ...productData } =
        createProductDto;
      // Tạo mới đối tượng Product từ DTO
      const newProduct = productRepository.create({
        ...productData,
      });

      if (categoryId !== undefined && categoryId !== null) {
        // Assuming `categoryRepository.findOne` returns a Promise<ProductCategory>
        const category = await categoryRepository.findOneBy({
          id: categoryId,
        });

        if (category) {
          newProduct.category = category;
        } else {
          // Handle the case where the category with the given ID is not found
          // You might throw an error, log a message, or handle it in another way
        }
      }

      const newInventory = inventoryRepository.create({
        quantity,
      });

      const createdInventory = await inventoryRepository.save(newInventory);

      newProduct.inventory = createdInventory;

      // Lưu đối tượng mới vào cơ sở dữ liệu
      const createdProduct = await productRepository.save(newProduct);
      await elasticSearchClient.index({
        index: "products",
        body: {
          // Chọn các trường bạn muốn index
          id: createdProduct.id,
          name: createdProduct.name,
          code: createdProduct.code,
          images: createdProduct.images,
          origin: createdProduct.origin,
          material: createdProduct.material,
          size: createdProduct.size,
          warranty: createdProduct.warranty,
          description: createdProduct.description,
          price: createdProduct.price,
          category: createdProduct.category?.name,
          inventory: createdProduct.inventory?.quantity,
          createdAt: createdProduct.createdAt,
          updatedAt: createdProduct.updatedAt,
          deletedAt: createdProduct.deletedAt,
        },
      });
      console.log("hiihi: ", createdProduct);
      return createdProduct;
    } catch (error) {
      console.error("Error creating product", error);
      throw error;
    }
  }

  async findProductById(productId: string): Promise<Product | null> {
    try {
      const id = +productId;

      const body = await elasticSearchClient.search({
        index: "products", // Replace with your Elasticsearch index name
        body: {
          query: {
            term: { id: id },
          },
        },
      });

      const hits = body.hits.hits;
      if (hits.length === 0) {
        return null; // Product not found
      }

      console.log(hits[0]);

      return hits[0]._source as Product;

      // const productRepository = getRepository(Product);
      // const foundProduct = await productRepository
      //   .createQueryBuilder("product")
      //   .leftJoin("product.category", "category")
      //   .leftJoin("product.inventory", "inventory")
      //   .leftJoinAndSelect("product.productReviews", "productReviews")
      //   .leftJoinAndSelect("product.discount", "discount")
      //   .select([
      //     "product.id",
      //     "product.code",
      //     "product.name",
      //     "product.images",
      //     "product.origin",
      //     "product.material",
      //     "product.size",
      //     "product.warranty",
      //     "product.createdAt",
      //     "product.updatedAt",
      //     "inventory.quantity",
      //     "category.name",
      //     "productReviews",
      //     "discount",
      //   ])
      //   .where({
      //     id: id,
      //   })
      //   .getOne();

      // console.log(foundProduct);
      // return foundProduct || null; // Return null if the product is not found
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
    priceMax: number
  ) {
    try {
      console.log(
        `${categoryName},  ${priceMin}, ${priceMax}, ${fullTextSearch}`
      );
      const searchParams = {
        index: "products",
        body: {
          from: offset,
          size: limit,
          query: {
            bool: {
              must: [
                categoryName.trim()
                  ? {
                      match: {
                        category: categoryName.trim(),
                      },
                    }
                  : null,
                {
                  bool: {
                    should: [
                      {
                        match: {
                          name: `${fullTextSearch}`,
                        },
                      },
                      {
                        match: {
                          code: `${fullTextSearch}`,
                        },
                      },
                      {
                        wildcard: {
                          name: `*${fullTextSearch}*`,
                        },
                      },
                      {
                        wildcard: {
                          code: `*${fullTextSearch}*`,
                        },
                      },
                    ],
                  },
                },
              ],
            },
          },
        },
      };

      const body = await elasticSearchClient.search(searchParams);
      console.log("\n\n\nhi: ", body);
      let total = 0;
      let totalHits: number | SearchTotalHits | undefined = body.hits.total;

      if (totalHits !== undefined) {
        if (typeof totalHits !== "number") {
          total = totalHits.value;
        }
      } else {
        console.log("Total Hits is undefined.");
      }

      const currentTotal = body.hits.hits.length;
      const currentPage = Math.ceil((offset + 1) / limit);
      const products = body.hits.hits.map((hit) => hit._source);
      return {
        total,
        currentTotal,
        currentPage,
        data: products,
      };
    } catch (error) {
      console.error("Error while searching products:", error);
      throw error; // You might want to handle this error more gracefully in a production environment
    }
  }
}

const productService = new ProductService();

export { productService };
