import express from "express";
import ProductCategoryController from "../controllers/product_category.controller";
import returnResponse, { CODE_SUCCESS, ERROR_BAD_REQUEST } from "../helper/response";

const router = express.Router();

/**
 * @openapi
 * /product_category:
 *   get:
 *     summary: Get all product categories
 *     responses:
 *       '200':
 *         description: A list of product categories.
 */
router.get("/", async (_req, res) => {
  const controller = new ProductCategoryController();
  const response = await controller.getProductCategories();
  if (!response) {
    res.send(
      returnResponse(ERROR_BAD_REQUEST, "Dữ liệu trả về thất bại", response)
    );
  }
  res.send(
    returnResponse(CODE_SUCCESS, "Dữ liệu trả về thành công", response)
  );
});

/**
 * @openapi
 * /product_category/get/{id}:
 *   get:
 *     summary: Get a product category by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       '200':
 *         description: Product category details.
 *       '404':
 *         description: No product category found.
 */
router.get("/get/:id", async (req, res) => {
  const controller = new ProductCategoryController();
  const response = "await controller.getComment(req.params.id);";
  if (!response) res.status(404).send({ message: "No comment found" });
  return res.send(response);
});

export default router;
