import express from "express";
import { ERROR_FORBIDDEN, ERROR_UNAUTHORIZED } from "../helper/constant";
import { returnResponse } from "../helper/response";
import jwt, { JwtPayload } from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

export const isAuthenticated = async (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) => {
  const authHeader = req.headers["authorization"]; //Bearer authorization
  if (!authHeader) {
    return res.send(returnResponse(ERROR_UNAUTHORIZED, "Unauthorized", null));
  }
  const token = authHeader.split(" ")[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET ?? "123") as JwtPayload;
    //@ts-ignore
    req.userId = decoded.sub;
    next();
  } catch (err) {
    return res.send(returnResponse(ERROR_FORBIDDEN, "Invalid token", null));
  }
};
