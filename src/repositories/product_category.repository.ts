import { getRepository } from "typeorm";
import { ProductCategory } from "../models";

export const getProductCategories = async (): Promise<Array<ProductCategory>> => {

  const productCategoryRepository = getRepository(ProductCategory);
  try {
    const categories = await productCategoryRepository.find();
    console.log(categories)
    return categories;
  } catch (error) {
    // Handle errors (e.g., log or throw)
    console.error("Error fetching product categories:", error);
    throw error;
  }
};
