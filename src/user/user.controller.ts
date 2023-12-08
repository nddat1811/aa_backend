import { Request, Response } from "express";
// import {
//   CODE_SUCCESS,
//   ERROR_BAD_REQUEST,
//   CODE_CREATED_SUCCESS,
//   returnResponse,
//   returnPagingResponse,
//   ERROR_NOT_FOUND,
// } from "../helper/response";

/**
 * @swagger
 * /v1/user/test:
 *   get:
 *     summary: Get product by ID
 *     description: Retrieve a product based on its ID.
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
const findUserByEmail = async (req: Request, res: Response): Promise<void> => {
  try {
    res.send("hi");

  } catch (error) {
    console.error("Error while finding product:", error);
    res.status(500).send("Internal Server Error");
  }
};

export { findUserByEmail };
