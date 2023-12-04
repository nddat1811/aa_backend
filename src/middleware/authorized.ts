import express from "express";
import { ERROR_FORBIDDEN } from "../helper/constant";
import { returnResponse } from "../helper/response";
import jwt, { JwtPayload } from "jsonwebtoken";

export const isAuthenticated = async (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) => {
  try {
    const cookiesName: string | undefined = process.env.COOKIES_NAME;
    if (!cookiesName) {
      return res.send(returnResponse(ERROR_FORBIDDEN, "Invalid cookie", null));
    }
    // console.log(req.cookies);
    const sessionToken = req.cookies[cookiesName];

    if (!sessionToken) {
      return res.send(returnResponse(ERROR_FORBIDDEN, "Invalid cookie", null));
    }

    const decoded = jwt.verify(sessionToken, process.env.JWT_SECRET ?? "123") as JwtPayload;
    console.log("tokenL ", decoded);
    console.log("aaaaaaaaaaaaaaaaaaaaaa")

    // const token = jwt.verify(sessionToken, jwtKey) as jwt.JwtPayload;
    // const existingUser = await getUserBySessionToken(sessionToken);

    // if (!existingUser) {
    //   return res.sendStatus(403);
    // }

    // merge(req, { identity: existingUser });

    return next();
  } catch (error) {
    console.log(error);
    return res.sendStatus(400);
  }
};

// const validateToken = async (req: Request) => {
//   const tokenString = req.headers?.authorization?.replace("Bearer ", "");

//   if (!tokenString) {
//     // Token không tồn tại trong header
//     return null;
//   }

//   try {
//     const token = jwt.verify(tokenString, "123") as JwtPayload;

//     if (token && typeof token.sub === 'number') {
//       const userID = token.sub;
//       return userID;
//     } else {
//       return null;
//     }
//   } catch (error) {
//     console.error("Error validating token");
//     return null;
//   }
// };
