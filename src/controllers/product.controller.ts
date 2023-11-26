// ProductCategoryController.ts
import { Request, Response } from "express";
import {
  CODE_SUCCESS,
  ERROR_BAD_REQUEST,
  returnResponse,
  returnPagingResponse,
} from "../helper/response";
import { productRepository } from "../repositories/product.repository";

/**
 * @openapi
 * /v1/product:
 *   get:
 *     summary: Get all product
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *         description: The page number for pagination.
 *       - in: query
 *         name: pageSize
 *         schema:
 *           type: integer
 *         description: The number of items to return per page.
 *     responses:
 *       '200':
 *         description: Trả về danh sách product về thành công
 *       '400':
 *         description: Dữ liệu trả về thất bại
 */
const getProducts = async (req: Request, res: Response): Promise<void> => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const pageSize = parseInt(req.query.pageSize as string) || 10;
    const offset = (page - 1) * pageSize;

    const response = await productRepository.getAllProducts(offset, pageSize);
    if (!response) {
      res.send(
        returnResponse(ERROR_BAD_REQUEST, "Dữ liệu trả về thất bại", response)
      );
    } else {
      res.send(
        returnPagingResponse(CODE_SUCCESS, "Trả về danh sách product về thành công", 100, 10, 1, response )
        //code
        // mess
        // total : all sp 12
        // limit: pageSize so san pham trong 1 trang  5
        // offset: Page trang do 3
        // respone : số sản phẩm trả về sẽ 2 do 12/5 = 2.4 --> trang 3 se la 2 san pham
      );
    }
  } catch (error) {
    console.error("Error while processing products:", error);
    res.status(500).send("Internal Server Error");
  }
};

export default getProducts;
