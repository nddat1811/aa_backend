import { getRepository } from "typeorm";

import { User } from "../models";
import * as bcrypt from "bcrypt";
import { CreateUserDto } from "./dto/create_user.dto";
import { UserRole } from "../helper/constant";

class UserRepository {

  async findUserByEmail(emailInput: string): Promise<User | null> {
    const userRepository = getRepository(User);
    try {
      const user = await userRepository.findOneBy({
        email: emailInput,
      });

      return user;
    } catch (error) {
      // Handle errors (e.g., log or throw)
      console.error("Error fetching user:", error);
      throw error;
    }
  }
  async createNewUser(
    userInput: CreateUserDto
  ): Promise<[User | null, Error | null]> {
    const userRepository = getRepository(User);
    try {
      const newUser = userRepository.create({
        ...userInput,
        role: UserRole.USER,
      });
      console.log(newUser);
      const createdUser = await userRepository.save(newUser);

      return [createdUser, null];
    } catch (error) {
      console.error("Error creating product", error);
      throw error;
    }
  }
}

const userRepository = new UserRepository();
export {userRepository};
