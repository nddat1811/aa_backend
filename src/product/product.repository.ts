import { EntityManager, getManager } from "typeorm";
import { elasticSearchClient } from "../helper/elasticsearch";
import { CreateProductDto } from "./dto/create_product.dto";
import {
  Product,
  ProductCategory,
  ProductDiscount,
  ProductInventory,
} from "../models";
import { productInventoryRepository } from "../inventory/inventory.repository";
import {
  CODE_CREATED_SUCCESS,
  CODE_SUCCESS,
  ERROR_BAD_REQUEST,
  ERROR_NOT_FOUND,
} from "../helper/constant";
import { productCategoryRepository } from "../product_category/product_category.repository";

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

class ProductRepository {
  async getListProduct(
    offset: number,
    limit: number,
    del: boolean,
    transactionalEntityManager: EntityManager
  ): Promise<ProductPage> {
    const productRepository = transactionalEntityManager.getRepository(Product);
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
          "product.description",
          "product.price",
          "product.createdAt",
          "product.updatedAt",
          "product.deletedAt",
          "inventory.quantity",
          "inventory.id",
          "category.id",
          "category.name",
          "cartItems",
          "orderItems",
          "discount",
          "productReviews",
        ]);

      // query all Products to mapping to elasticsearch
      const allProducts = await queryBuilder.getMany();
      //@ts-ignore
      // console.log(product.inventory);
      const bulkRequestBody = allProducts.flatMap((product) => [
        { index: { _index: indexName, _id: product.id } },
        {
          // Chọn các trường bạn muốn index
          id: product.id,
          name: product.name,
          code: product.code,
          images: product.images,
          origin: product.origin,
          material: product.material,
          size: product.size,
          warranty: product.warranty,
          description: product.description,
          price: product.price,
          category: product.category,
          inventory: product.inventory,
          createdAt: product.createdAt,
          updatedAt: product.updatedAt,
          deletedAt: product.deletedAt,
        },
      ]);

      const response = await elasticSearchClient.bulk({
        index: indexName,
        body: bulkRequestBody,
      });

      if (response.errors) {
        console.error("Elasticsearch bulk operation errors:", response.items);
      }

      // del = true --> not include deleted product
      // del = false --> include deleted product
      if (!del) {
        // Only include this condition if del is false (include soft-deleted records)
        queryBuilder.withDeleted();
      }
      //skip offset and take limit
      queryBuilder.skip(offset).take(limit);
      //query and calc total
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

  async findProductById(productId: number): Promise<Product | null> {
    try {
      const id = +productId;

      const body = await elasticSearchClient.search({
        index: indexName,
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

      //   console.log(hits[0]);

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
    priceMax: number,
    sortValue: string
  ): Promise<ProductPage> {
    try {
      console.log(
        `${categoryName},  ${priceMin}, ${priceMax}, ${fullTextSearch} , ${sortValue},`
      );
      const searchParams = {
        index: indexName,
        body: {
          from: offset,
          size: limit,
          query: {
            bool: {
              must: [
                //check if have category --> query category
                categoryName
                  ? {
                      match: {
                        "category.name": categoryName,
                      },
                    }
                  : null,
                {
                  // match --> match 1 word in the sentence --> output
                  // wildcard --> match %word% in the sentence --> output
                  // use should --> or becuase match must input accurated word
                  // Ex: gold ring --> match input gold or ring --> output
                  // use wildcard --> %go% --> output
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
                //price in range (min, max)
                priceMin !== null && priceMax !== null
                  ? {
                      range: {
                        price: {
                          gte: priceMin,
                          lte: priceMax,
                        },
                      },
                    }
                  : null,
              ],
              // not included deleted != 1 (true)
              must_not: [
                {
                  term: {
                    deletedAt: 1,
                  },
                },
              ],
            },
          },
          sort: sortValue
            ? [
                {
                  price: {
                    order: sortValue, // Sắp xếp tăng dần theo giá
                  },
                },
                // {
                //   createdAt: {
                //     order: "desc", // Sắp xếp giảm dần theo createdAt
                //   },
                // },
              ]
            : undefined,
        },
      };

      const body = await elasticSearchClient.search(searchParams);
      //Handle total of search Products
      let total = 0;
      let totalHits: number | SearchTotalHits | undefined = body.hits.total;

      if (totalHits !== undefined) {
        if (typeof totalHits !== "number") {
          total = totalHits.value;
        }
      } else {
        return {
          total: 0,
          currentTotal: 0,
          currentPage: 0,
          data: [],
        };
      }

      const currentTotal = body.hits.hits.length;
      const currentPage = Math.ceil((offset + 1) / limit);
      const products = body.hits.hits.map((hit) => hit._source);

      return {
        total,
        currentTotal,
        currentPage,
        data: products as Product[],
      };
    } catch (error) {
      console.error("Error while searching products:", error);
      throw error; // You might want to handle this error more gracefully in a production environment
    }
  }

  async createProduct(
    createProductDto: CreateProductDto,
    transactionalEntityManager: EntityManager
  ): Promise<[Product | null, number, Error | null]> {
    const productRepository = transactionalEntityManager.getRepository(Product);
    // const discountRepository =
    //   transactionalEntityManager.getRepository(ProductDiscount);
    try {
      const { quantity, categoryId, discountId, ...productData } =
        createProductDto;
      // CreateTạo new Product from DTO
      return await transactionalEntityManager.transaction(
        async (transactionalEntityManager) => {
          // Create new Product from DTO
          const newProduct = productRepository.create({
            ...productData,
          });

          // Create new Inventory - map with new Product
          const createdInventory =
            await productInventoryRepository.createNewInventory(
              //@ts-ignore
              quantity,
              transactionalEntityManager
            );

          // Assign to new Product
          if (createdInventory === null) {
            // Handle the case where createdInventory is null
            transactionalEntityManager.query("ROLLBACK");
            return [
              null,
              ERROR_BAD_REQUEST,
              new Error("Error creating new inventory"),
            ];
          } else {
            // Assign to new Product
            newProduct.inventory = createdInventory;
          }

          // Find category and check
          if (categoryId !== undefined && categoryId !== null) {
            const category =
              await productCategoryRepository.findProductCategoryByID(
                categoryId,
                transactionalEntityManager
              );

            if (category) {
              newProduct.category = category;
            } else {
              // Rollback the transaction in case of an error
              transactionalEntityManager.query("ROLLBACK");
              return [
                null,
                ERROR_NOT_FOUND,
                new Error("Error find category of product"),
              ];
            }
          }

          // Save newProduct into database
          const createdProduct = await productRepository.save(newProduct);

          // Insert new Product into elasticSearch
          await elasticSearchClient.index({
            index: indexName,
            body: {
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
              category: {
                id: createdProduct.category?.id,
                name: createdProduct.category?.name,
              },
              inventory: createdProduct.inventory,
              createdAt: createdProduct.createdAt,
              updatedAt: createdProduct.updatedAt,
              deletedAt: createdProduct.deletedAt,
            },
          });

          return [createdProduct, CODE_CREATED_SUCCESS, null];
        }
      );
    } catch (error) {
      transactionalEntityManager.query("ROLLBACK");
      console.error("Error creating product", error);
      return [null, ERROR_BAD_REQUEST, Error("Error creating new product")];
    }
  }

  async updateProduct(
    productId: number,
    updateProductDto: CreateProductDto,
    transactionalEntityManager: EntityManager
  ): Promise<[Product | null, number, Error | null]> {
    const productRepository = transactionalEntityManager.getRepository(Product);

    try {
      // Find existing product by ID
      const existingProduct = await this.findProductById(
        productId
      );

      if (!existingProduct) {
        return [null, ERROR_NOT_FOUND, Error("Product not found by ID")];
      }
      const { quantity, categoryId, ...updatedProductData } = updateProductDto;
      // Update existing product properties
      Object.assign(existingProduct, updatedProductData);
      // productRepository.merge(existingProduct, updatedProductData);
      return await transactionalEntityManager.transaction(
        async (transactionalEntityManager) => {
          // Update category if categoryId is provided
          if (existingProduct.category != categoryId) {
            if (categoryId !== undefined && categoryId !== null) {
              const category =
                await productCategoryRepository.findProductCategoryByID(
                  categoryId,
                  transactionalEntityManager
                );

              if (category) {
                existingProduct.category = category;
              } else {
                return [null, ERROR_NOT_FOUND, Error("Category not found")];
              }
            }
          }

          // Update inventory if quantity is provided
          if (
            quantity !== undefined &&
            quantity !== null &&
            existingProduct.inventory?.id
          ) {
            const inventoryId = existingProduct.inventory?.id;
            const inventory =
              await productInventoryRepository.findInventoryByID(
                inventoryId,
                transactionalEntityManager
              );
            if (inventory?.quantity != quantity) {
              if (inventory) {
                inventory.quantity = quantity;
                await productInventoryRepository.saveInventory(
                  inventory,
                  transactionalEntityManager
                );
              } else {
                return [null, ERROR_NOT_FOUND, Error("Inventory not found")];
              }
            }
          }

          // Save the updated product into the database
          const updatedProduct = await productRepository.save(
            existingProduct
          );
          if (updatedProduct == null) {
            return [null, ERROR_BAD_REQUEST, Error("Can't update product ")];
          }

          // Update the product in ElasticSearch
          // Search ID of product in elasticSearch
          const searchResponse = await elasticSearchClient.search({
            index: indexName,
            body: {
              query: {
                term: { id: updatedProduct.id },
              },
            },
          });
          if (searchResponse) {
            const hits = searchResponse.hits.hits as Array<{
              _id: string;
              _index: string;
              _score: number;
              _source: Record<string, unknown>;
            }>;

            await elasticSearchClient.update({
              index: indexName,
              id: hits[0]._id,
              body: {
                doc: {
                  name: updatedProduct.name,
                  code: updatedProduct.code,
                  images: updatedProduct.images,
                  origin: updatedProduct.origin,
                  material: updatedProduct.material,
                  size: updatedProduct.size,
                  warranty: updatedProduct.warranty,
                  description: updatedProduct.description,
                  price: updatedProduct.price,
                  category: {
                    id: updatedProduct.category?.id,
                    name: updatedProduct.category?.name,
                  },
                  inventory: updatedProduct.inventory,
                  createdAt: updatedProduct.createdAt,
                  updatedAt: updatedProduct.updatedAt,
                  deletedAt: updatedProduct.deletedAt,
                },
              },
            });
          } else {
            return [
              null,
              ERROR_BAD_REQUEST,
              Error("Can't update product in elasticsearch"),
            ];
          }
          // console.log(updatedProduct);

          return [updatedProduct, CODE_SUCCESS, null];
        }
      );
    } catch (error) {
      console.error("Error updating product", error);
      throw error;
    }
  }
}

const productRepository = new ProductRepository();
export { productRepository };
