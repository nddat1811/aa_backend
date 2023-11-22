import { Get, Route } from "tsoa";
import { ProductCategory } from "../models";
import { getProductCategories } from "../repositories/product_category.repository";


@Route("category")
export default class ProductCategoryController {
  @Get("/")
  public async getProductCategories(): Promise<Array<ProductCategory>>  {
    return getProductCategories()
  }
}
