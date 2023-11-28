// ProductCategoryController.ts
import { Request, Response } from "express";
import { productCategoryRepository } from "./product_category.repository";
import {
  returnResponse,
  CODE_SUCCESS,
  ERROR_BAD_REQUEST,
} from "../helper/response";

/**
 * @openapi
 * /v1/product_category:
 *   get:
 *     summary: Get all product categories
 *     responses:
 *       '200':
 *         description: Trả về danh sách category về thành công
 *       '400':
 *         description: Dữ liệu trả về thất bại
 */
const getProductCategories = async (req: Request, res: Response): Promise<void> => {
  try {
    const response = await productCategoryRepository.getAllProductCategories();

    if (!response) {
      res.send(
        returnResponse(ERROR_BAD_REQUEST, "Dữ liệu trả về thất bại", response)
      );
    } else {
      res.send(
        returnResponse(CODE_SUCCESS, "Trả về danh sách category về thành công", response)
      );
    }
  } catch (error) {
    console.error("Error while processing product categories:", error);
    res.status(500).send("Internal Server Error");
  }
};




export default getProductCategories;
