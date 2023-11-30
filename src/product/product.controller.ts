// ProductCategoryController.ts
import { Request, Response } from "express";
import {
  CODE_SUCCESS,
  ERROR_BAD_REQUEST,
  returnResponse,
  returnPagingResponse,
  ERROR_NOT_FOUND,
} from "../helper/response";
import { productService } from "./product.repository";
import { calcPagination } from "../helper/paging";
import { CreateProductDto } from "./dto/create_product.dto";

/**
 * @openapi
 * /v1/product:
 *   get:
 *     summary: Get all product (include deleted Product)
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1  # Default value for page
 *         description: The page number for pagination.
 *       - in: query
 *         name: pageSize
 *         schema:
 *           type: integer
 *           default: 10  # Default value for pageSize
 *         description: The number of items to return per page.
 *       - in: query
 *         name: del
 *         schema:
 *           type: boolean
 *           default: false  # Default value for get all product (include deleted)
 *           description: The flag to get all product
 *     responses:
 *       '200':
 *         description: The data of the product list has been successfully returned
 *       '400':
 *         description: The returned data is unsuccessful.
 */
const getProducts = async (req: Request, res: Response): Promise<void> => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const pageSize = parseInt(req.query.pageSize as string) || 10;
    const del = req.query.del === "true";
    const { offset, limit } = calcPagination(page, pageSize);

    const response = await productService.getAllProducts(offset, limit, del);
    if (!response) {
      res.send(
        returnResponse(
          ERROR_BAD_REQUEST,
          "The returned data is unsuccessful.",
          response
        )
      );
    } else {
      res.send(
        returnPagingResponse(
          CODE_SUCCESS,
          "The data of the product list has been successfully returned",
          response.total,
          response.currentTotal,
          response.currentPage,
          response.data
        )
      );
    }
  } catch (error) {
    console.error("Error while processing products:", error);
    res.status(500).send("Internal Server Error");
  }
};

/**
 * @openapi
 * /v1/product/new_product:
 *   post:
 *     summary: Create a new product
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               code:
 *                 type: string
 *                 description: The product code.
 *               name:
 *                 type: string
 *                 description: The product name.
 *               images:
 *                 type: string
 *                 description: The product images.
 *               origin:
 *                 type: string
 *                 description: The product origin.
 *               material:
 *                 type: string
 *                 description: The product material.
 *               size:
 *                 type: string
 *                 description: The product size.
 *               warranty:
 *                 type: string
 *                 description: The product warranty.
 *               description:
 *                 type: string
 *                 description: The product description.
 *               price:
 *                 type: number
 *                 description: The product price.
 *               categoryId:
 *                 type: integer
 *                 description: The ID of the product category.
 *               quantity:
 *                 type: integer
 *                 description: The quantity of the product inventory.
 *               discountId:
 *                 type: integer
 *                 description: The ID of the product discount.
 *     responses:
 *       '201':
 *         description: Product created successfully
 *       '400':
 *         description: Bad request - Invalid input data
 */
const createNewProduct = async (req: Request, res: Response): Promise<void> => {
  try {
    const createProductDto: CreateProductDto = req.body;

    const createdProduct = await productService.createProduct(createProductDto);

    if (!createdProduct) {
      res.send(
        returnResponse(
          ERROR_BAD_REQUEST,
          "Bad request - Invalid input data",
          createdProduct
        )
      );
    } else {
      res.send(
        returnResponse(
          CODE_SUCCESS,
          "Product created successfully",
          createdProduct
        )
      );
    }
  } catch (error) {
    console.error("Error while processing products:", error);
    res.status(500).send("Internal Server Error");
  }
};

/**
 * @swagger
 * /v1/product/detail/{id}:
 *   get:
 *     summary: Get product by ID
 *     description: Retrieve a product based on its ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the product to retrieve
 *         schema:
 *           type: string
 *           default: 1
 *     responses:
 *       200:
 *         description: Successful response
 *         content:
 *           application/json:
 *             example:
 *               code: 200
 *               message: Product found successfully
 *               data:
 *                 id: "123"
 *                 name: "Sample Product"
 *       404:
 *         description: Product not found
 *         content:
 *           application/json:
 *             example:
 *               code: 404
 *               message: Product not found
 *               data: null
 *       500:
 *         description: Internal Server Error
 *         content:
 *           application/json:
 *             example:
 *               code: 500
 *               message: Internal Server Error
 *               data: null
 */
const findProductById = async (req: Request, res: Response): Promise<void> => {
  try {
    const productId: string = req.params.id; // Assuming the ID is a string, adjust accordingly

    const foundProduct = await productService.findProductById(productId);

    console.log("found: ", foundProduct);
    if (!foundProduct) {
      res.send(returnResponse(ERROR_NOT_FOUND, "Product not found", null));
    } else {
      res.send(
        returnResponse(CODE_SUCCESS, "Product found successfully", foundProduct)
      );
    }
  } catch (error) {
    console.error("Error while finding product:", error);
    res.status(500).send("Internal Server Error");
  }
};

/**
 * @openapi
 * /v1/product/search:
 *   get:
 *     summary: Get products based on search criteria
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1  # Default value for page
 *         description: The page number for pagination.
 *       - in: query
 *         name: pageSize
 *         schema:
 *           type: integer
 *           default: 10  # Default value for pageSize
 *         description: The number of items to return per page.
 *       - in: query
 *         name: fullTextSearch
 *         schema:
 *           type: string
 *           description: Text to search in product code and name.
 *       - in: query
 *         name: categoryName
 *         schema:
 *           type: string
 *           description: The category name to filter by.
 *       - in: query
 *         name: priceMin
 *         schema:
 *           type: number
 *           default: 0  # Default value for minPrice
 *           description: The price min to filter by.
 *       - in: query
 *         name: priceMax
 *         schema:
 *           type: number
 *           default: 100000  # Default value for maxPrice
 *           description: The price max to filter by.
 *       - in: query
 *         name: sort
 *         schema:
 *           type: string
 *           enum:
 *             - asc
 *             - desc
 *           default: desc  # Default value for maxPrice
 *           description: The sorting order. Use 'asc' for ascending and 'desc' for descending.
 *     responses:
 *       '200':
 *         description: The data of the product list has been successfully returned
 *       '400':
 *         description: The returned data is unsuccessful.
 */
const searchProduct = async (req: Request, res: Response): Promise<void> => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const pageSize = parseInt(req.query.pageSize as string) || 10;
    const priceMin = parseInt(req.query.priceMin as string) || 1;
    const priceMax = parseInt(req.query.priceMax as string) || 10;
    const fullTextSearch = (req.query.fullTextSearch as string) || "";
    const categoryName = (req.query.categoryName as string) || "";
    const sort = (req.query.sort as string) || "asc";

    const { offset, limit } = calcPagination(page, pageSize);

    const foundProduct = await productService.searchProducts(
      offset,
      limit,
      fullTextSearch,
      categoryName,
      priceMin,
      priceMax,
      sort
    );

    if (!foundProduct) {
      res.send(returnResponse(ERROR_NOT_FOUND, "Product not found", null));
    } else {
      res.send(
        returnResponse(CODE_SUCCESS, "Product found successfully", foundProduct)
      );
    }
  } catch (error) {
    console.error("Error while finding product:", error);
    res.status(500).send("Internal Server Error");
  }
};
export { getProducts, createNewProduct, findProductById, searchProduct };