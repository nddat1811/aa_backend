import { getRepository } from "typeorm";
import { ProductCategory } from "../models";
import { CreateProductCategoryDto } from "./dto/create_product_category.dto";
import { elasticSearchClient } from "../helper/elasticsearch";

class ProductCategoryService {
  async getAllProductCategories(): Promise<Array<ProductCategory>> {
    const categoryRepository = getRepository(ProductCategory);
    try {
      const categories = await categoryRepository
        .createQueryBuilder("category")
        .select(["category"])
        .getMany();

      return categories;
    } catch (error) {
      // Handle errors (e.g., log or throw)
      console.error("Error fetching product categories:", error);
      throw error;
    }
  }
  async createProductCategory(
    createProductCategoryDto: CreateProductCategoryDto
  ): Promise<[ProductCategory | null, Error | null]> {
    const categoryRepository = getRepository(ProductCategory);
    try {
      const newProductCategory = categoryRepository.create({
        ...createProductCategoryDto,
      });
      const createdProductCategory = await categoryRepository.save(
        newProductCategory
      );

      return [createdProductCategory, null];
    } catch (error) {
      console.error("Error creating product", error);
      throw error;
    }
  }

  async updateProductCategory(
    productCategoryId: string,
    updateProductCategoryDto: CreateProductCategoryDto
  ): Promise<[ProductCategory | null, Error | null]> {
    const categoryRepository = getRepository(ProductCategory);

    try {
      // Find existing product by ID
      const existingProductCategory = await categoryRepository
        .createQueryBuilder("category")
        .select(["category.id", "category.name", "category.code"])
        .where({
          id: productCategoryId,
        })
        .getOne();
      // return Product not found by ID
      if (!existingProductCategory) {
        return [null, Error("Product category not found by ID")];
      }

      const preName = existingProductCategory.name;
      // Update existing product properties
      categoryRepository.merge(
        existingProductCategory,
        updateProductCategoryDto
      );
      // Save the updated product into the database
      const updatedProductCategory = await categoryRepository.save(
        existingProductCategory
      );

      // Update the product in ElasticSearch
      // Search ID of product in elasticSearch
      const searchResponse = await elasticSearchClient.search({
        index: "products",
        body: {
          query: {
            bool: {
              must: [
                {
                  match: {
                    category: preName,
                  },
                },
              ],
            },
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

        for (const hit of hits) {
        console.log(hit)
          await elasticSearchClient.update({
            index: "products",
            id: hit._id,
            body: {
              doc: {
                category: existingProductCategory.name,
              },
            },
          });
        }
      } else {
        return [null, Error("Can't update product in elasticsearch")];
      }

      return [updatedProductCategory, null];
    } catch (error) {
      console.error("Error updating product", error);
      throw error;
    }
  }
}

const productCategoryService = new ProductCategoryService();

export { productCategoryService };
