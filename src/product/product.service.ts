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

const indexName = "products";
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
          "product.description",
          "product.price",
          "product.createdAt",
          "product.updatedAt",
          "product.deletedAt",
          "inventory.quantity",
          "inventory.id",
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
          category: product.category?.name,
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

  async createProduct(
    createProductDto: CreateProductDto
  ): Promise<[Product | null, Error | null]> {
    const productRepository = getRepository(Product);
    const categoryRepository = getRepository(ProductCategory);
    const inventoryRepository = getRepository(ProductInventory);
    const discountRepository = getRepository(ProductDiscount);

    try {
      const { quantity, categoryId, discountId, ...productData } =
        createProductDto;
      // CreateTạo new Product from DTO
      const newProduct = productRepository.create({
        ...productData,
      });

      // find category and check
      if (categoryId !== undefined && categoryId !== null) {
        // Assuming `categoryRepository.findOne` returns a Promise<ProductCategory>
        const category = await categoryRepository.findOneBy({
          id: categoryId,
        });

        if (category) {
          newProduct.category = category;
        } else {
          return [null, Error("Category not found")];
        }
      }
      // create new Inventory - map with new Product
      const newInventory = inventoryRepository.create({
        quantity,
      });

      const createdInventory = await inventoryRepository.save(newInventory);
      //Assign to new Product
      newProduct.inventory = createdInventory;

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
          category: createdProduct.category?.name,
          inventory: createdProduct.inventory,
          createdAt: createdProduct.createdAt,
          updatedAt: createdProduct.updatedAt,
          deletedAt: createdProduct.deletedAt,
        },
      });
      console.log("hiihi: ", createdProduct);
      return [createdProduct, null];
    } catch (error) {
      console.error("Error creating product", error);
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
  async findProductByIdToUpdate(productId: number): Promise<Product | null> {
    try {
      const productRepository = getRepository(Product);
      const foundProduct = await productRepository
        .createQueryBuilder("product")
        .leftJoin("product.category", "category")
        .leftJoin("product.inventory", "inventory")
        // .leftJoinAndSelect("product.productReviews", "productReviews")
        // .leftJoinAndSelect("product.discount", "discount")
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
          // "productReviews",
          // "discount",
        ])
        .where({
          id: productId,
        })
        .getOne();

      // console.log(foundProduct);
      return foundProduct || null; // Return null if the product is not found
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
        index: "products",
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
                        category: categoryName,
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
      console.log("\n\n\nhi: ", body);
      //Handle total of search Products
      let total = 0;
      let totalHits: number | SearchTotalHits | undefined = body.hits.total;

      if (totalHits !== undefined) {
        if (typeof totalHits !== "number") {
          total = totalHits.value;
        }
      } else {
        console.log("Total Hits is undefined.");
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

  async updateProduct(
    productId: string,
    updateProductDto: CreateProductDto
  ): Promise<[Product | null, Error | null]> {
    const productRepository = getRepository(Product);
    const categoryRepository = getRepository(ProductCategory);
    const inventoryRepository = getRepository(ProductInventory);

    try {
      // Find existing product by ID
      const existingProduct = await productRepository
        .createQueryBuilder("product")
        .leftJoin("product.category", "category")
        .leftJoin("product.inventory", "inventory")
        .leftJoinAndSelect("product.productReviews", "productReviews")
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
          "product.deletedAt",
          "inventory.quantity",
          "inventory.id",
          "category.name",
          "productReviews",
          "discount",
        ])
        .where({
          id: productId,
        })
        .getOne();
      // return Product not found by ID
      if (!existingProduct) {
        return [null, Error("Product not found by ID")];
      }
      const { quantity, categoryId, ...updatedProductData } = updateProductDto;
      // Update existing product properties
      productRepository.merge(existingProduct, updatedProductData);

      // Update category if categoryId is provided
      if (existingProduct.category != categoryId) {
        if (categoryId !== undefined && categoryId !== null) {
          const category = await categoryRepository.findOneBy({
            id: categoryId,
          });

          if (category) {
            existingProduct.category = category;
          } else {
            return [null, Error("Category not found")];
          }
        }
      }

      // Update inventory if quantity is provided
      if (quantity !== undefined && quantity !== null) {
        const inventoryId = existingProduct.inventory?.id;
        const inventory = await inventoryRepository.findOneBy({
          id: inventoryId,
        });

        if (inventory && inventory.quantity != quantity) {
          inventory.quantity = quantity;
          await inventoryRepository.save(inventory);
        } else {
          return [null, Error("Inventory not found")];
        }
      }

      // Save the updated product into the database
      const updatedProduct = await productRepository.save(existingProduct);

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
              category: updatedProduct.category?.name,
              inventory: updatedProduct.inventory?.quantity,
              createdAt: updatedProduct.createdAt,
              updatedAt: updatedProduct.updatedAt,
              deletedAt: updatedProduct.deletedAt,
            },
          },
        });
      } else {
        return [null, Error("Can't update product in elasticsearch")];
      }

      return [updatedProduct, null];
    } catch (error) {
      console.error("Error updating product", error);
      throw error;
    }
  }
}

const productService = new ProductService();

export { productService };
