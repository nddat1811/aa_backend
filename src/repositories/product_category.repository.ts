import { getRepository } from "typeorm";
import { ProductCategory } from "../models";

export const getProductCategories = async (): Promise<Array<ProductCategory>> => {
  const productCategoryRepository = getRepository(ProductCategory);
  return productCategoryRepository.find();
};
