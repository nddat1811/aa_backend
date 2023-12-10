import { getRepository } from "typeorm";

import { User } from "../models";
import * as bcrypt from "bcrypt";
import { CreateUserDto } from "./dto/create_user.dto";
import { UserRole } from "../helper/constant";
import { UpdateUserDto } from "./dto/update_user.dto";

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
      console.error("Error creating user", error);
      throw error;
    }
  }

  async getDetailUserById(id: number): Promise<User | null> {
    const userRepository = getRepository(User);
    try {
      const user = await userRepository
        .createQueryBuilder("user")
        .leftJoinAndSelect("user.userPayments", "payment")
        .leftJoinAndSelect("user.userAddresses", "address")
        .select([
          "user.id",
          "user.role",
          "user.name",
          "user.phone",
          "user.email",
          "user.dob",
          "user.avatar",
          "user.dob",
          "user.gender",
          "user.lastLogin",
          "user.createdAt",
          "user.updatedAt",
          "payment",
          "address",
        ])
        .where({
          id: id,
        })
        .getOne();

      return user;
    } catch (error) {
      // Handle errors (e.g., log or throw)
      console.error("Error fetching user:", error);
      throw error;
    }
  }

  async getDetailUserToUpdateById(id: number): Promise<User | null> {
    const userRepository = getRepository(User);
    try {
      const user = await userRepository.findOne({
        where: {
          id: id,
        },
      });
      return user;
    } catch (error) {
      // Handle errors (e.g., log or throw)
      console.error("Error fetching user:", error);
      throw error;
    }
  }

  async updateUser(updateUser: User): Promise<User | null> {
    const userRepository = getRepository(User);
    try {
      const updatedUser = await userRepository.save(updateUser);

      return updatedUser;
    } catch (error) {
      console.error("Error creating user", error);
      throw error;
    }
  }
}

const userRepository = new UserRepository();
export { userRepository };
