import { UserSchema, type User } from "../schema/user.schema.js";
import { prisma } from "../lib/client.prisma.js";
import { apiResponse } from "../utils/apiResponse.js";
import { apiError } from "../utils/apiError.js";

export const getUsers = async () => {
  const users = await prisma.user.findMany();
  return users;
};

export const getUser = async (id: string) => {
  try {
    const user = await prisma.user.findUnique({
      where: {
        id,
      },
    });
    return apiResponse(user, 200);
  } catch (error : any) {
    return apiError(error.message || error || "Something went wrong", 404);
  }
};

export const createUser = async (user: User) => {
  const newUser = await prisma.user.create({
    data: user,
  });
  return apiResponse(newUser, 201);
};

export const updateUser = async (id: string, user: User) => {
  const updatedUser = await prisma.user.update({
    where: {
      id,
    },
    data: user,
  });
  return apiResponse(updatedUser, 200);
};

export const deleteUser = async (id: string) => {
  const deletedUser = await prisma.user.delete({
    where: {
      id,
    },
  });
  return apiResponse(deletedUser, 200);
};

