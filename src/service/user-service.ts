// import type { User } from "@prisma/client";
import prisma from "../DB.ts";

type UserDto = {
  name: string,
  birthDay: Date,
  email: string,
  password: string
  role: 'USER' | 'ADMIN',
  isActive: boolean,
}

class UserService {
  async create(userData: UserDto) {
    return prisma.user.create({ data: userData });
  }

  async getAll() {
    return prisma.user.findMany();
  }

  async getOneById(id: number) {
    return prisma.user.findUnique({ where: { id } });
  }

  async getOneByEmail(email: string) {
    return prisma.user.findUnique({ where: { email } });
  }

  async blockUser(id: number) {
    return prisma.user.update({
      where: { id },
      data: { isActive: false }
    })
  }
}

export default new UserService();