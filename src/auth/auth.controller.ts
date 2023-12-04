import { Request, Response } from "express";
import {
  CODE_CREATED_SUCCESS,
  CODE_SUCCESS,
  ERROR_BAD_REQUEST,
  ERROR_CONFLICT,

} from "../helper/constant";
import { returnResponse } from "../helper/response";
import { userRepository } from "../user/user.repository";
import * as bcrypt from "bcrypt";
import { CreateUserDto } from "src/user/dto/create_user.dto";
import { User } from "../models";
import jwt, { SignOptions } from "jsonwebtoken";
import dotenv from 'dotenv';
dotenv.config();

interface JwtPayload {
  email: string;
  username: string;
  sub: string;
  role: string;
}

/**
 * @openapi
 * /v1/auth/login:
 *   post:
 *     summary: Login
 *     description: Authenticate a user with email and password.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 default: test
 *               password:
 *                 type: string
 *                 default: 123
 *     responses:
 *       '200':
 *         description: Successfully authenticated
 *       '400':
 *         description: Invalid email or password
 *       '500':
 *         description: Internal Server Error
 */
const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      res.send(
        returnResponse(
          ERROR_BAD_REQUEST,
          "Please input email and password",
          null
        )
      );
    }

    const user: User | null = await userRepository.findUserByEmail(email);

    const userPassword = user?.password || "";
    const checkPass = await bcrypt.compare(password, userPassword);

    if (!user || !checkPass) {
      res.send(
        returnResponse(ERROR_BAD_REQUEST, "Email or password invalid", null)
      );
      return;
    }

    const payload: JwtPayload = {
      sub: String(user.id),
      email: user.email ? String(user.email) : "",
      username: user.name ? String(user.name) : "",
      role: user.role,
    };

    const accessTokenOptions: SignOptions & { algorithm: "HS512" } = {
      expiresIn: "1d",
      algorithm: "HS512",
    };

    const refreshTokenOptions: SignOptions = {
      expiresIn: "30d",
    };

    let accessToken = jwt.sign(
      payload,
      process.env.JWT_SECRET ?? "123",
      accessTokenOptions
    );
    let refreshToken = jwt.sign(
      payload,
      "2", //process.env.REFRESH_TOKEN_SECRET,
      refreshTokenOptions
    );
    // const tokenCache = {
    //   id: String(user.id),
    //   tokens: [{ accessToken, refreshToken }],
    // };
    const cookiesName: string | undefined = process.env.COOKIES_NAME;

    if (accessToken && cookiesName) {
      res.cookie(cookiesName, accessToken);
      console.log("cookie: ", cookiesName)
    }

    res.send(
      returnResponse(CODE_SUCCESS, "Login success", {
        id: user.id,
        role: user.role,
        accessToken,
        refreshToken,
      })
    );
  } catch (error) {
    console.error("Error while processing product categories:", error);
    res.status(500).send("Internal Server Error");
  }
};

/**
 * @openapi
 * /v1/auth/register:
 *   post:
 *     summary: register
 *     description: Register a new user.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: The user's name.
 *                 default: test
 *               password:
 *                 type: string
 *                 description: The user's password.
 *                 default: test
 *               phone:
 *                 type: string
 *                 description: The user's phone.
 *                 default: '0975456662'  # Added single quotes to keep it as a string
 *               email:
 *                 type: string
 *                 description: The user's email.
 *                 default: test@gmail.com
 *               avatar:
 *                 type: string
 *                 description: The user's avatar.
 *                 nullable: true
 *               dob:
 *                 type: string
 *                 format: date
 *                 description: The user's warranty.
 *                 default: '2024-12-01'  # Added single quotes to keep it as a string
 *     responses:
 *       '200':
 *         description: Successfully registered
 *       '400':
 *         description: Invalid input data
 *       '500':
 *         description: Internal Server Error
 */
const register = async (req: Request, res: Response): Promise<void> => {
  try {
    const createUser: CreateUserDto = req.body;

    if (!createUser) {
      res.send(returnResponse(ERROR_BAD_REQUEST, "Invalid input ", null));
      return;
    }

    const existEmailUser: User | null = await userRepository.findUserByEmail(
      createUser.email
    );

    if (existEmailUser) {
      res.send(returnResponse(ERROR_CONFLICT, "Email already used ", null));
      return;
    }
    //hash password
    const saltRounds = 10;
    const salt = bcrypt.genSaltSync(saltRounds);
    const hashedPassword = bcrypt.hashSync(createUser.password, salt);
    createUser.password = hashedPassword;

    const [createdUser, err] = await userRepository.createNewUser(createUser);

    if (err) {
      res.send(returnResponse(ERROR_BAD_REQUEST, err.message, createdUser));
      return;
    } else {
      res.send(
        returnResponse(
          CODE_CREATED_SUCCESS,
          "User created successfully",
          createdUser
        )
      );
      return;
    }
    res.send("Ok");
  } catch (error) {
    console.error("Error while processing User:", error);
    res.status(500).send("Internal Server Error");
  }
};

export { login, register };