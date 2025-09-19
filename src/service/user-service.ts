// import type { User } from "@prisma/client";
import bcrypt from "bcrypt";
import prisma from "../DB.ts";
import ErrorResponse, { NotFoundError } from "../utils/error-response.ts";

type UserDto = {
  name: string,
  birthDay: Date,
  email: string,
  password: string,
  role: 'USER' | 'ADMIN',
  isActive: boolean,
}

class UserService {
  async create(userData: UserDto) {
    const exists = await this.userExists(userData.email);
    if (exists) {
      throw new ErrorResponse(400, 'Пользователь с таким логином уже существует');
    }
    const hashedPassword = await bcrypt.hash(userData.password, 10);
    const newUser = await prisma.user.create({ data: {
      ...userData,
      password: hashedPassword,
    } });
    const { password, ...user } = newUser;
    return user;
  }

  async auth({ email, password }: { email: string, password: string }) {
    const user = await this.getOneByEmail(email);
    if (!user) {
      throw new NotFoundError('Пользователь не найден');
    }
    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      throw new ErrorResponse(403, 'Пароль не верный')
    }
    return user;
  }

  async getAll() {
    return prisma.user.findMany();
  }

  async getOneById(id: number) {
    const userData = await prisma.user.findUnique({ where: { id } });
    if (!userData) {
      throw new NotFoundError('Пользователь не найден');
    } else {
      const { password, ...user } = userData;
      return user;
    }
  }

  private async getOneByEmail(email: string) {
    return prisma.user.findUnique({ where: { email } });
  }

  private async userExists(email: string) {
    const user = await prisma.user.findUnique({ where: { email } });
    return !!user;
  }

  async blockUser(id: number, isActive = false) {
    const userData = await prisma.user.update({
      where: { id },
      data: { isActive }
    });
    if (!userData) {
      throw new NotFoundError('Пользователь не найден');
    } else {
      const { password, ...user } = userData;
      return user;
    }
  }

}

export default new UserService();